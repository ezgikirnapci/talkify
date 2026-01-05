import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), 'backend'))  # ensure backend package imports (config) resolve
# Run with backend directory on path and import app module directly
os.chdir(os.path.join(os.getcwd(), 'backend'))
import app as backend_app
app = backend_app.create_app()
with app.test_client() as c:
    resp = c.post('/api/auth/register', json={
        'email': 'internaluser@example.com',
        'password': 'internalpass1',
        'username': 'internaluser',
        'firebase_uid': 'internal-firebase-1'
    })
    print('Status:', resp.status_code)
    print('JSON:', resp.get_json())

    # Verify DB entry
    resp = c.post('/api/auth/login', json={
        'email': 'internaluser@example.com',
        'password': 'internalpass1'
    })
    print('Login status:', resp.status_code)
    print('Login JSON:', resp.get_json())