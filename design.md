# 📄 Low-Level Design (LLD) – Pomodoro Productivity Tracker

## 🎯 Aim of the Project

A web-based productivity tracker (Pomodoro technique) to help organizations with:

- Pomodoro session tracking
- Team/Organization rooms with join codes
- Task management (create, assign, track, complete)
- Analytics for users, teams, and pairs
- Pair programming mode

## 🛠️ Tech Stack

- **Frontend**: React.js + Context/Zustand + TailwindCSS + shadcn/ui
- **Backend**: Firebase (Auth, Firestore, optional Functions)
- **Database**: Firestore (NoSQL)
- **Realtime Updates**: Firestore snapshot listeners
- **Charts**: Recharts
- **Deployment**: Vercel
- **Design**: Figma

## ⚙️ System Flow

### User Flow

1. User lands → Login with Google (Firebase Auth)
2. Dashboard loads → Pomodoro timer (local state + Firestore sync)
3. User can create/join team via join code
4. Inside team room:
   - View team members (status + sessions completed)
   - Start solo/pair Pomodoro session
   - Access Tasks Board (Kanban) → assign/self-assign tasks
   - View Analytics (sessions, tasks, pairs)

## 🏗️ Firestore Collections & Schemas

### 1. users

```json
{
  "userId": "u123", // Firebase UID
  "name": "Alice",
  "email": "alice@example.com",
  "avatar": "url",
  "currentStatus": "working | break | idle | pairing",
  "sessionsCompleted": 12,
  "teamIds": ["t101"]
}
```

### 2. teams

```json
{
  "teamId": "t101",
  "name": "Dev Team",
  "joinCode": "XYZ123",
  "members": ["u123", "u456"],
  "stats": {
    "totalSessions": 45,
    "completedTasks": 20,
    "pairSessions": 5
  }
}
```

### 3. sessions

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
  "pairWith": "u456" // optional
}
```

### 4. tasks

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

## 🔗 Firebase Operations (instead of REST APIs)

### Authentication

- `firebase.auth().signInWithPopup(GoogleAuthProvider)`
- `firebase.auth().signOut()`

### Teams

- **Create Team**: Add new doc in teams with joinCode
- **Join Team**: Query team by joinCode, update members array
- **Listen Team**: `onSnapshot(teams/{teamId})` for live updates

### Sessions

- **Start Session**: Add doc in sessions (mode = solo/pair)
- **End Session**: Update endTime, increment user/team counters
- **User History**: Query sessions by userId

### Tasks

- **Create Task**: Add doc in tasks
- **Update Task**: Update status or assignedTo
- **Team Tasks**: Query tasks by teamId

### Pair Programming

- **Start Pair Session**: Create sessions doc with `{mode:"pair", pairWith: userId}`
- **End Pair Session**: Update doc + increment both users' stats

### Analytics

Derived from Firestore queries:

- Count sessions per user/team
- Aggregate completed tasks
- Filter sessions where mode = pair

## 📑 Pages & Components

### 1. Landing Page

- **Components**: Logo, tagline, Google Login Button
- **Integration**: Firebase Auth

### 2. Dashboard

**Components**:

- PomodoroTimer (start/pause/reset)
- StatCard (today's sessions)
- QuickActions (join team, start pair session)

**Sync**: Local timer state → Firestore session doc

### 3. Organization Room

**Components**:

- MemberCard (avatar, status, sessions)
- JoinTeamInput (enter join code)
- TeamControls (generate join code, remove member)

**Sync**: Firestore listeners on `teams/{teamId}`

### 4. Tasks Board

**Components**:

- KanbanBoard (columns)
- TaskCard (title, assignee, pair icon)
- TaskModal (edit details, assign, pair toggle)

**Sync**: Firestore tasks collection

### 5. Analytics

**Components**:

- BarChart → sessions per user
- PieChart → task distribution
- LineChart → pair sessions trend

**Data**: Firestore queries + aggregate

### 6. Settings

**Components**: ProfileForm, TeamSwitcher, Logout button
**Integration**: Update Firestore user doc

## 🚀 MVP vs Future Scope

### MVP

- Google login
- Dashboard with Pomodoro timer
- Create/join team
- Basic session tracking

### Future Scope

- Full task board
- Analytics dashboard
- Team admin controls
- Pair programming insights
- Notifications (assignments, reminders)
