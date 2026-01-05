import sqlite3
paths=['instance/talkify.db','backend/instance/talkify.db','talkify.db']
for path in paths:
    try:
        conn = sqlite3.connect(path)
        cur = conn.cursor()
        cur.execute('SELECT id,email,username,firebase_uid FROM users')
        rows = cur.fetchall()
        print(path, rows)
    except Exception as e:
        print(path, 'ERROR', e)
    finally:
        try: conn.close()
        except: pass
