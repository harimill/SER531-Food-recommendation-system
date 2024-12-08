"use client";
import React, { useState } from "react";
import { useCalorieContext } from "../context/CalorieContext";
import SearchBar from "../../components/SearchBar";
import Link from "next/link";
import axios from "axios";

const AddCaloriesPage = () => {
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [servingSize, setServingSize] = useState(1);
  const [foodData, setFoodData] = useState<any | null>(null);
  const [alternativeIngredients, setAlternativeIngredients] = useState<any[]>([]);
  const { addCalories, addFoodToLog } = useCalorieContext();

  const handleFoodSelect = async (food: string) => {
    setSelectedFood(food);
    try {
      const response = await axios.post('https://ser531-food-recommendation-system.onrender.com/api/nutrition', { query: food });
      console.log('Response from backend:', response.data);
      if (response.data.combinedResults && response.data.combinedResults.length > 0) {
        setFoodData(response.data.combinedResults[0]);
        setAlternativeIngredients(response.data.alternatives || []);
      } else {
        console.error('No combinedResults in response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching nutritional data:', error);
    }
  };

  const handleServingSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServingSize(Number(e.target.value));
  };

  const calories = foodData ? Number(foodData.calories) * servingSize : 0;

  const handleAddFood = (foodName: string) => {
    addFoodToLog(foodName);
    addCalories(calories);
  };

  return (
    <div className="page-container">
      <nav className="nav">
        <div className="home-text">
          <Link href="/" className="home-link">Home</Link>
        </div>
      </nav>

      <h1 className="page-title">Add Items</h1>

      <SearchBar onSelectFood={handleFoodSelect} />

      {selectedFood && foodData && (
        <div className="food-details">
          <h2>{selectedFood.split('#')[1]}</h2>
          <p>
            Calories per serving: {foodData.calories} kcal
            <br />
            Serving Size:
            <input
              type="number"
              min="1"
              value={servingSize}
              onChange={handleServingSizeChange}
              className="serving-size-input"
            />
          </p>
          <p>Total Calories: {calories}</p>
          <button onClick={() => handleAddFood(selectedFood)} className="add-button">
            Add to Total
          </button>
          {alternativeIngredients.length > 0 && (
            <div className="alternative-ingredients">
              <h3>Healthier Alternatives:</h3>
              <ul>
                {alternativeIngredients.map((alt, index) => (
                  <li key={index}>
                    {alt.alternative} is a healthier alternative for {alt.ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .page-container {
          padding: 2rem;
          text-align: center;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: bold;
        }

        .food-details {
          font-size: 1.5rem;
          margin-top: 2rem;
        }

        .serving-size-input {
          width: 50px;
          padding: 0.5rem;
          font-size: 1rem;
          margin-left: 0.5rem;
        }

        .add-button {
          margin-top: 1rem;
          padding: 0.7rem 1.5rem;
          font-size: 1.2rem;
          background-color: #4CAF50;
          color: white;
          border: none;
          cursor: pointer;
        }

        .add-button:hover {
          background-color: #45a049;
        }

        .nav {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .home-text {
          font-size: 1.5rem;
          color: black;
        }

        .home-link {
          text-decoration: none;
          color: black;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .home-link:hover {
          color: #0073e6;
        }

        .alternative-ingredients {
          margin-top: 1rem;
          font-size: 1.2rem;
          color: #555;
        }

        .alternative-ingredients ul {
          list-style-type: none;
          padding: 0;
        }

        .alternative-ingredients li {
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default AddCaloriesPage;
