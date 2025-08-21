import React from "react";
import PomodoroTimer from "../components/PomodoroTimer";
import PomodoroStats from "../components/PomodorStats";
import TasksPanel from "../components/TasksPanel";
import { useUser } from "../context/userContext";
import { Link } from "react-router-dom";
import { CalendarDays, CheckSquare, BarChart3 } from "lucide-react";

const Dashboard = ({ userId = "current_user_id" }) => {
  const { user } = useUser();
  const displayName = user?.displayName || "There";
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <div className="p-6 sm:p-8 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Welcome back</div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">{displayName}</h1>
                <p className="text-sm text-gray-600 mt-1">{today}</p>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/tasks"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black"
                >
                  <CheckSquare className="w-4 h-4" /> Tasks
                </Link>
                <Link
                  to="/reports"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50"
                >
                  <BarChart3 className="w-4 h-4" /> Reports
                </Link>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-10 -top-10 w-44 h-44 bg-gradient-to-tr from-blue-100 to-emerald-100 rounded-full blur-2xl opacity-60" />
          </div>
        </div>

        {/* Main Content - Timer + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Pomodoro Timer */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-gray-800 font-medium">
                <CalendarDays className="w-5 h-5" /> Focus Session
              </div>
            </div>
            <PomodoroTimer />
          </div>

          {/* Right Side - Tasks on top, then Stats */}
          <div className="space-y-6">
            <TasksPanel />
            <PomodoroStats userId={userId} />
          </div>
        </div>

        {/* Additional Info Section */}
        {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How It Works
            </h3>
            <p className="text-sm text-gray-600">
              Work for 25 minutes, then take a 5-minute break. Repeat to
              maintain focus and productivity.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Stay Consistent
            </h3>
            <p className="text-sm text-gray-600">
              Build a daily habit by completing at least 2-4 pomodoro sessions
              every day for best results.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Track Progress
            </h3>
            <p className="text-sm text-gray-600">
              Monitor your focus hours, streaks, and session completion to
              continuously improve your productivity.
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
