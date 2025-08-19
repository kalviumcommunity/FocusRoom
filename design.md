# 📄 Low Level Design (LLD) – Pomodoro Productivity Tracker for Organizations

## 🎯 Aim of the Project

To build a web-based productivity tracker based on the Pomodoro technique that helps organizations improve task management, focus, and collaboration by enabling:

- Pomodoro session tracking
- Team/Organization rooms with invite codes
- Task management (assign, track, complete)
- Analytics for employees and managers

## 🛠️ Tech Stack

- **Frontend:** React.js + TailwindCSS
- **Backend:** Firebase
- **Database:** Firestore
- **Charts:** Recharts
- **Deployment:** Vercel
- **Design:** Figma

## ⚙️ System Flow

### User Flow

1. User lands on **Landing Page** → signs in (Google login via Firebase)
2. User reaches **Dashboard** → starts Pomodoro timer
3. User can create/join organization room via code
4. Inside **Organization Room:**
   - See cards of team members → status (working / break / idle)
   - See how many Pomodoros each has completed
5. User can view **Tasks board** (Kanban style) → assign/self-assign tasks
6. **Analytics page** shows aggregated stats (per user, per team)

## 🏗️ Entities & Schemas

### 1. User

```json
{
  "userId": "u123",
  "name": "Alice",
  "email": "alice@example.com",
  "avatar": "url",
  "currentStatus": "working | break | idle",
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
    "completedTasks": 20
  }
}
```

### 3. PomodoroSession

```json
{
  "sessionId": "s789",
  "userId": "u123",
  "teamId": "t101",
  "startTime": "2025-08-19T12:00:00Z",
  "endTime": "2025-08-19T12:25:00Z",
  "type": "work | break"
}
```

### 4. Task

```json
{
  "taskId": "task001",
  "title": "Fix bug in login",
  "description": "Resolve OAuth redirect issue",
  "status": "todo | in-progress | done",
  "assignedTo": "u456",
  "teamId": "t101",
  "createdAt": "2025-08-19T11:00:00Z"
}
```

## 🔗 APIs / Backend Functions (if Firebase/Express used)

### Auth

- `POST /login` → authenticate user
- `POST /logout` → logout

### Pomodoro

- `POST /startSession` → start pomodoro
- `POST /endSession` → end pomodoro, update stats
- `GET /userSessions/:userId` → get user session history

### Teams

- `POST /createTeam` → new team with join code
- `POST /joinTeam/:joinCode` → user joins team
- `GET /team/:teamId` → get team details + members

### Tasks

- `POST /createTask`
- `PATCH /updateTask/:taskId`
- `GET /tasks/:teamId`

### Analytics

- `GET /teamStats/:teamId` → productivity data
- `GET /userStats/:userId` → individual stats

## 📑 Page-by-Page Breakdown

### 1. Landing Page

- Logo + tagline ("Focus. Collaborate. Achieve.")
- CTA: Login (Google/Firebase)

### 2. Dashboard

- Navbar (links to other pages)
- Pomodoro timer (start/pause/reset)
- Personal stats (sessions done today)

### 3. Organization Room

- Cards of team members:
  - Avatar, Name
  - Status (working/break)
  - Sessions completed
- "Join with code" input
- If owner → "Generate code" & "Manage team"

### 4. Tasks

- Kanban board: To Do → In Progress → Done
- Add task, assign to member

### 5. Analytics

- Bar chart → Pomodoros per user
- Pie chart → Tasks distribution
- Date filter

### 6. Settings

- Profile info
- Change team
- Logout

## 📊 Example System Flow (Sequence)

1. **Start Pomodoro:** User clicks Start → Timer begins (frontend) → Session record created in DB
2. **During Session:** Status set to "working" in DB → Team room shows card as "working"
3. **End Pomodoro:** After 25 mins → mark session complete → increment sessionsCompleted
4. **Break:** Switch to break → status updates in team view
5. **Task Update:** Team member drags task to Done → DB updates → analytics recalculated
6. **Analytics:** Manager views charts → stats fetched from DB

## 🚀 MVP vs Future Scope

### MVP:

- Login, Dashboard (timer), Organization Room (with status cards)
- Minimal Firestore schema for users + teams
- Landing Page

### Future Scope:

- Full Tasks board
- Analytics dashboard
- Org owner controls (advanced)
