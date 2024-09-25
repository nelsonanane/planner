from pydantic import BaseModel, Field
from typing import List
from datetime import date

class TripInput(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=0, le=120)
    current_location: str = Field(..., min_length=1, max_length=100)
    destination: str = Field(..., min_length=1, max_length=100)
    budget: float = Field(..., gt=0)
    travel_dates: List[str] = Field(..., min_items=2, max_items=2)
    accommodation_style: str = Field(..., min_length=1, max_length=50)
    activities: List[str] = Field(..., min_items=1)

    class Config:
        schema_extra = {
            "example": {
                "name": "John Doe",
                "age": 30,
                "current_location": "New York",
                "destination": "Paris",
                "budget": 2000.0,
                "travel_dates": ["2023-07-01", "2023-07-07"],
                "accommodation_style": "Hotel",
                "activities": ["Sightseeing", "Museums"]
            }
        }

class TripPlan(BaseModel):
    itinerary: str
    flight_options: List[str]
    accommodations: List[str]
    activities: List[str]
    total_cost: float