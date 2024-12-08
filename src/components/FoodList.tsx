'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FoodList = () => {
  const [foods, setFoods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFoods = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post('https://ser531-food-recommendation-system.onrender.com/api/nutrition', { query: searchQuery });
        setFoods(response.data);
      } catch (error) {
        console.error('Error fetching food data:', error);
      }
      setIsLoading(false);
    };

    fetchFoods();
  }, [searchQuery]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Food List</h2>
      <input
        type="text"
        placeholder="Search food..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 mb-4"
      />
      {foods.length === 0 ? (
        <p>No items found</p>
      ) : (
        <ul>
          {foods.map((food, index) => (
            <li key={index}>
              {food.foodName} - {food.calories.value} calories
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FoodList;
