import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, RotateCcw } from "lucide-react";

const PomodoroTimer = ({
  userId = "u123",
  teamId = "t101",
  taskId = null,
  mode = "solo",
  pairWith = null,
}) => {
  // Timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionType, setSessionType] = useState("work"); // 'work' or 'break'
  const [currentSession, setCurrentSession] = useState(null);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Timer configuration
  const WORK_TIME = 25 * 60; // 25 minutes
  const BREAK_TIME = 5 * 60; // 5 minutes

  const intervalRef = useRef(null);

  // Mock Firebase functions - Replace with actual Firebase calls
  const createSession = async (sessionData) => {
    console.log("Creating session:", sessionData);
    // Add to Firestore: await addDoc(collection(db, 'sessions'), sessionData);
    return { id: `session_${Date.now()}`, ...sessionData };
  };

  const updateSession = async (sessionId, updates) => {
    console.log("Updating session:", sessionId, updates);
    // Update in Firestore: await updateDoc(doc(db, 'sessions', sessionId), updates);
  };

  const pauseSession = async (sessionId, pausedAt) => {
    console.log("Pausing session:", sessionId, "at", pausedAt);
    // Update session with pause timestamp
    await updateSession(sessionId, {
      pausedAt: pausedAt.toISOString(),
      status: "paused",
    });
  };

  const resumeSession = async (sessionId, resumedAt) => {
    console.log("Resuming session:", sessionId, "at", resumedAt);
    await updateSession(sessionId, {
      resumedAt: resumedAt.toISOString(),
      status: "active",
    });
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
  const startSession = async () => {
    const now = new Date();
    const duration = sessionType === "work" ? WORK_TIME : BREAK_TIME;
    const endTime = new Date(now.getTime() + duration * 1000);

    const sessionData = {
      userId,
      teamId,
      taskId,
      startTime: now.toISOString(),
      endTime: endTime.toISOString(),
      type: sessionType,
      mode,
      pairWith,
      status: "active",
      duration: duration,
    };

    try {
      const session = await createSession(sessionData);
      setCurrentSession(session);
      setIsActive(true);
      setIsPaused(false);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  // Pause current session
  const pauseCurrentSession = async () => {
    if (currentSession) {
      await pauseSession(currentSession.id, new Date());
      setIsPaused(true);
    }
  };

  // Resume paused session
  const resumeCurrentSession = async () => {
    if (currentSession) {
      await resumeSession(currentSession.id, new Date());
      setIsPaused(false);
    }
  };

  // Handle session completion
  const handleSessionComplete = async () => {
    if (currentSession) {
      const now = new Date();
      await updateSession(currentSession.id, {
        actualEndTime: now.toISOString(),
        status: "completed",
      });

      setIsActive(false);
      setIsPaused(false);

      if (sessionType === "work") {
        // Work session completed, start break
        setCompletedSessions((prev) => prev + 1);
        setSessionType("break");
        setTimeLeft(BREAK_TIME);

        // Auto-start break
        setTimeout(() => {
          setSessionType("break");
          startSession();
        }, 1000);
      } else {
        // Break completed, ready for work
        setSessionType("work");
        setTimeLeft(WORK_TIME);
      }

      setCurrentSession(null);
    }
  };

  // Stop/Reset session
  const stopSession = async () => {
    if (currentSession) {
      await updateSession(currentSession.id, {
        actualEndTime: new Date().toISOString(),
        status: "stopped",
      });
    }

    setIsActive(false);
    setIsPaused(false);
    setCurrentSession(null);
    setTimeLeft(sessionType === "work" ? WORK_TIME : BREAK_TIME);
  };

  // Reset to work session
  const resetToWork = () => {
    stopSession();
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
    <div className="flex flex-col items-center justify-center min-h-screen  text-white p-8">
      {/* Session Info */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl text-black font-semibold mb-2">
          {sessionType === "work" ? "Focus Time" : "Break Time"}
        </h2>
        <p className="text-gray-400">Sessions completed: {completedSessions}</p>
      </div>

      {/* Circular Timer */}
      <div className="relative mb-8">
        <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 200 200">
          {/* Outer tick marks */}
          {Array.from({ length: 60 }, (_, i) => {
            const angle = i * 6 * (Math.PI / 180);
            const isMainTick = i % 5 === 0;
            const innerRadius = isMainTick ? 85 : 88;
            const outerRadius = 92;

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

          {/* Outer ring background */}
          <circle
            cx="100"
            cy="100"
            r="75"
            stroke="#374151"
            strokeWidth="10"
            fill="transparent"
          />

          {/* Completed time ring (pink/light gradient) */}
          <circle
            cx="100"
            cy="100"
            r="75"
            stroke="url(#completedGradient)"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 75}`}
            strokeDashoffset={`${2 * Math.PI * 75 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Main clock face - gradient fill */}
          <circle cx="100" cy="100" r="70" fill="url(#clockFaceGradient)" />

          {/* Center white circle */}
          <circle cx="100" cy="100" r="8" fill="white" />

          <defs>
            {/* Completed time gradient (pink to red) */}
            <linearGradient
              id="completedGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FDF2F8" />
              <stop offset="50%" stopColor="#FCA5A5" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>

            {/* Clock face gradient (light pink to darker pink) */}
            <radialGradient id="clockFaceGradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#FDF2F8" />
              <stop offset="100%" stopColor="#F9A8D4" />
            </radialGradient>
          </defs>
        </svg>

        {/* Clock hand/dial */}
        <div
          className="absolute top-1/2 left-1/2 origin-bottom transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(-50%, -100%) rotate(${
              (progress / 100) * 360
            }deg)`,
            height: "70px",
            width: "4px",
            backgroundColor: "#EF4444",
            borderRadius: "2px",
            transformOrigin: "bottom center",
          }}
        >
          {/* Hand tip */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Time Display */}
      <div className="text-6xl font-bold text-black mb-8">
        {formatTime(timeLeft)}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-4">
        {/* Main Action Button */}
        <button
          onClick={handleMainAction}
          className={`flex items-center justify-center w-48 py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
            sessionType === "work"
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          } hover:scale-105 shadow-lg`}
        >
          {!isActive ? (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start {sessionType === "work" ? "Focus" : "Break"}
            </>
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
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
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
            <span className="capitalize text-white">
              {isPaused ? "Paused" : "Active"}
            </span>
          </p>
          {mode === "pair" && pairWith && (
            <p className="text-sm text-gray-400 mt-1">
              Paired with: <span className="text-white">{pairWith}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
