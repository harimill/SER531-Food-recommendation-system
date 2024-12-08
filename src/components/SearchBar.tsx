"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

type SearchBarProps = {
  onSelectFood: (food: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSelectFood }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState<any[]>([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.post('https://ser531-food-recommendation-system.onrender.com/api/nutrition', { query: searchQuery });
        if (response.data.combinedResults) {
          const uniqueFoods = Array.from(new Set(response.data.combinedResults.map((foodItem: any) => foodItem.foodItem)))
            .map(foodItem => {
              return response.data.combinedResults.find((item: any) => item.foodItem === foodItem);
            });
          setFilteredFoods(uniqueFoods);
        }
      } catch (error) {
        console.error('Error fetching food data:', error);
      }
    };

    if (searchQuery) {
      fetchFoods();
    } else {
      setFilteredFoods([]);
    }
  }, [searchQuery]);

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for food..."
        className="search-bar"
      />
      <ul className="search-results">
        {filteredFoods.map((foodItem, index) => (
          <li
            key={`${foodItem.foodItem}-${index}`}
            onClick={() => onSelectFood(foodItem.foodItem)}
            className="food-item"
          >
            {foodItem.foodItem.split('#')[1]} - {foodItem.calories} calories
          </li>
        ))}
      </ul>

      <style jsx>{`
        .search-bar-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          padding: 1rem;
          text-align: center;
        }

        .search-bar {
          width: 100%;
          padding: 0.5rem;
          font-size: 1.2rem;
          border-radius: 5px;
          border: 1px solid #ddd;
          margin-bottom: 1rem;
        }

        .search-results {
          list-style-type: none;
          padding: 0;
        }

        .food-item {
          padding: 0.5rem;
          cursor: pointer;
          background-color: #f9f9f9;
          border-bottom: 1px solid #ddd;
        }

        .food-item:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
