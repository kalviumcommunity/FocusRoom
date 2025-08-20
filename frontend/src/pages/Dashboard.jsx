import React from "react";
import PomodoroTimer from "../components/PomodoroTimer";
import PomodoroStats from "../components/PomodorStats";

const Dashboard = ({ userId = "current_user_id" }) => {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Main Content - Timer + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Pomodoro Timer */}

          <PomodoroTimer />

          {/* Right Side - Stats */}
          <div className="space-y-6">
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
