from backend.app import create_app
import json
app = create_app()
with app.test_client() as c:
    resp = c.post('/api/auth/register', json={
        'email': 'apiuser@example.com',
        'password': 'apipass123',
        'username': 'apiuser',
        'firebase_uid': 'firebase-uid-xyz'
    })
    print('Status:', resp.status_code)
    print('Data:', resp.get_json())

    # check that user was added
    resp2 = c.get('/api/get-content')
    print('Content GET status:', resp2.status_code)