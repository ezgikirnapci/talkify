import sqlite3
import os

# Build absolute path to backend/instance/talkify.db to avoid ambiguity
script_dir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(script_dir, '..', 'backend', 'instance', 'talkify.db')
conn = sqlite3.connect(db_path)
cur = conn.cursor()
try:
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print('Tables:', cur.fetchall())
    cur.execute('SELECT id,email,username,firebase_uid FROM users LIMIT 5')
    rows = cur.fetchall()
    print('Users rows:', rows)
except Exception as e:
    print('Error:', e)
finally:
    conn.close()