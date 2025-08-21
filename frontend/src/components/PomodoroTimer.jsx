import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, RotateCcw } from "lucide-react";
import { db } from "../config/firebase";
import {
  addDoc,
  updateDoc,
  doc,
  collection,
  Timestamp,
  increment,
  getDoc,
} from "firebase/firestore";
import { useUser } from "../context/userContext";

const PomodoroTimer = () => {
  const { user } = useUser();
  const userId = user.uid;
  const mode = "solo";
  const pairWith = null;

  // Firestore collection reference
  const pomodoroCollection = collection(db, "PomodoroSessions");

  // Timer configuration
  const WORK_TIME = 25 * 60; // 25 minutes
  const BREAK_TIME = 5 * 60; // 5 minutes

  // Timer states
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionType, setSessionType] = useState("work"); // 'work' or 'break'
  const [currentSession, setCurrentSession] = useState(null);

  const intervalRef = useRef(null);

  useEffect(() => {
    const restoreOrCreateSession = async () => {
      if (!userId) return;

      try {
        // Step 1: Fetch the user document
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().currentSessionId) {
          // Step 2: Fetch the current session from PomodoroSessions
          const sessionRef = doc(
            db,
            "PomodoroSessions",
            userSnap.data().currentSessionId
          );
          const sessionSnap = await getDoc(sessionRef);

          if (sessionSnap.exists()) {
            const session = { id: sessionSnap.id, ...sessionSnap.data() };
            setCurrentSession(session);
            setSessionType(session.type);

            // Step 3: Restore timer based on session status
            if (session.status === "active") {
              const now = Timestamp.now();
              const remaining = Math.max(
                Math.floor(
                  (session.endTime.toMillis() - now.toMillis()) / 1000
                ),
                0
              );

              if (remaining > 0) {
                setTimeLeft(remaining);
                setIsActive(true);
                setIsPaused(false);
                return; // ✅ Done
              }
            } else if (session.status === "paused") {
              const remaining = Math.max(
                Math.floor(
                  (session.endTime.toMillis() - session.pausedAt.toMillis()) /
                    1000
                ),
                0
              );
              setTimeLeft(remaining);
              setIsActive(true);
              setIsPaused(true);
              return; // ✅ Done
            }
          }
        }

        // Step 4: No valid current session → create one with your helper
        await startSession("work"); // 👈 reuse your function
      } catch (error) {
        console.error("Error restoring or creating session:", error);
      }
    };

    restoreOrCreateSession();
  }, [userId]);

  const calculateElapsedMinutes = (session, now) => {
    // if paused/resumed cycle, measure from last resumedAt
    const startTime = session.resumedAt || session.startTime;
    const elapsedMs = now.toMillis() - startTime.toMillis();
    return Math.floor(elapsedMs / 60000); // minutes
  };

  // USER functions
  const updateUserStatus = async (updates) => {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, {
      ...updates,
      lastUpdated: Timestamp.now(),
    });
  };

  // Firestore functions
  const createSession = async (sessionData) => {
    try {
      const docRef = await addDoc(pomodoroCollection, sessionData);
      return { id: docRef.id, ...sessionData };
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  const updateSession = async (sessionId, updates) => {
    try {
      const sessionDoc = doc(db, "PomodoroSessions", sessionId);
      await updateDoc(sessionDoc, updates);
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  };

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress for the circular timer
  const progress =
    sessionType === "work"
      ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100
      : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  // Start a new session
  const startSession = async (overrideType = null) => {
    try {
      const typeToUse = overrideType || sessionType;
      const startTime = Timestamp.now();
      const duration = typeToUse === "work" ? WORK_TIME : BREAK_TIME;
      const endTime = Timestamp.fromMillis(
        startTime.toMillis() + duration * 1000
      );

      const sessionData = {
        userId,
        teamId: null,
        taskId: null,
        startTime,
        endTime,
        type: sessionType,
        mode: "solo",
        pairWith: null,
        status: "active",
        duration,
        createdAt: Timestamp.now(),
      };

      const session = await createSession(sessionData);
      setCurrentSession(session);
      setIsActive(true);
      setIsPaused(false);

      // update user status
      await updateUserStatus({
        status: "active",
        currentSessionId: session.id,
      });
    } catch (error) {
      console.error("Error starting session:", error);
      // Handle error - maybe show a toast notification
    }
  };

  // Pause current session
  const pauseCurrentSession = async () => {
    if (!currentSession) return;
    try {
      const now = Timestamp.now();
      const elapsedMinutes = calculateElapsedMinutes(currentSession, now);

      await updateSession(currentSession.id, {
        pausedAt: now,
        status: "paused",
      });

      setIsPaused(true);
      await updateUserStatus({
        status: "paused",
        totalMinutesToday: increment(elapsedMinutes),
      });
    } catch (error) {
      console.error("Error pausing session:", error);
    }
  };

  // Resume paused session
  const resumeCurrentSession = async () => {
    if (!currentSession) return;
    try {
      const now = Timestamp.now();
      await updateSession(currentSession.id, {
        resumedAt: now,
        status: "active",
      });
      setIsPaused(false);
      await updateUserStatus({ status: "active" });
    } catch (error) {
      console.error("Error resuming session:", error);
    }
  };

  // Handle session completion
  const handleSessionComplete = async () => {
    if (!currentSession) return;
    try {
      const actualEndTime = Timestamp.now();
      const elapsedMinutes = calculateElapsedMinutes(
        currentSession,
        actualEndTime
      );

      await updateSession(currentSession.id, {
        actualEndTime,
        status: "completed",
        completedAt: actualEndTime,
      });

      await updateUserStatus({
        status: sessionType === "work" ? "break" : "idle",
        currentSessionId: null,
        totalSessionsToday: increment(1),
        totalMinutesToday: increment(elapsedMinutes),
      });

      setIsActive(false);
      setIsPaused(false);
      setCurrentSession(null);

      if (sessionType === "work") {
        setSessionType("break");
        setTimeLeft(BREAK_TIME);

        // Auto-start break after 2 seconds
        setTimeout(async () => {
          try {
            await autoStartBreak();
          } catch (error) {
            console.error("Error auto-starting break:", error);
          }
        }, 2000);
      } else {
        // Break completed, ready for work
        setSessionType("work");
        setTimeLeft(WORK_TIME);
      }
    } catch (error) {
      console.error("Error completing session:", error);
    }
  };

  // Auto-start break session
  const autoStartBreak = async () => {
    try {
      const startTime = Timestamp.now();
      const endTime = Timestamp.fromMillis(
        startTime.toMillis() + BREAK_TIME * 1000
      );

      const breakSessionData = {
        userId,
        teamId: null,
        taskId: null,
        startTime,
        endTime,
        type: "break",
        mode: "solo",
        pairWith: null,
        status: "active",
        duration: BREAK_TIME,
        createdAt: Timestamp.now(),
      };

      const breakSession = await createSession(breakSessionData);
      setCurrentSession(breakSession);
      setIsActive(true);
      setIsPaused(false);

      await updateUserStatus({
        status: "break",
        currentSessionId: breakSession.id,
      });
    } catch (error) {
      console.error("Error auto-starting break:", error);
      throw error;
    }
  };

  // Stop/Reset session
  const stopSession = async () => {
    if (currentSession) {
      try {
        const stoppedAt = Timestamp.now();
        const elapsedMinutes = calculateElapsedMinutes(
          currentSession,
          stoppedAt
        );
        await updateSession(currentSession.id, {
          actualEndTime: stoppedAt,
          status: "stopped",
          stoppedAt,
        });
        await updateUserStatus({
          status: "idle",
          currentSessionId: null,
          totalMinutesToday: increment(elapsedMinutes),
        });
      } catch (error) {
        console.error("Error stopping session:", error);
      }
    }

    setIsActive(false);
    setIsPaused(false);
    setCurrentSession(null);
    setTimeLeft(sessionType === "work" ? WORK_TIME : BREAK_TIME);
  };

  // Reset to work session
  const resetToWork = async () => {
    await stopSession();
    setSessionType("work");
    setTimeLeft(WORK_TIME);
  };

  // Handle main button click
  const handleMainAction = () => {
    if (!isActive) {
      startSession();
    } else if (isPaused) {
      resumeCurrentSession();
    } else {
      pauseCurrentSession();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  text-white p-8">
      {/* Circular Timer */}
      <div className="relative ">
        <svg className="w-72 h-72" viewBox="0 0 200 200">
          {/* Outer tick marks */}
          {Array.from({ length: 60 }, (_, i) => {
            const angle = i * 6 * (Math.PI / 180);
            const isMainTick = i % 5 === 0;
            const innerRadius = isMainTick ? 84 : 88;
            const outerRadius = 95;

            const x1 = 100 + innerRadius * Math.cos(angle);
            const y1 = 100 + innerRadius * Math.sin(angle);
            const x2 = 100 + outerRadius * Math.cos(angle);
            const y2 = 100 + outerRadius * Math.sin(angle);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#6B7280"
                strokeWidth={isMainTick ? "3" : "1"}
              />
            );
          })}

          {/* Main clock face - gradient fill */}
          <circle
            cx="100"
            cy="100"
            r="65"
            fill="#f3d5d6"
            // mask="url(#progressMask)"
          />

          {/* Gradient sector that shows completed time */}
          <path
            d={`M 100 100 L 100 35 A 65 65 0 ${progress > 50 ? 1 : 0} 1 ${
              100 + 65 * Math.sin((progress / 100) * 2 * Math.PI)
            } ${100 - 65 * Math.cos((progress / 100) * 2 * Math.PI)} Z`}
            fill="url(#completedGradient)"
            className="transition-all duration-500 ease-out"
          />

          {/* Center white circle */}
          <circle
            cx="100"
            cy="100"
            r="18"
            fill="#f5e6e7"
            filter="url(#dropShadow)"
          />

          <defs>
            {/* Orange to white gradient */}
            <linearGradient
              id="completedGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#e77175" />
              <stop offset="100%" stopColor="#e3cccc" />
            </linearGradient>

            {/* Mask that reveals completed portion */}
            <mask id="progressMask">
              <rect width="200" height="200" fill="black" />
              <path
                d={`M 100 100 L 100 35 A 65 65 0 ${progress > 50 ? 1 : 0} 1 ${
                  100 + 65 * Math.sin((progress / 100) * 2 * Math.PI)
                } ${100 - 65 * Math.cos((progress / 100) * 2 * Math.PI)} Z`}
                fill="white"
              />
            </mask>

            <filter
              id="dropShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="2"
                dy="2"
                stdDeviation="3"
                floodOpacity="0.3"
                floodColor="#000000"
              />
            </filter>
          </defs>
        </svg>

        {/* Clock hand/dial */}
        <div
          className="absolute top-1/2 left-1/2 origin-bottom transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(-50%, -100%) rotate(${
              (progress / 100) * 360
            }deg)`,
            height: "110px",
            width: "6px",
            backgroundColor: "#EF4444",
            borderRadius: "2px",
            transformOrigin: "bottom center",
          }}
        ></div>
        {/* Circle on top of hand */}

        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 10 }}
        >
          <div className="w-10 h-10 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Time Display */}
      <div className="text-3xl font-bold text-black mb-4">
        {formatTime(timeLeft)}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-4">
        {/* Main Action Button */}
        <button
          onClick={handleMainAction}
          className={`flex items-center text-black justify-center w-48 py-2 px-9 rounded-lg font-semibold text-md transition-all duration-200 ${
            sessionType === "work"
              ? "bg-[#dc5454] hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } hover:scale-105 shadow-lg`}
        >
          {!isActive ? (
            <>Start {sessionType === "work" ? "Session" : "Break"}</>
          ) : isPaused ? (
            <>
              <Play className="w-5 h-5 mr-2" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          )}
        </button>

        {/* Secondary Controls */}
        {isActive && (
          <button
            onClick={stopSession}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            title="Stop Session"
          >
            <Square className="w-5 h-5" />
          </button>
        )}

        {!isActive && sessionType === "break" && (
          <button
            onClick={resetToWork}
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            title="Back to Work"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Status Display */}
      {currentSession && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Session Status:{" "}
            <span className="capitalize text-black font-medium">
              {isPaused ? "Paused" : "Active"}
            </span>
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Mode: <span className="text-black font-medium">{mode}</span>
          </p>
          {mode === "pair" && pairWith && (
            <p className="text-sm text-gray-400 mt-1">
              Paired with:{" "}
              <span className="text-black font-medium">{pairWith}</span>
            </p>
          )}
        </div>
      )}

      {/* Debug Info (remove in production) */}
      {/* <div className="mt-4 text-xs text-gray-400 text-center">
        <p>User ID: {userId}</p>
        <p>Team ID: {teamId || "None"}</p>
        <p>Task ID: {taskId || "None"}</p>
      </div> */}
    </div>
  );
};

export default PomodoroTimer;
