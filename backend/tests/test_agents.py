import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.app.models import TripInput

client = TestClient(app)

@pytest.fixture
def sample_trip_input():
    return TripInput(
        name="John Doe",
        age=30,
        current_location="New York",
        destination="Paris",
        budget=2000.0,
        travel_dates=["2023-07-01", "2023-07-07"],
        accommodation_style="Hotel",
        activities=["Sightseeing", "Museums"]
    )

def test_plan_trip(sample_trip_input):
    response = client.post("/plan_trip", json=sample_trip_input.dict())
    assert response.status_code == 200
    assert "itinerary" in response.json()
    assert "flight_options" in response.json()
    assert "accommodations" in response.json()
    assert "activities" in response.json()
    assert "total_cost" in response.json()

def test_get_trip_suggestions():
    response = client.get("/trip_suggestions")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_plan_trip_invalid_input():
    invalid_input = {
        "name": "John Doe",
        "age": "invalid",  # Should be an integer
        "current_location": "New York",
        "destination": "Paris",
        "budget": 2000,
        "travel_dates": ["2023-07-01", "2023-07-07"],
        "accommodation_style": "Hotel",
        "activities": ["Sightseeing", "Museums"]
    }
    response = client.post("/plan_trip", json=invalid_input)
    assert response.status_code == 422  # Unprocessable Entity

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}