import { useState, useEffect } from "react";

// Replace these imports with your actual Firebase imports
import TeamDashboard from "./TeamDashboard";
import {
  generateUniqueRoomCode,
  createTeam,
  joinTeam,
  updateUserTeam,
  getTeamData,
  leaveTeam as leaveTeamFirebase,
} from "../config/firebaseTeamUtils";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import JoinRoom from "./JoinRoom";

const FocusTeamApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userTeamId, setUserTeamId] = useState(null);
  const [view, setView] = useState("loading"); // 'loading', 'landing', 'team-dashboard'
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Initialize user and check for existing team
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Replace this with actual Firebase auth listener
        const unsub = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = { uid: user.uid, ...userDoc.data() };
            setCurrentUser(userData);

            if (userData.teamId) {
              setUserTeamId(userData.teamId);
              await loadTeamData(userData.teamId);
            } else {
              setView("landing");
            }
          } else {
            setView("landing");
          }
        });
        return () => unsub();
      } catch (error) {
        console.error("Error initializing user:", error);
        setView("landing");
      }
    };

    initializeUser();
  }, []);

  const loadTeamData = async (teamId) => {
    setLoading(true);
    try {
      // const team = await getTeamData(teamId);
      const team = await getTeamData(teamId);
      setTeamData(team);
      setView("team-dashboard");
    } catch (error) {
      console.error("Error loading team data:", error);
      setErrorMsg("Failed to load team data");
      setView("landing");
    }
    setLoading(false);
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim() || !currentUser) {
      setErrorMsg("Please enter a team name");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const joinCode = await generateUniqueRoomCode();

      const newTeam = {
        name: teamName.trim(),
        ownerId: currentUser.uid,
        joinCode,
        members: [currentUser.uid],
        createdAt: new Date(),
      };

      const createdTeam = await createTeam(newTeam);

      await updateUserTeam(currentUser.uid, createdTeam.id);

      // Update local state
      setUserTeamId(createdTeam.id);
      setCurrentUser((prev) => ({ ...prev, teamId: createdTeam.id }));
      setShowCreateModal(false);
      setTeamName("");

      await loadTeamData(createdTeam.id);
    } catch (error) {
      console.error("Error creating team:", error);
      setErrorMsg("Failed to create team. Please try again.");
    }
    setLoading(false);
  };

  const handleJoinTeam = async () => {
    if (!joinCode.trim() || !currentUser) {
      setErrorMsg("Please enter a team code");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const result = await joinTeam(joinCode, currentUser.uid);

      if (result.success) {
        await updateUserTeam(currentUser.uid, result.teamId);

        // Update local state
        setUserTeamId(result.teamId);
        setCurrentUser((prev) => ({ ...prev, teamId: result.teamId }));
        setShowJoinModal(false);
        setJoinCode("");

        await loadTeamData(result.teamId);
      }
    } catch (error) {
      console.error("Error joining team:", error);
      setErrorMsg(
        error.message ||
          "Failed to join team. Please check the code and try again."
      );
    }
    setLoading(false);
  };

  const handleLeaveTeam = async () => {
    if (!currentUser || !userTeamId) return;

    setLoading(true);
    try {
      console.log("leaving the team");
      await leaveTeamFirebase(currentUser.uid, userTeamId);

      // Update local state
      setUserTeamId(null);
      setTeamData(null);
      setCurrentUser((prev) => ({ ...prev, teamId: null }));
      console.log("left team");
      setView("landing");
    } catch (error) {
      console.error("Error leaving team:", error);
      setErrorMsg("Failed to leave team. Please try again.");
    }
    setLoading(false);
  };

  const clearError = () => {
    setErrorMsg("");
  };

  // Loading state
  if (view === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Team Dashboard
  if (view === "team-dashboard" && teamData) {
    return (
      <TeamDashboard
        teamData={teamData}
        currentUser={currentUser}
        onLeaveTeam={handleLeaveTeam}
      />
    );
  }

  // Landing Page
  return (
    <JoinRoom
      setShowCreateModal={setShowCreateModal}
      showCreateModal={showCreateModal}
      clearError={clearError}
      errorMsg={errorMsg}
      showJoinModal={showJoinModal}
      setShowJoinModal={setShowJoinModal}
      joinCode={joinCode}
      setJoinCode={setJoinCode}
      loading={loading}
      handleJoinTeam={handleJoinTeam}
      teamName={teamName}
      setTeamName={setTeamName}
      handleCreateTeam={handleCreateTeam}
    />
  );
};

export default FocusTeamApp;
