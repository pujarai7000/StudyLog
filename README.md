# 📚 StudyLog

**Version 1.0 — Completed Local Full-Stack Web Application**

StudyLog is a personal study-tracking application designed to help students manage study sessions, monitor their progress, and build consistent study habits.

The project started as a Python command-line study timer and gradually evolved into a full-stack web application using HTML, CSS, JavaScript, Flask, and SQLite.

StudyLog was developed as a hands-on learning project to explore frontend development, backend integration, database management, and practical software engineering concepts.

---

## ✨ Features

### Study Timer

- Customizable study duration
- Start, Pause, Resume, Reset, and End controls
- Countdown displayed in minutes and seconds
- Timestamp-based countdown for improved accuracy
- Record completed study sessions
- Save partially completed study sessions
- Browser warning when leaving during an active session

### Study Dashboard

- Today's completed session count
- Total daily study time
- Study time over the last seven days
- Study streak tracking
- Study time grouped by subject
- Customizable daily study goal
- Progress bar showing daily goal completion
- Daily motivational quotes

### Study History

- View study sessions by date
- Display subject, duration, and completion status
- Delete saved study sessions
- Visualize study activity using a GitHub-style heatmap

### Data Storage

- Store study sessions in SQLite
- Retrieve saved history through the Flask API
- Use browser `localStorage` to preserve local study history and preferences
- Save study sessions locally when Flask is unavailable
- Synchronize unsaved local sessions with SQLite when the backend becomes available and the webpage is refreshed
- Use unique session identifiers to prevent duplicate database records
- Handle failed deletion requests without silently removing saved history

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- DOM Manipulation
- Fetch API
- Browser localStorage

### Backend

- Python
- Flask
- REST-style API endpoints

### Database

- SQLite
- SQL (`INSERT`, `SELECT`, `DELETE`)

### Development Tools

- Git and GitHub
- Visual Studio Code

---

## 🏗️ Project Architecture

StudyLog follows a **client-server architecture**, where the frontend handles user interactions, the backend processes HTTP requests, and the database stores study-session records.

```text
             User
               |
               v
   Frontend (HTML, CSS, JS)
               |
               | HTTP Requests
               | GET / POST / DELETE
               v
        Flask Backend
               |
               | SQL Queries
               v
        SQLite Database
```

### How It Works

1. The user enters a study subject and selects a duration.
2. JavaScript manages the countdown and responds to user actions.
3. When a session is completed or ended early, the application records the study duration.
4. Session information is saved in browser localStorage.
5. JavaScript sends an HTTP POST request to the Flask backend.
6. Flask processes the request and stores the session in SQLite.
7. Saved sessions are retrieved using HTTP GET requests and displayed on the dashboard.
8. Users can remove saved sessions using HTTP DELETE requests.




