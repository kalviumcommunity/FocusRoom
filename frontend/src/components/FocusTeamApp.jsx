import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Copy,
  Clock,
  Target,
  User,
  LogOut,
  RefreshCw,
  UserMinus,
} from "lucide-react";

// Mock Firebase functions (replace with actual Firebase SDK)
const mockFirebase = {
  // Generate unique room code
  generateUniqueRoomCode: async () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code;
    let isUnique = false;

    while (!isUnique) {
      code = "";
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      // In real implementation, check against existing codes in Firestore
      isUnique = true; // Assume unique for demo
    }
    return code;
  },

  createTeam: async (teamData) => {
    console.log("Creating team:", teamData);
    return { id: "team_" + Date.now(), ...teamData };
  },

  joinTeam: async (joinCode, userId) => {
    console.log("Joining team with code:", joinCode);
    return { success: true, teamId: "team_demo" };
  },

  updateUserTeam: async (userId, teamId) => {
    console.log("Updating user team:", userId, teamId);
  },

  getTeamData: async (teamId) => {
    return {
      teamId: "team_demo",
      name: "Team Focus Champions",
      ownerId: "current_user_id",
      joinCode: "ABCD1234",
      members: ["current_user_id", "member_2", "member_3"],
      createdAt: new Date(),
    };
  },

  getTeamMembersStats: async (memberIds) => {
    return [
      {
        uid: "current_user_id",
        name: "Nidhish Agarwal",
        photoURL:
          "https://lh3.googleusercontent.com/a/ACg8ocIKdeVGedutYUpUnD4660iLumoFRgGxs2_duik6Vg8we9TrsA=s96-c",
        totalMinutesToday: 45,
        totalSessionsToday: 3,
        status: "active",
      },
      {
        uid: "member_2",
        name: "Alex Johnson",
        photoURL: "",
        totalMinutesToday: 120,
        totalSessionsToday: 5,
        status: "paused",
      },
      {
        uid: "member_3",
        name: "Sarah Chen",
        photoURL: "",
        totalMinutesToday: 90,
        totalSessionsToday: 4,
        status: "active",
      },
    ];
  },
};

const FocusTeamApp = () => {
  const [currentUser] = useState({
    uid: "current_user_id",
    name: "Nidhish Agarwal",
    email: "nidhish.agarwal@kalvium.community",
    photoURL:
      "https://lh3.googleusercontent.com/a/ACg8ocIKdeVGedutYUpUnD4660iLumoFRgGxs2_duik6Vg8we9TrsA=s96-c",
    teamId: null, // Will be set when user joins/creates team
  });

  const [userTeamId, setUserTeamId] = useState(null);
  const [view, setView] = useState("landing"); // 'landing', 'team-dashboard'
  const [teamData, setTeamData] = useState(null);
  const [membersStats, setMembersStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Check if user already has a team
    if (currentUser.teamId) {
      setUserTeamId(currentUser.teamId);
      loadTeamData(currentUser.teamId);
    }
  }, []);

  const loadTeamData = async (teamId) => {
    setLoading(true);
    try {
      const team = await mockFirebase.getTeamData(teamId);
      const stats = await mockFirebase.getTeamMembersStats(team.members);
      setTeamData(team);
      setMembersStats(stats);
      setView("team-dashboard");
    } catch (error) {
      console.error("Error loading team data:", error);
    }
    setLoading(false);
  };

  const createTeam = async () => {
    if (!teamName.trim()) return;

    setLoading(true);
    try {
      const joinCode = await mockFirebase.generateUniqueRoomCode();
      const newTeam = {
        name: teamName,
        ownerId: currentUser.uid,
        joinCode: joinCode,
        members: [currentUser.uid],
        createdAt: new Date(),
      };

      const createdTeam = await mockFirebase.createTeam(newTeam);
      await mockFirebase.updateUserTeam(currentUser.uid, createdTeam.id);

      setUserTeamId(createdTeam.id);
      setShowCreateModal(false);
      setTeamName("");
      await loadTeamData(createdTeam.id);
    } catch (error) {
      console.error("Error creating team:", error);
    }
    setLoading(false);
  };

  const joinTeam = async () => {
    if (!joinCode.trim()) return;

    setLoading(true);
    try {
      const result = await mockFirebase.joinTeam(joinCode, currentUser.uid);
      if (result.success) {
        await mockFirebase.updateUserTeam(currentUser.uid, result.teamId);
        setUserTeamId(result.teamId);
        setShowJoinModal(false);
        setJoinCode("");
        await loadTeamData(result.teamId);
      }
    } catch (error) {
      console.error("Error joining team:", error);
    }
    setLoading(false);
  };

  const copyJoinCode = () => {
    navigator.clipboard.writeText(teamData.joinCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const leaveTeam = () => {
    setUserTeamId(null);
    setTeamData(null);
    setMembersStats([]);
    setView("landing");
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Landing Page
  if (view === "landing") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-red-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">Focus Teams</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Stay focused together with your team
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Create Team Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Create Team
                </h2>
                <p className="text-gray-600 mb-6">
                  Start a new focus team and invite others to join your
                  productivity journey
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full bg-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Create New Team
                </button>
              </div>
            </div>

            {/* Join Team Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Join Team
                </h2>
                <p className="text-gray-600 mb-6">
                  Enter a team code to join an existing focus team and
                  collaborate
                </p>
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Join Existing Team
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Create Team Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Create New Team
              </h3>
              <input
                type="text"
                placeholder="Enter team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setTeamName("");
                  }}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createTeam}
                  disabled={!teamName.trim() || loading}
                  className="flex-1 py-3 px-6 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Join Team Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Join Team
              </h3>
              <input
                type="text"
                placeholder="Enter team code (e.g., ABCD1234)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinCode("");
                  }}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={joinTeam}
                  disabled={!joinCode.trim() || loading}
                  className="flex-1 py-3 px-6 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? "Joining..." : "Join"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Team Dashboard
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
                <p className="text-gray-600">{membersStats.length} members</p>
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
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copySuccess && (
                <span className="text-green-600 text-sm font-medium">
                  Copied!
                </span>
              )}
              <button
                onClick={leaveTeam}
                className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
                title="Leave team"
              >
                <LogOut className="w-5 h-5" />
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
                  {membersStats.reduce(
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
                    membersStats.reduce(
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
                    membersStats.filter((member) => member.status === "active")
                      .length
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Team Members</h2>
              {teamData?.ownerId === currentUser.uid && (
                <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  <span className="text-sm">Regenerate Code</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {membersStats.map((member) => (
                <div
                  key={member.uid}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center">
                    <div className="relative mr-4">
                      {member.photoURL ? (
                        <img
                          src={member.photoURL}
                          alt={member.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          member.status === "active"
                            ? "bg-green-500"
                            : member.status === "paused"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {member.name}
                        {member.uid === teamData?.ownerId && (
                          <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            Owner
                          </span>
                        )}
                        {member.uid === currentUser.uid && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600 text-sm capitalize">
                        {member.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-800">
                        {member.totalSessionsToday}
                      </p>
                      <p className="text-xs text-gray-600">Sessions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-800">
                        {formatTime(member.totalMinutesToday)}
                      </p>
                      <p className="text-xs text-gray-600">Focus Time</p>
                    </div>
                    {teamData?.ownerId === currentUser.uid &&
                      member.uid !== currentUser.uid && (
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <UserMinus className="w-4 h-4" />
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mt-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">
              Today's Leaderboard
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {membersStats
                .sort((a, b) => b.totalMinutesToday - a.totalMinutesToday)
                .map((member, index) => (
                  <div
                    key={member.uid}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-gray-400"
                            : index === 2
                            ? "bg-orange-500"
                            : "bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex items-center">
                        {member.photoURL ? (
                          <img
                            src={member.photoURL}
                            alt={member.name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                        <span className="font-medium text-gray-800">
                          {member.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        {formatTime(member.totalMinutesToday)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {member.totalSessionsToday} sessions
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusTeamApp;
