from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import TripInput, TripPlan
from app.agents import plan_trip, generate_trip_suggestions
from typing import List
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow only the frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Trip Planning API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/plan_trip", response_model=TripPlan)
async def create_trip_plan(trip_input: TripInput):
    try:
        logger.info(f"Received trip planning request: {trip_input.dict()}")
        result = plan_trip(trip_input)
        # Create a TripPlan object from the processed result
        trip_plan = TripPlan(
            itinerary=result["itinerary"],
            flight_options=result["flight_options"],
            accommodations=result["accommodations"],
            activities=result["activities"],
            total_cost=result["total_cost"]
        )
        return trip_plan
    except Exception as e:
        logger.error(f"Error in create_trip_plan: {str(e)}")
        logger.exception("Exception details:")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/trip_suggestions", response_model=List[str])
async def get_trip_suggestions():
    try:
        logger.info("Generating trip suggestions")
        suggestions = generate_trip_suggestions()
        return suggestions
    except Exception as e:
        logger.error(f"Error in get_trip_suggestions: {str(e)}")
        logger.exception("Exception details:")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)