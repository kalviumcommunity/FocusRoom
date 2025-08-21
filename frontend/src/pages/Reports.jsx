import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "../context/userContext";
import { db } from "../config/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
  CheckCircle2,
  BarChart3,
  Timer,
  CalendarRange as CalendarIcon,
  TrendingUp,
} from "lucide-react";

// Simple inline chart using SVG (no extra deps)
const BarChart = ({ data, height = 120 }) => {
  const width = 280;
  const padding = 8;
  const max = Math.max(1, ...data.map((d) => d.value));
  const barWidth = (width - padding * 2) / data.length;
  return (
    <svg width={width} height={height} className="overflow-visible">
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 24);
        return (
          <g key={d.label} transform={`translate(${padding + i * barWidth},0)`}>
            <rect
              x={4}
              y={height - 24 - h}
              width={barWidth - 8}
              height={h}
              rx={6}
              className="fill-blue-600/80"
            />
            <text
              x={barWidth / 2}
              y={height - 8}
              textAnchor="middle"
              className="text-[10px] fill-gray-600"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const DonutChart = ({ series, size = 160 }) => {
  const total = Math.max(1, series.reduce((s, d) => s + d.value, 0));
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className="fill-none stroke-gray-100"
        strokeWidth={12}
      />
      {series.map((s, i) => {
        const pct = s.value / total;
        const len = pct * circumference;
        const dashArray = `${len} ${circumference - len}`;
        const circle = (
          <circle
            key={s.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={12}
            className={`fill-none ${s.color}`}
            strokeDasharray={dashArray}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += len;
        return circle;
      })}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xl font-semibold fill-gray-900"
      >
        {total}
      </text>
    </svg>
  );
};

const RangeTabs = ({ value, onChange }) => {
  const options = [
    { id: "7d", label: "Last 7 days" },
    { id: "30d", label: "Last 30 days" },
    { id: "all", label: "All time" },
  ];
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-fit">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            value === o.id
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};

const Reports = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  const stats = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    if (range === "7d") start.setDate(end.getDate() - 6);
    if (range === "30d") start.setDate(end.getDate() - 29);

    const inRange = (date) => {
      return date >= new Date(start.setHours(0, 0, 0, 0)) && date <= end;
    };

    const filtered = tasks.filter((t) => {
      const created = t.createdAt?.toDate ? t.createdAt.toDate() : null;
      if (!created) return true; // fallback include
      return range === "all" ? true : inRange(created);
    });

    const total = filtered.length;
    const done = filtered.filter((t) => t.status === "done").length;
    const inprogress = filtered.filter((t) => t.status === "inprogress").length;
    const todo = filtered.filter((t) => t.status === "todo").length;

    const daysWindow = range === "30d" ? 30 : 7;
    const now = new Date();
    const days = [...Array(daysWindow)].map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (daysWindow - 1 - i));
      const label = d.toLocaleDateString(undefined, { weekday: "short" });
      const value = tasks.filter((t) => {
        if (!t.completedAt?.toDate) return false;
        const cd = t.completedAt.toDate();
        return (
          cd.getFullYear() === d.getFullYear() &&
          cd.getMonth() === d.getMonth() &&
          cd.getDate() === d.getDate()
        );
      }).length;
      return { label, value };
    });

    const priorities = ["High", "Medium", "Low"].map((p) => ({
      label: p,
      value: filtered.filter((t) => t.priority === p).length,
    }));

    // completion rate and streak
    const completionRate = total ? Math.round((done / total) * 100) : 0;

    const doneDates = tasks
      .filter((t) => t.status === "done" && t.completedAt?.toDate)
      .map((t) => {
        const d = t.completedAt.toDate();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      });
    const uniqDays = Array.from(new Set(doneDates)).sort((a, b) => b - a);
    let streak = 0;
    let cursor = new Date();
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
    for (;;) {
      const ts = cursor.getTime();
      if (uniqDays.includes(ts)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else break;
    }

    // series for donut
    const statusSeries = [
      { label: "Done", value: done, color: "stroke-emerald-500" },
      { label: "In Progress", value: inprogress, color: "stroke-blue-500" },
      { label: "To Do", value: todo, color: "stroke-gray-400" },
    ];

    return {
      total,
      done,
      inprogress,
      todo,
      days,
      priorities,
      completionRate,
      streak,
      statusSeries,
    };
  }, [tasks, range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-gray-800" /> Reports
        </h1>
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-4 h-4 text-gray-500" />
          <RangeTabs value={range} onChange={setRange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-gray-900 to-gray-700 text-white">
          <div className="text-sm text-gray-300">Total Tasks</div>
          <div className="mt-1 text-3xl font-semibold">{stats.total}</div>
          <div className="mt-4 text-xs text-gray-300 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {stats.completionRate}% completion rate
          </div>
        </div>
        <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-600 to-emerald-500 text-white">
          <div className="text-sm text-emerald-100">Completed</div>
          <div className="mt-1 text-3xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" /> {stats.done}
          </div>
          <div className="mt-4 text-xs text-emerald-100">Streak: {stats.streak} day(s)</div>
        </div>
        <div className="rounded-2xl p-5 bg-white border border-gray-200">
          <div className="text-sm text-gray-600">In Progress</div>
          <div className="mt-1 text-3xl font-semibold text-blue-700">{stats.inprogress}</div>
          <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
            <Timer className="w-3.5 h-3.5" /> Keep it going!
          </div>
        </div>
        <div className="rounded-2xl p-5 bg-white border border-gray-200">
          <div className="text-sm text-gray-600">To Do</div>
          <div className="mt-1 text-3xl font-semibold">{stats.todo}</div>
          <div className="mt-4 text-xs text-gray-500">Plan your next focus block</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Completed Over Time</h3>
            <div className="text-sm text-gray-600">{range === "30d" ? "Last 30 days" : range === "7d" ? "Last 7 days" : "All time"}</div>
          </div>
          <BarChart data={stats.days} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
          <div className="flex items-center gap-6">
            <DonutChart series={stats.statusSeries} />
            <ul className="space-y-2 text-sm">
              {stats.statusSeries.map((s) => (
                <li key={s.label} className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    s.label === "Done"
                      ? "bg-emerald-500"
                      : s.label === "In Progress"
                      ? "bg-blue-500"
                      : "bg-gray-400"
                  }`} />
                  <span className="text-gray-700 w-24">{s.label}</span>
                  <span className="font-semibold">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">By Priority</h3>
          <ul className="space-y-3">
            {stats.priorities.map((p) => (
              <li key={p.label} className="flex items-center justify-between">
                <span className="text-gray-700">{p.label}</span>
                <span className="font-semibold">{p.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Completed</h3>
          <ul className="divide-y divide-gray-100">
            {tasks
              .filter((t) => t.status === "done")
              .slice(0, 10)
              .map((t) => (
                <li key={t.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{t.title}</div>
                    <div className="text-xs text-gray-600">
                      {t.completedAt?.toDate
                        ? t.completedAt.toDate().toLocaleString()
                        : "—"}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700">Done</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;


