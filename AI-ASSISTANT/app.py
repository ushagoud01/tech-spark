from flask import Flask, render_template, request, jsonify
import sqlite3
from groq import Groq

app = Flask(__name__)

# Groq API
client = Groq(api_key="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")


# Database create
def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chats(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        ai TEXT
    )
    """)

    conn.commit()
    conn.close()


init_db()


# Home page
@app.route("/")
def home():
    return render_template("index.html")


# Chat route
@app.route("/chat", methods=["POST"])
def chat():

    message = request.json["message"]

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": message}]
    )

    reply = completion.choices[0].message.content

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO chats(user, ai) VALUES (?,?)",
        (message, reply)
    )

    conn.commit()
    conn.close()

    return jsonify({"response": reply})


# Chat history
@app.route("/history")
def history():

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT user, ai FROM chats")
    data = cursor.fetchall()

    conn.close()

    return jsonify(data)


# Delete single chat
@app.route("/delete/<msg>", methods=["DELETE"])
def delete_chat(msg):

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM chats WHERE user=?", (msg,))

    conn.commit()
    conn.close()

    return jsonify({"status": "deleted"})


# Run server
if __name__ == "__main__":
    app.run(debug=True)