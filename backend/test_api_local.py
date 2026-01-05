import requests

def test_login():
    url = "http://localhost:5000/api/auth/login"
    payload = {
        "email": "test@gmail.com",
        "password": "wrongpassword"
    }
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.json()}")

def test_register():
    url = "http://localhost:5000/api/auth/register"
    payload = {
        "email": "newuser@gmail.com",
        "password": "Test1234!",
        "username": "newuser"
    }
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.json()}")

if __name__ == "__main__":
    print("Testing Login with wrong password:")
    test_login()
    print("\nTesting Registration:")
    test_register()
