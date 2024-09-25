from crewai import Agent, Task, Crew
from langchain.llms import OpenAI
import os

# Load OpenAI API key from environment variable
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

llm = OpenAI(temperature=0.7, openai_api_key=openai_api_key)

class TripPlanningAgents:
    def __init__(self):
        self.llm = llm

    def research_agent(self):
        return Agent(
            role='Research Analyst',
            goal='Gather comprehensive information about travel destinations',
            backstory='You are an experienced travel researcher with vast knowledge about global destinations.',
            verbose=True,
            llm=self.llm
        )

    def budget_agent(self):
        return Agent(
            role='Budget Optimizer',
            goal='Optimize travel plans to fit within the given budget',
            backstory='You are a financial expert specializing in travel budgeting and cost optimization.',
            verbose=True,
            llm=self.llm
        )

    def itinerary_agent(self):
        return Agent(
            role='Itinerary Planner',
            goal='Create detailed and engaging travel itineraries',
            backstory='You are a seasoned travel planner known for creating unforgettable trip experiences.',
            verbose=True,
            llm=self.llm
        )

def plan_trip(trip_input):
    agents = TripPlanningAgents()
    
    research_task = Task(
        description=f"Research {trip_input.destination} for a {trip_input.age} year old traveler interested in {', '.join(trip_input.activities)}.",
        agent=agents.research_agent(),
        expected_output="A comprehensive report on the destination, including popular attractions, local customs, and travel tips."
    )

    budget_task = Task(
        description=f"Optimize a trip to {trip_input.destination} for a budget of ${trip_input.budget}.",
        agent=agents.budget_agent(),
        expected_output="A detailed budget breakdown including estimated costs for accommodation, transportation, food, and activities."
    )

    itinerary_task = Task(
        description=f"Create a detailed itinerary for a {len(trip_input.travel_dates)} day trip to {trip_input.destination}, including {trip_input.accommodation_style} accommodations and activities like {', '.join(trip_input.activities)}.",
        agent=agents.itinerary_agent(),
        expected_output="A day-by-day itinerary including accommodations, activities, and meal suggestions."
    )

    crew = Crew(
        agents=[agents.research_agent(), agents.budget_agent(), agents.itinerary_agent()],
        tasks=[research_task, budget_task, itinerary_task],
        verbose=True
    )

    result = crew.kickoff()

    # Process the CrewAI output
    processed_result = {
        "itinerary": str(result),  # Convert the entire output to a string
        "flight_options": ["Option 1: Direct flight", "Option 2: Layover in connecting city"],
        "accommodations": [f"{trip_input.accommodation_style} in {trip_input.destination}"],
        "activities": trip_input.activities,
        "total_cost": float(trip_input.budget)
    }

    return processed_result

def generate_trip_suggestions():
    agent = TripPlanningAgents().research_agent()
    task = Task(
        description="Generate 5 unique and exciting trip suggestions for various types of travelers.",
        agent=agent,
        expected_output="A list of 5 diverse trip suggestions, each including a destination, ideal traveler type, and key attractions."
    )
    result = agent.execute_task(task)
    return str(result).split('\n')  # Convert the result to a string before splitting