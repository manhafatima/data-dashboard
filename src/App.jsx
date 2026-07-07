import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Miami",
    "Seattle",
    "Denver",
    "Boston",
    "Dallas",
  ];
  
  const [weatherData, setWeatherData] = useState([]);
  const [search, setSearch] = useState("");
  const [weatherFilter, setWeatherFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
    setLoading(true);

    try {
      const weatherResults = await Promise.all(
        cities.map(async (city) => {
          const response = await fetch(
            `https://api.weatherbit.io/v2.0/current?city=${encodeURIComponent(
              city
            )}&key=${API_KEY}`
          );

          if (!response.ok) {
            console.error(
              `Failed to fetch ${city}: ${response.status} ${response.statusText}`
            );
            return null;
          }

          const result = await response.json();

          console.log(`${city}:`, result);

          return result.data?.[0] || null;
        })
      );

      const validWeather = weatherResults.filter((city) => city !== null);

      console.log("Final Weather Data:", validWeather);

      setWeatherData(validWeather);
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchWeather();
  }, []);

  const filteredWeather = useMemo(() => {
    return weatherData.filter((city) => {
      const matchesSearch = city.city_name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        weatherFilter === "All" ||
        city.weather.description === weatherFilter;

      return matchesSearch && matchesFilter;
    });
  }, [weatherData, search, weatherFilter]);

  // Summary Statistics
  const totalCities = filteredWeather.length;

  const averageTemp =
    totalCities > 0
      ? (
          filteredWeather.reduce((sum, city) => sum + city.temp, 0) /
          totalCities
        ).toFixed(1)
      : 0;

  const hottestCity =
    totalCities > 0
      ? filteredWeather.reduce((max, city) =>
          city.temp > max.temp ? city : max
        )
      : null;

  const weatherTypes = [
    "All",
    ...new Set(weatherData.map((city) => city.weather.description)),
  ];

  return (
    <div className="app">
      <header>
        <h1>🌤 Weather Dashboard</h1>
        <p>Current weather in major U.S. cities</p>
      </header>

      {/* Summary Cards */}
      <section className="stats">
        <div className="stat-card">
          <h2>{totalCities}</h2>
          <p>Cities Displayed</p>
        </div>

        <div className="stat-card">
          <h2>{averageTemp}°C</h2>
          <p>Average Temperature</p>
        </div>

        <div className="stat-card">
          <h2>
            {hottestCity
              ? `${hottestCity.city_name} (${hottestCity.temp}°C)`
              : "--"}
          </h2>
          <p>Hottest City</p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="controls">
        <input
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={weatherFilter}
          onChange={(e) => setWeatherFilter(e.target.value)}
        >
          {weatherTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </section>

      {/* Weather Cards */}
      {loading ? (
        <h2>Loading weather...</h2>
      ) : (
        <section className="weather-list">
          {filteredWeather.map((city) => (
            <div className="weather-card" key={city.city_name}>
              <h2>{city.city_name}</h2>

              <p>
                <strong>Temperature:</strong> {city.temp}°C
              </p>

              <p>
                <strong>Weather:</strong> {city.weather.description}
              </p>

              <p>
                <strong>Humidity:</strong> {city.rh}%
              </p>

              <p>
                <strong>Wind Speed:</strong> {city.wind_spd} m/s
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default App;