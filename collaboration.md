# Collaboration Report

This document highlights the contributions, challenges, and solutions from our team during the project development process.

---

## Team Member: Nidhish Agarwal

📧 **Email:** nidhish.agarwal@kalvium.community

### Contributions

- **Initial Design:**

  - Created the first version of the Low-Level Design (LLD), which was later refined and updated by my teammate.

- **Frontend Development:**

  - Set up the React application from scratch.
  - Built the navigation page and integrated authentication using **Firebase**.
  - Implemented **protected routes** to ensure secure access.
  - Designed the layout with **sidebar** and **topbar**.
  - Sidebar: implemented navigation across pages.
  - Topbar: added a user profile logo with a dropdown card that includes the **logout option**.
  - Teams Page: Added functionality to create different teams and ability to join those teams.

- **Backend & Firebase:**

  - Configured the Firebase server and linked it with authentication.

- **Dashboard Development:**

  - Built the **Pomodoro Clock**, which:
    - Tracks Pomodoro session times.
    - Fetches the **latest history** from Firebase on page load.
    - Stores session data and updates statistics.
  - Created a dashboard to display **stats related to different Pomodoro sessions**.

- **Team Page Development:**
  - Built the **Team Functionality**, which:
    - Grants ability to create a new team and join other teams based on unique join codes.
    - Fetches the all the **users Data** and display their current status and their daily stats.

---

### Challenges Faced

1. **Design Iterations:**

   - The first version of the LLD needed refinement to align with the team’s evolving vision.
   - Collaborated with teammates to improve the design while maintaining clarity.

2. **Authentication Setup:**

   - Faced difficulties with Firebase authentication flow and protected routes.
   - Solved by debugging route guards and restructuring the authentication context.

3. **Pomodoro-Firebase Integration:**
   - Challenge: Fetching the latest Pomodoro history and syncing real-time updates.
   - Overcame by structuring Firestore queries efficiently and implementing proper state management.

---

### Learnings & Outcomes

- Learned how to integrate **Firebase authentication** seamlessly with React.
- Understood how to design and manage **protected routes** for secure navigation.
- Gained experience in **real-time database integration** with Firebase Firestore.
- Improved ability to **collaborate on LLDs** and adapt to changing requirements.
- Learnt how unique code based rooms are created.

---
