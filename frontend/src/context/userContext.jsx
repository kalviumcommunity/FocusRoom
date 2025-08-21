import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, db, googleProvider } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUserDocIfNotExists = async (firebaseUser) => {
    if (!firebaseUser) return;

    const userRef = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: new Date(),
        status: "idle",
        currentSessionId: null,
        totalMinutesToday: 0,
        totalSessionsToday: 0,
      });
      console.log("New user document created in Firestore!");
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        await createUserDocIfNotExists(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  // Google login
  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <UserContext.Provider value={{ user, loading, googleLogin, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
