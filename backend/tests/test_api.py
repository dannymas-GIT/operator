from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "status": "online",
        "service": "Operator Backend",
        "version": "0.1.0"
    }

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database" in data["components"]
    assert "api" in data["components"]
    assert "agents" in data["components"] 