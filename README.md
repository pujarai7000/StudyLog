# StudyLog

StudyLog is a personal study-tracking application designed to help students manage their study sessions, track study time by subject, and build consistent study habits.

The project started as a Python command-line application and is currently being expanded into a browser-based application using HTML and JavaScript, with plans for future full-stack development.

## Features

### Python Version
- Countdown study timer
- Pause, resume, and stop study sessions
- Track study time by subject
- Save study history to a text file
- View daily and seven-day study summaries
- Support multiple study sessions

### Web Version (In Development)
- Interactive countdown study timer
- Start, pause, resume, reset, and end study sessions
- Customizable study duration
- Track completed and partial study sessions
- Save study history using browser localStorage
- Restore saved history after refreshing the webpage
- Display session history with subject, duration, and completion status

## Technologies Used

**Python Version**
- Python
- Threading
- File Handling

**Web Version**
- HTML
- JavaScript
- DOM Manipulation
- Browser localStorage

**Version Control**
- Git & GitHub

## How to Run

### Web Version

1. Clone the repository:

   ```bash
   git clone https://github.com/pujarai7000/StudyLog.git
   ```

2. Navigate to the project folder:

   ```bash
   cd StudyLog
   ```

3. Switch to the development branch:

   ```bash
   git switch features
   ```

4. Open `index.html` in a web browser.

No additional packages are required for the current web version.

### Python Version

1. Navigate to the project directory.
2. Ensure Python is installed on Windows.
3. Run:

   ```bash
   python studyTracker.py
   ```

The Python version uses `study_history.txt` to store study sessions.

### Python Timer Controls

- `p` — Pause
- `r` — Resume
- `s` — Stop

## Future Improvements

- Improved timer validation and reliability
- Daily study goals and progress tracking
- Daily, weekly, and monthly statistics in the web interface
- Study streak tracking
- GitHub-style study contribution heatmap
- Responsive interface and improved styling
- React-based frontend
- Backend API using Node.js/Express or Python Flask
- Database integration
- Online deployment

## Project Status

**Work in Progress**

The original Python command-line tracker is available, and development is currently focused on the HTML and JavaScript web version.

The current priority is improving timer functionality, managing study history, and strengthening JavaScript fundamentals before introducing frontend frameworks and backend technologies.

## Development Approach

StudyLog is an ongoing personal learning project developed incrementally to practice programming fundamentals, problem-solving, debugging, and software development.

The goal is to gradually transform the application into a practical full-stack study-tracking tool.
