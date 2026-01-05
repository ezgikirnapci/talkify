import sqlite3
conn = sqlite3.connect('backend/instance/talkify.db')
cur = conn.cursor()
try:
    cur.execute("ALTER TABLE users ADD COLUMN firebase_uid VARCHAR(128);")
    conn.commit()
    print('Column added (or already exists).')
except Exception as e:
    print('Error:', e)
finally:
    conn.close()