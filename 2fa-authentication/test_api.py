"""
Simple API testing script
"""
import requests
import json

BASE_URL = "http://localhost:8000"


def test_health():
    """Test health endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print(f"Health Check: {response.json()}")


def test_register():
    """Test user registration"""
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/register", json=data)
    print(f"Register: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()


def test_login(username: str, password: str):
    """Test login"""
    data = {
        "username": username,
        "password": password
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=data)
    print(f"Login: {response.status_code}")
    result = response.json()
    print(json.dumps(result, indent=2))
    return result.get("access_token")


def test_create_tool(token: str):
    """Test creating a tool"""
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "name": "Python",
        "description": "Popular programming language for backend and data science",
        "category": "development",
        "url": "https://www.python.org"
    }
    response = requests.post(f"{BASE_URL}/api/tools", json=data, headers=headers)
    print(f"Create Tool: {response.status_code}")
    print(json.dumps(response.json(), indent=2))


def test_get_tools():
    """Test getting tools"""
    response = requests.get(f"{BASE_URL}/api/tools")
    print(f"Get Tools: {response.status_code}")
    tools = response.json()
    print(f"Found {len(tools)} tools")
    for tool in tools[:3]:  # Show first 3
        print(f"  - {tool['name']} ({tool['category']}) - {tool['status']}")


def test_stats():
    """Test statistics endpoint"""
    response = requests.get(f"{BASE_URL}/api/tools/stats")
    print(f"Stats: {response.status_code}")
    print(json.dumps(response.json(), indent=2))


if __name__ == "__main__":
    print("🧪 Testing Vibe Coding 2FA API\n")
    
    try:
        # Test health
        print("=" * 50)
        print("Testing Health Check")
        print("=" * 50)
        test_health()
        
        # Test registration
        print("\n" + "=" * 50)
        print("Testing Registration")
        print("=" * 50)
        try:
            test_register()
        except:
            print("User might already exist, continuing...")
        
        # Test login
        print("\n" + "=" * 50)
        print("Testing Login")
        print("=" * 50)
        token = test_login("testuser", "testpass123")
        
        if token:
            # Test create tool
            print("\n" + "=" * 50)
            print("Testing Create Tool")
            print("=" * 50)
            test_create_tool(token)
        
        # Test get tools
        print("\n" + "=" * 50)
        print("Testing Get Tools")
        print("=" * 50)
        test_get_tools()
        
        # Test stats
        print("\n" + "=" * 50)
        print("Testing Statistics")
        print("=" * 50)
        test_stats()
        
        print("\n✅ All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API. Make sure the server is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")
