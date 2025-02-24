import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import "./App.css"; // Import the styling

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [title, setTitle] = useState("Welcome to React Helmet POC");
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [location, setLocation] = useState("Detecting...");
  const [quote, setQuote] = useState("Loading a motivational quote...");

  // Toggle theme with persistence
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Update document title dynamically
  useEffect(() => {
    setTitle(theme === "light" ? "Light Mode Active" : "Dark Mode Active");
  }, [theme]);

  // Update the time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=YOUR_API_KEY`
          );
          const data = await response.json();
          setLocation(data.address.city || "Unknown Location");
        } catch (error) {
          setLocation("India");
        }
      });
    }
  }, []);

  // Fetch a random motivational quote
  useEffect(() => {
    fetch("https://api.quotable.io/random")
      .then((response) => response.json())
      .then((data) => setQuote(data.content))
      .catch(() => setQuote("If you can dream it, you can do it"));
  }, []);

  return (
    <div className={`app-container ${theme}`}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="This is an interactive page using React Helmet." />
      </Helmet>

      <h1 className="animated-heading">React Helmet POC</h1>
      <p>This page dynamically updates the document title, supports dark mode, and displays real-time data!</p>

      <div className="info-box">
        <h2>🕒 Live Time: {time}</h2>
        <h2>📍 Your Location: {location}</h2>
        <h2>💡 Motivational Quote: "{quote}"</h2>
      </div>

      <button onClick={toggleTheme} className="theme-button">
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </div>
  );
};

export default App;
