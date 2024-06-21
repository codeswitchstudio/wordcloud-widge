import React, { useState, useEffect } from "react";
import WordCloud from "./WordCloud.jsx";
import "./WordCloud.css";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/sample-words.json")
      .then((response) => response.json())
      .then((json) => {
        const filteredData = json
          .filter((item) => item.text && item.frequency > 0)
          .map((item) => ({ text: item.text, frequency: item.frequency }));
        setData(filteredData);
      })
      .catch((error) => console.error("Error fetching the data:", error));
  }, []);

  return (
    <div>
      <h1>Word Cloud</h1>
      <WordCloud data={data} />
    </div>
  );
};

export default App; // Ensure App is the default export
