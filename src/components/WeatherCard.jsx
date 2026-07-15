import { Link } from "react-router-dom";

function WeatherCard({ city }) {
  return (
    <Link
      to={`/city/${encodeURIComponent(city.city_name)}`}
      className="weather-card"
    >
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
    </Link>
  );
}

export default WeatherCard;