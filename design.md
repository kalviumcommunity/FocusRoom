# 📄 Low Level Design (LLD) – Pomodoro Productivity Tracker for Organizations

## 🎯 Aim of the Project

To build a **web-based productivity tracker** based on the Pomodoro technique that helps organizations improve **task management, focus, collaboration, and teamwork** by enabling:

* Pomodoro session tracking
* Team/Organization rooms with invite codes
* Task management (assign, track, complete)
* Analytics for employees and managers
* **Pair programming mode** for real-time collaborative work tracking

---

## 🛠️ Tech Stack

* **Frontend:** React.js (with Context/Zustand for state) + TailwindCSS + shadcn/ui
* **Backend:** Firebase (Auth, Firestore, Storage, Functions optional)
* **Database:** Firestore
* **Charts:** Recharts
* **Deployment:** Vercel
* **Design:** Figma

---

## ⚙️ System Flow

### User Flow

1. User lands on **Landing Page** → signs in (Google login via Firebase)
2. User reaches **Dashboard** → starts Pomodoro timer
3. User can **create/join organization room via code**
4. Inside **Organization Room:**

   * See team member cards (status: working / break / idle)
   * See how many Pomodoros each has completed
   * Option to start **pair programming session** with another teammate
5. User can view **Tasks board** (Kanban) → assign/self-assign tasks
6. **Analytics page** shows aggregated stats (per user, per team, per pair session)

---

## 🏗️ Entities & Schemas

### 1. User

```json
{
  "userId": "u123",
  "name": "Alice",
  "email": "alice@example.com",
  "avatar": "url",
  "currentStatus": "working | break | idle | pairing",
  "sessionsCompleted": 12,
  "teamId": "t101"
}
```

### 2. Team / Organization

```json
{
  "teamId": "t101",
  "name": "Dev Team",
  "joinCode": "XYZ123",
  "members": ["u123", "u456"],
  "tasks": ["task001", "task002"],
  "stats": {
    "totalSessions": 45,
    "completedTasks": 20,
    "pairSessions": 5
  }
}
```

### 3. PomodoroSession

```json
{
  "sessionId": "s789",
  "userId": "u123",
  "teamId": "t101",
  "taskId": "task001",
  "startTime": "2025-08-19T12:00:00Z",
  "endTime": "2025-08-19T12:25:00Z",
  "type": "work | break",
  "mode": "solo | pair",
  "pairWith": "u456"
}
```

### 4. Task

```json
{
  "taskId": "task001",
  "title": "Fix bug in login",
  "description": "Resolve OAuth redirect issue",
  "status": "todo | in-progress | done",
  "assignedTo": ["u456"], 
  "teamId": "t101",
  "createdAt": "2025-08-19T11:00:00Z",
  "pairProgramming": {
    "enabled": true,
    "participants": ["u123", "u456"],
    "active": true
  }
}
```

---

## 🔗 APIs / Backend Functions (Firebase/Functions)

### Auth

* `POST /login` → authenticate user
* `POST /logout` → logout

### Pomodoro

* `POST /startSession` → start pomodoro (solo/pair)
* `POST /endSession` → end session, update stats
* `GET /userSessions/:userId` → get session history

### Teams

* `POST /createTeam` → new team with join code
* `POST /joinTeam/:joinCode` → user joins team
* `GET /team/:teamId` → get team details + members

### Tasks

* `POST /createTask`
* `PATCH /updateTask/:taskId`
* `GET /tasks/:teamId`

### Pair Programming

* `POST /startPairSession` → link 2 users + a task
* `POST /endPairSession` → finish collaboration, log stats
* `GET /pairSessions/:teamId` → retrieve pair programming history

### Analytics

* `GET /teamStats/:teamId` → productivity data
* `GET /userStats/:userId` → individual stats
* `GET /pairStats/:teamId` → pair programming performance

---

## 📑 Page-by-Page Breakdown (with Component Details)

### 1. Landing Page

* **Components:** Logo, Tagline, Google login button
* **Integration:** Firebase Auth

### 2. Dashboard

* **Components:**

  * `PomodoroTimer` (start/pause/reset, solo/pair mode)
  * `StatCard` (sessions done today)
  * `QuickActions` (start pair session, join team)
* **State:** Timer stored locally + synced to Firestore

### 3. Organization Room

* **Components:**

  * `MemberCard` (avatar, status, session count, pair indicator)
  * `JoinTeamInput` (for invite code)
  * `TeamAdminControls` (generate code, manage team)
* **Realtime updates:** Firestore snapshot listener on team

### 4. Tasks Board

* **Components:**

  * `KanbanBoard` (columns: To Do / In Progress / Done)
  * `TaskCard` (title, assignee, pair indicator)
  * `TaskModal` (details, enable/disable pair programming, assign users)
* **Interactions:** Drag & drop with @dnd-kit

### 5. Analytics

* **Components:**

  * `BarChart` → Pomodoros per user
  * `PieChart` → Task distribution
  * `LineChart` → Pair programming sessions trend
  * `DateFilter`
* **Integration:** Aggregation queries on Firestore

### 6. Settings

* **Components:** ProfileForm, TeamSwitcher, Logout button
* **Integration:** Firestore user update + Firebase Auth

---

## 🧑‍🤝‍🧑 Pair Programming Feature 

### Concept

* **Driver–Navigator model:** Two teammates work on a task together.
* One starts a **pair session** from the task card → selects a partner → both statuses switch to `pairing`.
* Timer runs for both. Session stats are logged under both users.

### Implementation

1. **Start Pairing:**

   * TaskCard → "Start Pair Session" button
   * Creates a `PomodoroSession` doc with `{mode: "pair", pairWith: userId}`
   * Updates both users’ status to `"pairing"`
2. **During Session:**

   * Both timers stay in sync (via Firestore presence doc)
   * Organization Room shows both linked together
3. **End Pairing:**

   * Either user ends → marks session complete
   * Stats incremented for both users + stored in `pairSessions`
4. **Analytics:**

   * `pairSessions` collection → used to show:

     * Most frequent pairs
     * Pair productivity (tasks closed, sessions completed)

---

## 📊 Example System Flow (Sequence)

1. User clicks **Start Pomodoro** → Timer begins (frontend) → session doc created
2. Status updates → team room shows `"working"` or `"pairing"`
3. After 25 mins → session ends → session count incremented
4. Break → status updates to `"break"`
5. Task update → board reflects new status → analytics updated
6. Pair programming → two users linked on a task → joint session stored in DB
7. Manager views analytics → includes solo + pair stats

---

## 🚀 MVP vs Future Scope

### MVP

* Login (Google)
* Dashboard with Pomodoro timer
* Organization Room (status cards)
* Minimal Firestore schema (users + teams)
* Landing Page

### Future Scope

* Full Tasks board
* Analytics dashboard
* Org owner controls
* **Pair programming sessions with analytics** (priority from mentor feedback)
* Notifications (task assigned, session ended)

---
