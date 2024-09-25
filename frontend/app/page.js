'use client'

import { useState } from 'react';
import { Input, Button, Card, CardBody, CardHeader, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spinner } from "@nextui-org/react";
import { useTheme } from "next-themes";

const API_URL = 'http://localhost:8000';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    current_location: '',
    destination: '',
    budget: '',
    travel_dates: ['', ''],
    accommodation_style: '',
    activities: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tripPlan, setTripPlan] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (index, value) => {
    const newDates = [...formData.travel_dates];
    newDates[index] = value;
    setFormData({ ...formData, travel_dates: newDates });
  };

  const handleActivityChange = (activities) => {
    setFormData({ ...formData, activities: Array.from(activities) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.activities.length === 0) {
      setError("Please select at least one activity.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/plan_trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          budget: parseFloat(formData.budget),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to plan trip');
      }
      const data = await response.json();
      setTripPlan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/trip_suggestions`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch suggestions');
      }
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Plan Your Trip</h1>
          <Button
            auto
            color="secondary"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </Button>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            <Input
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              required
            />
            <Input
              label="Current Location"
              value={formData.current_location}
              onChange={(e) => handleInputChange('current_location', e.target.value)}
              required
            />
            <Input
              label="Destination"
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              required
            />
            <Input
              label="Budget"
              type="number"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              required
            />
            <div className="flex space-x-2">
              <Input
                label="Start Date"
                type="date"
                value={formData.travel_dates[0]}
                onChange={(e) => handleDateChange(0, e.target.value)}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={formData.travel_dates[1]}
                onChange={(e) => handleDateChange(1, e.target.value)}
                required
              />
            </div>
            <Input
              label="Accommodation Style"
              value={formData.accommodation_style}
              onChange={(e) => handleInputChange('accommodation_style', e.target.value)}
              required
            />
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">
                  Select Activities ({formData.activities.length} selected)
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                selectionMode="multiple"
                selectedKeys={new Set(formData.activities)}
                onSelectionChange={handleActivityChange}
              >
                <DropdownItem key="sightseeing">Sightseeing</DropdownItem>
                <DropdownItem key="museums">Museums</DropdownItem>
                <DropdownItem key="outdoor">Outdoor Activities</DropdownItem>
                <DropdownItem key="food">Food Tasting</DropdownItem>
                <DropdownItem key="shopping">Shopping</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Plan My Trip'}
            </Button>
          </form>
        </CardBody>
      </Card>

      <Button onClick={fetchSuggestions} color="secondary" disabled={loading}>
        {loading ? <Spinner size="sm" /> : 'Get Trip Suggestions'}
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {tripPlan && (
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-bold">Your Trip Plan</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Itinerary:</h3>
                <p>{tripPlan.itinerary}</p>
              </div>
              <div>
                <h3 className="font-semibold">Flight Options:</h3>
                <ul className="list-disc pl-5">
                  {tripPlan.flight_options.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Accommodations:</h3>
                <ul className="list-disc pl-5">
                  {tripPlan.accommodations.map((accommodation, index) => (
                    <li key={index}>{accommodation}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Activities:</h3>
                <ul className="list-disc pl-5">
                  {tripPlan.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Total Cost:</h3>
                <p>${tripPlan.total_cost}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {suggestions.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-bold">Trip Suggestions</h2>
          </CardHeader>
          <CardBody>
            <ul className="list-disc pl-5">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  );
}