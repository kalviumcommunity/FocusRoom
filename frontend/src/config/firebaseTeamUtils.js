// firebaseTeamUtils.js
import { db } from "./firebase"; // your initialized firebase app
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// Generate unique room code
export const generateUniqueRoomCode = async () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  let exists = true;

  while (exists) {
    code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const q = query(collection(db, "teams"), where("joinCode", "==", code));
    const snapshot = await getDocs(q);
    exists = !snapshot.empty; // loop again if code already exists
  }
  return code;
};

// Create team
export const createTeam = async (teamData) => {
  const docRef = await addDoc(collection(db, "teams"), teamData);
  return { id: docRef.id, ...teamData };
};

// Join team by code
export const joinTeam = async (joinCode, userId) => {
  const q = query(collection(db, "teams"), where("joinCode", "==", joinCode));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    throw new Error("Invalid team code");
  }
  const teamDoc = snapshot.docs[0];
  const teamId = teamDoc.id;

  // Update team members
  const teamData = teamDoc.data();
  if (!teamData.members.includes(userId)) {
    await updateDoc(doc(db, "teams", teamId), {
      members: [...teamData.members, userId],
    });
  }

  return { success: true, teamId };
};

// Update user’s teamId
export const updateUserTeam = async (userId, teamId) => {
  await updateDoc(doc(db, "users", userId), { teamId });
};

// Remove user from team
export const leaveTeam = async (userId, teamId) => {
  const teamDocRef = doc(db, "teams", teamId);
  const teamSnap = await getDoc(teamDocRef);
  if (teamSnap.exists()) {
    const teamData = teamSnap.data();
    await updateDoc(teamDocRef, {
      members: teamData.members.filter((id) => id !== userId),
    });
  }
  await updateDoc(doc(db, "users", userId), { teamId: null });
};

// Enhanced getTeamData that includes member details
export const getTeamData = async (teamId) => {
  const teamSnap = await getDoc(doc(db, "teams", teamId));
  if (!teamSnap.exists()) throw new Error("Team not found");

  const teamData = teamSnap.data();

  // Fetch all member details in parallel
  const memberPromises = teamData.members.map((memberId) =>
    getDoc(doc(db, "users", memberId))
  );

  const memberSnaps = await Promise.all(memberPromises);

  // Transform member snapshots to member objects
  const membersWithDetails = memberSnaps
    .filter((snap) => snap.exists())
    .map((snap) => ({
      uid: snap.id,
      ...snap.data(),
    }));

  return {
    teamId: teamSnap.id,
    ...teamData,
    membersWithDetails, // Add this new field
  };
};
