import sqlite3
from pathlib import Path
for path in ['instance/talkify.db', 'backend/instance/talkify.db']:
    p = Path(path)
    if not p.exists():
        print(path, 'MISSING')
        continue
    conn = sqlite3.connect(str(p))
    cur = conn.cursor()
    try:
        cur.execute('SELECT id,email,username,firebase_uid FROM users')
        rows = cur.fetchall()
        print(path, rows)
    except Exception as e:
        print(path, 'ERROR', e)
    finally:
        conn.close()
