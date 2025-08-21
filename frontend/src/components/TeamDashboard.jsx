import {
  Users,
  Copy,
  Clock,
  Target,
  LogOut,
  Loader2,
  Check,
} from "lucide-react";
import MemberCard from "./MemberCard";
import { useState } from "react";

function TeamDashboard({ onLeaveTeam, teamData, currentUser }) {
  const [copied, setCopied] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleLeaveTeam = async () => {
    setLeaving(true);
    try {
      await onLeaveTeam();
    } catch (error) {
      console.error("Error leaving the team", error);
    } finally {
      setLeaving(false);
    }
  };

  // Copy join code
  const copyJoinCode = async () => {
    if (teamData?.joinCode) {
      await navigator.clipboard.writeText(teamData.joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // revert after 2s
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  console.log("team data", teamData);
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {teamData?.name}
                </h1>
                <p className="text-gray-600">
                  {teamData.members.length} members
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Join Code Display */}
              <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2">
                <span className="text-gray-700 font-mono font-semibold mr-2">
                  {teamData?.joinCode}
                </span>
                <button
                  onClick={copyJoinCode}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy join code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <button
                onClick={handleLeaveTeam}
                disabled={leaving}
                className="flex items-center text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Leave team"
              >
                {leaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Team Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Target className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {teamData.membersWithDetails.reduce(
                    (sum, member) => sum + member.totalSessionsToday,
                    0
                  )}
                </h3>
                <p className="text-gray-600">Total Sessions Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {formatTime(
                    teamData.membersWithDetails.reduce(
                      (sum, member) => sum + member.totalMinutesToday,
                      0
                    )
                  )}
                </h3>
                <p className="text-gray-600">Total Focus Time</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {
                    teamData.membersWithDetails.filter(
                      (member) => member.status === "active"
                    ).length
                  }
                </h3>
                <p className="text-gray-600">Active Now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Team Members</h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {teamData.membersWithDetails.map((member) => (
                <MemberCard
                  key={member.uid}
                  member={member}
                  teamData={teamData}
                  currentUser={currentUser}
                  formatTime={formatTime}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamDashboard;
