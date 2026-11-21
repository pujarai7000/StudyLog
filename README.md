
# 📚 StudyLog

StudyLog is a personal study-tracking application designed to help students manage study sessions, track their progress, and build consistent study habits.

The project started as a Python command-line timer and has gradually evolved into a web application with a JavaScript frontend, Flask backend, and SQLite database.

This is an ongoing personal project focused on learning full-stack development through hands-on implementation.

## ✨ Features

### Study Timer
- Customizable study duration
- Start, pause, resume, reset, and end sessions
- Countdown displayed in minutes and seconds
- Record completed study sessions
- Track partially completed sessions

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
- Display subject, duration, and session status
- Delete saved study sessions
- Visualize study activity using a GitHub-style heatmap

### Data Storage
- Store study sessions in SQLite
- Retrieve saved study history through the Flask API
- Use browser localStorage for local history and preferences
- Restore study history when the page reloads

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
- SQL (INSERT, SELECT, DELETE)

### Development Tools
- Git and GitHub
- Visual Studio Code

## 🏗️ Project Architecture

StudyLog follows a client-server structure.

```text
Frontend (HTML, CSS, JavaScript)
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

The frontend handles user interaction, the Flask backend processes API requests, and SQLite stores study-session records.

## 📁 Project Structure

```text
StudyLog/
│
├── backend/
│   ├── app.py             # Flask backend and API routes
│   └── studylog.db        # SQLite database (generated locally)
│
├── index.html             # Webpage structure
├── style.css              # Application styling
├── script.js              # Timer and dashboard functionality
├── studyTracker.py        # Original Python CLI version
├── study_history.txt      # CLI study history
├── .gitignore
└── README.md
```

Note: `studylog.db` is generated locally and is excluded from Git tracking.

## 🚀 How to Run StudyLog

### 1. Clone the Repository

```bash
git clone https://github.com/pujarai7000/StudyLog.git
cd StudyLog
```

### 2. Create a Virtual Environment

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

### 3. Install Flask

```bash
python -m pip install flask
```

### 4. Start the Backend

```bash
cd backend
python app.py
```

The Flask development server normally starts at:

```text
http://127.0.0.1:5000
```

SQLite automatically creates the database and required table if they do not exist.

### 5. Open the Frontend

Open `index.html` in your web browser.

Keep the Flask server running while using StudyLog.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sessions` | Retrieve saved study sessions |
| POST | `/sessions` | Save a new study session |
| DELETE | `/sessions/<session_id>` | Delete a session by ID |

### Example: POST /sessions

Request body:

```json
{
  "subject": "Mathematics",
  "duration": 25,
  "date": "2026-11-20",
  "status": "Completed"
}
```

Flask processes the request and saves the session in SQLite.

## 🐍 Original Python Version

StudyLog originally began as a Python command-line study timer.

### Features
- Countdown timer
- Pause, resume, and stop controls
- Study tracking by subject
- Daily study summaries
- Seven-day study summaries
- Study history saved to a text file

### Run the Python Version

From the project root:

```bash
python studyTracker.py
```

This version currently uses Windows-specific keyboard input.

### Keyboard Controls

- `p` — Pause
- `r` — Resume
- `s` — Stop

## 🔧 Current Development Status

**Work in Progress**

The web version currently supports session tracking, dashboard statistics, persistent SQLite storage, and basic CRUD operations through Flask.

### Known Limitations
- Timer accuracy can be affected by browser background-tab throttling.
- Network failures and offline synchronization need better handling.
- Changing session settings while a timer is running may affect partial-session records.
- Some duplicate-saving scenarios still need protection.

## 📌 Planned Improvements

- Improve countdown accuracy
- Strengthen input validation
- Improve error handling and data synchronization
- Prevent duplicate session records
- Add automated testing
- Improve responsive design
- Deploy the application online

## 🎯 Learning Goals

StudyLog is being developed to strengthen practical understanding of:

- JavaScript and DOM manipulation
- Frontend and backend communication
- HTTP methods and REST APIs
- Python and Flask
- SQL and database operations
- Git and GitHub workflows
- Debugging and software architecture

## 📄 Project Status

StudyLog is an ongoing learning project. Features and implementation details will continue to evolve as development progresses.



