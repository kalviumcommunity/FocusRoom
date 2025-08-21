import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Plus,
  ArrowRight,
  RotateCw,
} from "lucide-react";
import { useUser } from "../context/userContext";
import { db } from "../config/firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const PRIORITY_STYLES = {
  High: "text-red-600",
  Medium: "text-yellow-600",
  Low: "text-green-600",
};

// No dummy data – tasks load from Firestore

const LeftMenu = ({ selected, onSelect }) => {
  const items = [
    { id: "today", label: "Today", icon: CalendarDays },
    { id: "upcoming", label: "Upcoming", icon: CalendarRange },
    { id: "completed", label: "Completed", icon: CheckCircle2 },
  ];

  return (
    <div className="w-60 h-fit">
      <ul className="p-2 space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = selected === it.id;
          return (
            <li key={it.id}>
              <button
                onClick={() => onSelect(it.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{it.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const Tabs = ({ counts, current, onChange }) => {
  const tabs = [
    { id: "todo", label: "To Do" },
    { id: "inprogress", label: "In Progress" },
    { id: "done", label: "Done" },
  ];

  return (
    <div className="flex items-center space-x-6 border-b border-gray-200">
      {tabs.map((t) => {
        const isActive = current === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`pb-3 -mb-px border-b-2 font-medium transition-colors ${
              isActive
                ? "text-gray-900 border-gray-900"
                : "text-gray-500 border-transparent hover:text-gray-900"
            }`}
          >
            {t.label} ({counts[t.id] || 0})
          </button>
        );
      })}
    </div>
  );
};

const Priority = ({ level }) => (
  <div className={`text-xs font-semibold ${PRIORITY_STYLES[level]}`}>{
    level
  } Priority</div>
);

const TaskRow = ({ task, onStart, onDone, onReopen }) => {
  return (
    <div className="py-6 flex items-center justify-between border-b border-gray-100">
      <div className="space-y-2">
        <Priority level={task.priority} />
        <div className="text-gray-900 font-semibold">{task.title}</div>
        <div className="text-gray-600 text-sm max-w-2xl">{task.description}</div>
        <div className="flex items-center space-x-3 pt-2">
          {task.status === "todo" && (
            <button
              onClick={() => onStart(task.id)}
              className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Start</span>
            </button>
          )}
          {task.status === "inprogress" && (
            <button
              onClick={() => onDone(task.id)}
              className="inline-flex items-center space-x-2 text-sm text-emerald-600 hover:text-emerald-800"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Done</span>
            </button>
          )}
          {task.status === "done" && (
            <button
              onClick={() => onReopen(task.id)}
              className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <RotateCw className="w-4 h-4" />
              <span>Reopen</span>
            </button>
          )}
        </div>
      </div>
      <div className="ml-6 w-72 h-44 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {task.image && (
          <img
            src={task.image}
            alt={task.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

const NewTaskForm = ({ onCreate, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [image, setImage] = useState("");

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center p-4 z-40">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
        <div className="text-lg font-semibold">New Task</div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
              placeholder="Task title"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
              placeholder="Short description"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Image URL</label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!title.trim()) return;
              onCreate({ title, description, priority, image });
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const Tasks = () => {
  const { user } = useUser();
  const [section, setSection] = useState("today");
  const [activeTab, setActiveTab] = useState("todo");
  const [tasks, setTasks] = useState([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [loading, setLoading] = useState(true);

  // Subscribe to the current user's tasks
  useEffect(() => {
    if (!user) return;
    const tasksCol = collection(db, "users", user.uid, "tasks");
    const q = query(tasksCol, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const loaded = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(loaded);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const counts = useMemo(() => {
    return tasks.reduce(
      (acc, t) => {
        if (t.status === "todo") acc.todo += 1;
        else if (t.status === "inprogress") acc.inprogress += 1;
        else if (t.status === "done") acc.done += 1;
        return acc;
      },
      { todo: 0, inprogress: 0, done: 0 }
    );
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (section === "completed") {
      return tasks.filter((t) => t.status === "done");
    }
    return tasks.filter((t) => t.status === activeTab);
  }, [tasks, section, activeTab]);

  const updateStatus = async (id, status) => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(ref, {
        status,
        completedAt: status === "done" ? serverTimestamp() : null,
      });
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const handleCreateTask = async ({ title, description, priority, image }) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "users", user.uid, "tasks"), {
        title,
        description,
        priority,
        image,
        status: "todo",
        createdAt: serverTimestamp(),
      });
      setActiveTab("todo");
      setShowNewTask(false);
    } catch (e) {
      console.error("Failed to create task", e);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="flex gap-6">
        <LeftMenu selected={section} onSelect={setSection} />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-900">
              {section === "completed" ? "Completed Tasks" : "Today’s Tasks"}
            </h1>
          </div>

          {section !== "completed" && (
            <Tabs counts={counts} current={activeTab} onChange={setActiveTab} />
          )}

          {section === "completed" && (
            <div className="mb-4 text-sm text-gray-600">
              Completed tasks: <span className="font-semibold text-gray-900">{counts.done}</span>
            </div>
          )}

          <div>
            {loading ? (
              <div className="py-16 text-center text-gray-500">Loading…</div>
            ) : visibleTasks.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                No tasks in this list.
              </div>
            ) : (
              visibleTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onStart={(id) => updateStatus(id, "inprogress")}
                  onDone={(id) => updateStatus(id, "done")}
                  onReopen={(id) => updateStatus(id, "todo")}
                />
              ))
            )}
          </div>

          
        </div>
      </div>

      <button
        onClick={() => setShowNewTask(true)}
        className="fixed bottom-6 right-6 inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700"
      >
        <Plus className="w-5 h-5" />
        <span>New Task</span>
      </button>

      {showNewTask && (
        <NewTaskForm
          onCreate={handleCreateTask}
          onClose={() => setShowNewTask(false)}
        />
      )}
    </div>
  );
};

export default Tasks;


