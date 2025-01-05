// components/Weather.tsx
"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Wind, Loader, Search } from "lucide-react";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  name: string;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("London");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/weather?city=${cityName}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch weather");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load weather data"
      );
      console.error("Error fetching weather:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      setSearchInput("");
    }
  };

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case "clear":
        return <Sun className="h-12 w-12 text-yellow-500" />;
      case "clouds":
        return <Cloud className="h-12 w-12 text-gray-500" />;
      case "rain":
        return <CloudRain className="h-12 w-12 text-blue-500" />;
      default:
        return <Wind className="h-12 w-12 text-gray-400" />;
    }
  };

  // Popular cities quick selection
  const popularCities = ["London", "New York", "Tokyo", "Paris", "Sydney"];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter city name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>

        {/* Popular Cities */}
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Popular Cities:</p>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((popularCity) => (
              <button
                key={popularCity}
                onClick={() => setCity(popularCity)}
                className={`px-3 py-1 text-sm rounded-full ${
                  city === popularCity
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {popularCity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weather Display */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => fetchWeather(city)}
            className="mt-4 text-indigo-600 hover:text-indigo-500"
          >
            Try Again
          </button>
        </div>
      ) : (
        weather && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Weather in {weather.name}
              </h2>
              <button
                onClick={() => fetchWeather(city)}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                {getWeatherIcon(weather.weather[0].main)}
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(weather.main.temp)}°C
                  </p>
                  <p className="text-gray-500">
                    {weather.weather[0].description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Feels Like</p>
                  <p className="text-lg font-medium text-gray-900">
                    {Math.round(weather.main.feels_like)}°C
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Humidity</p>
                  <p className="text-lg font-medium text-gray-900">
                    {weather.main.humidity}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
