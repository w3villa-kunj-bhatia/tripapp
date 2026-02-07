import React, { useState, useEffect } from "react";
import { searchDestinations } from "./api";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Initialize Itinerary safely
  const [itinerary, setItinerary] = useState(() => {
    try {
      const saved = localStorage.getItem("my_trip");
      if (saved && saved !== "undefined") return JSON.parse(saved);
      return [];
    } catch (e) {
      return [];
    }
  });

  // Search Logic
  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const data = await searchDestinations(query);
        if (active) setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        if (active) setResults([]);
      }
    };
    const timer = setTimeout(fetchData, 400); // Debounce search
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("my_trip", JSON.stringify(itinerary));
  }, [itinerary]);

  const add = (p) => {
    if (!itinerary.find((i) => i.id === p.id)) {
      setItinerary([...itinerary, { ...p, start: "", end: "" }]);
    }
  };

  const remove = (id) => setItinerary(itinerary.filter((i) => i.id !== id));

  const updateDate = (id, field, val) => {
    setItinerary(
      itinerary.map((i) => (i.id === id ? { ...i, [field]: val } : i)),
    );
  };

  return (
    <div className="container">
      <header>
        <h1>Travel Planner</h1>
        <input
          className="search-input"
          placeholder="Search (e.g., Paris, Tokyo)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {/* Helper text for debugging */}
        <p style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>
          Note: With a fake key, only Paris, London, NY, etc. will work.
        </p>
      </header>

      <div className="main-content">
        <section className="results-area">
          <h2>Destinations</h2>
          <div className="grid">
            {results.map((dest) => (
              <div key={dest.id} className="card">
                <img src={dest.image} alt={dest.city} />
                <div className="card-info">
                  <h3>{dest.city}</h3>
                  <button
                    disabled={itinerary.some((i) => i.id === dest.id)}
                    onClick={() => add(dest)}
                  >
                    {itinerary.some((i) => i.id === dest.id) ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            ))}
            {results.length === 0 && <p>No destinations found.</p>}
          </div>
        </section>

        <section className="itinerary-area">
          <h2>My Plan</h2>
          {itinerary.length === 0 && <p>Your plan is empty.</p>}
          {itinerary.map((item) => (
            <div key={item.id} className="trip-item">
              <h3>{item.city}</h3>
              <div className="date-row">
                <input
                  type="date"
                  value={item.start}
                  onChange={(e) => updateDate(item.id, "start", e.target.value)}
                  className="date-input"
                />
                <input
                  type="date"
                  value={item.end}
                  onChange={(e) => updateDate(item.id, "end", e.target.value)}
                  className="date-input"
                />
              </div>
              <button className="btn-remove" onClick={() => remove(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
