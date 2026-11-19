
from flask import Flask, jsonify, request

app = Flask(__name__)
import sqlite3

def init_db():
    conn = sqlite3.connect("studylog.db")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT,
            duration REAL,
            date TEXT,
            status TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route("/sessions")
def get_sessions():
    conn = sqlite3.connect("studylog.db")
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM sessions").fetchall()
    conn.close()

    return jsonify([dict(row) for row in rows])


@app.route("/sessions", methods=["POST"])
def add_session():
    new_session = request.get_json()

    conn = sqlite3.connect("studylog.db")
    conn.execute(
        "INSERT INTO sessions (subject, duration, date, status) VALUES (?, ?, ?, ?)",
        (
            new_session["subject"],
            new_session["duration"],
            new_session["date"],
            new_session.get("status")
        )
    )
    conn.commit()
    conn.close()

    return jsonify(new_session), 201


if __name__ == "__main__":
    app.run(debug=True)