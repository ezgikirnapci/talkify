import sqlite3
from pathlib import Path
src = Path('instance/talkify.db')
dst = Path('backend/instance/talkify.db')
if not src.exists():
    print('Source DB missing:', src)
    exit(1)
if not dst.exists():
    print('Destination DB missing:', dst)
    exit(1)

sconn = sqlite3.connect(src)
dconn = sqlite3.connect(dst)
scur = sconn.cursor()
dcur = dconn.cursor()

from werkzeug.security import generate_password_hash

scur.execute('SELECT id,email,username,firebase_uid FROM users')
rows = scur.fetchall()
added = 0
for r in rows:
    email = r[1]
    username = r[2]
    firebase_uid = r[3]
    dcur.execute('SELECT id FROM users WHERE email=?', (email,))
    if dcur.fetchone():
        print('Skipping existing email:', email)
        continue
    pwd_hash = generate_password_hash('migrated-please-reset')
    dcur.execute('INSERT INTO users (email, username, password_hash, firebase_uid) VALUES (?,?,?,?)', (email, username, pwd_hash, firebase_uid))
    added += 1

dconn.commit()
print('Added', added, 'users (with placeholder password_hash)')

sconn.close()
dconn.close()