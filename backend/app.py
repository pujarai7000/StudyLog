
from flask import Flask, jsonify, request

app = Flask(__name__)
import os
import sqlite3

# Always keep the database next to app.py, no matter where the server is started from
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "studylog.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT,
            duration REAL,
            date TEXT,
            status TEXT
        )
    """)

    # Older databases don't have client_id yet, so add it once
    columns = [row[1] for row in conn.execute("PRAGMA table_info(sessions)")]
    if "client_id" not in columns:
        conn.execute("ALTER TABLE sessions ADD COLUMN client_id TEXT")

    # The database itself refuses two rows with the same client_id
    # (old rows with no client_id are allowed; NULLs don't count as equal)
    conn.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_client_id "
        "ON sessions(client_id)"
    )
    conn.commit()
    conn.close()

init_db()


@app.after_request
def add_cors_headers(response):
    # Allow the HTML page (opened from a file or another port) to call this API
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    return response

@app.route("/sessions")
def get_sessions():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM sessions").fetchall()
    conn.close()

    return jsonify([dict(row) for row in rows])


@app.route("/sessions", methods=["POST"])
def add_session():
    new_session = request.get_json()
    client_id = new_session.get("client_id")

    conn = sqlite3.connect(DB_PATH)

    # Already saved this session before? Return the existing row instead of a copy
    if client_id:
        existing = conn.execute(
            "SELECT id FROM sessions WHERE client_id = ?", (client_id,)
        ).fetchone()
        if existing:
            conn.close()
            new_session["id"] = existing[0]
            return jsonify(new_session), 200

    try:
        cursor = conn.execute(
            "INSERT INTO sessions (subject, duration, date, status, client_id) "
            "VALUES (?, ?, ?, ?, ?)",
            (
                new_session["subject"],
                new_session["duration"],
                new_session["date"],
                new_session.get("status") or "Completed",
                client_id
            )
        )
        conn.commit()
        # The database gave this row an id; send it back so the page can delete it later
        new_session["id"] = cursor.lastrowid
    except sqlite3.IntegrityError:
        # Two requests with the same client_id arrived at once; keep the first one
        existing = conn.execute(
            "SELECT id FROM sessions WHERE client_id = ?", (client_id,)
        ).fetchone()
        new_session["id"] = existing[0]
        conn.close()
        return jsonify(new_session), 200

    conn.close()

    return jsonify(new_session), 201


@app.route("/sessions/<int:session_id>", methods=["DELETE"])
def delete_session(session_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.execute("DELETE FROM sessions WHERE id = ?", (session_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()

    if deleted == 0:
        return jsonify({"error": "Session not found"}), 404

    return jsonify({"deleted": session_id})


if __name__ == "__main__":
    app.run(debug=True)