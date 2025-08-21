import React, { useState, useEffect } from "react";
import { Clock, Target, Flame, TrendingUp, Calendar } from "lucide-react";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { useUser } from "../context/userContext";

const PomodoroStats = () => {
  const [stats, setStats] = useState({
    sessionsCompletedToday: 0,
    focusHoursToday: 0,
    totalSessionsThisWeek: 0,
    loading: true,
  });

  const { user } = useUser();
  const userId = user?.uid;

  // Helper function to get start and end of this week
  const getWeekRange = () => {
    const now = new Date();
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );
    const endOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() + 7
    );

    return {
      start: Timestamp.fromDate(startOfWeek),
      end: Timestamp.fromDate(endOfWeek),
    };
  };

  // Fetch user stats from Firestore
  const fetchUserStats = async () => {
    try {
      if (!userId) return;

      setStats((prev) => ({ ...prev, loading: true }));

      // 1️⃣ Get user doc for today's totals
      const userRef = doc(db, "Users", userId);
      const userSnap = await getDoc(userRef);

      let sessionsCompletedToday = 0;
      let focusHoursToday = 0;

      if (userSnap.exists()) {
        const data = userSnap.data();
        sessionsCompletedToday = data.totalSessionsToday || 0;
        focusHoursToday =
          Math.round((data.totalMinutesToday / 60) * 10) / 10 || 0;
      }

      // 2️⃣ Query for this week's completed sessions
      const week = getWeekRange();
      const pomodoroCollection = collection(db, "PomodoroSessions");
      const weekQuery = query(
        pomodoroCollection,
        where("userId", "==", userId),
        where("status", "==", "completed"),
        where("completedAt", ">=", week.start),
        where("completedAt", "<", week.end)
      );

      const weekSnapshot = await getDocs(weekQuery);
      const weekSessions = weekSnapshot.docs.map((doc) => doc.data());
      const totalSessionsThisWeek = weekSessions.filter(
        (session) => session.type === "work"
      ).length;

      setStats({
        sessionsCompletedToday,
        focusHoursToday,
        totalSessionsThisWeek,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchUserStats();

    // Refresh stats every 10 minutes
    const interval = setInterval(fetchUserStats, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userId]);
  const StatCard = ({ icon: Icon, title, value, subtitle, color = "red" }) => {
    const colorClasses = {
      red: "bg-red-50 border-red-200 text-red-600",
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      green: "bg-green-50 border-green-200 text-green-600",
      purple: "bg-purple-50 border-purple-200 text-purple-600",
      orange: "bg-orange-50 border-orange-200 text-orange-600",
    };

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900">
            {stats.loading ? (
              <div className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              value
            )}
          </div>
          <p className="text-sm font-medium text-gray-700">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6">
        {/* Sessions Completed Today */}
        <StatCard
          icon={Target}
          title="Sessions Completed"
          value={stats.sessionsCompletedToday}
          subtitle="Work sessions finished today"
          color="red"
        />

        {/* Focus Hours Today */}
        <StatCard
          icon={Clock}
          title="Focus Hours"
          value={`${stats.focusHoursToday}h`}
          subtitle="Total focused time today"
          color="blue"
        />

        {/* Weekly Total */}
        <StatCard
          icon={Calendar}
          title="This Week"
          value={stats.totalSessionsThisWeek}
          subtitle="Total sessions this week"
          color="purple"
        />
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Quick Insights
        </h3>
        <div className="space-y-2">
          {stats.loading ? (
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              {stats.sessionsCompletedToday >= 4 ? (
                <p className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full inline-block">
                  🎉 Great job! You're having a productive day
                </p>
              ) : stats.sessionsCompletedToday >= 1 ? (
                <p className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block">
                  👍 Good progress! Keep it up
                </p>
              ) : (
                <p className="text-sm text-orange-700 bg-orange-100 px-3 py-1 rounded-full inline-block">
                  💪 Time to focus! Start your first session
                </p>
              )}

              {stats.currentStreak >= 7 && (
                <p className="text-sm text-purple-700 bg-purple-100 px-3 py-1 rounded-full inline-block">
                  🔥 Amazing streak! You're on fire
                </p>
              )}

              {stats.focusHoursToday >= 2 && (
                <p className="text-sm text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full inline-block">
                  ⏰ {stats.focusHoursToday}+ hours of deep work today
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Stats updated every 10 minutes • Last updated:{" "}
          {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default PomodoroStats;
