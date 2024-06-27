import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import "./WordCloud.css";

const WordCloud = () => {
  const svgRef = useRef();
  const [wordCounts, setWordCounts] = useState([]);
  const [numWords, setNumWords] = useState(50); // Initial number of words

  useEffect(() => {
    // Fetch the data from the JSON file
    fetch("/data.json") //this version is the array from original
      .then((response) => response.json())
      .then((data) => {
        const processedData = Object.entries(data[0]).map(([word, count]) => ({
          text: word,
          value: count,
        }));
        setWordCounts(processedData);
      })
      .catch((error) => console.error("Error fetching the data:", error));
  }, []);

  useEffect(() => {
    if (wordCounts.length === 0) return;

    // Sort words by value and take the top `numWords`
    const displayedWords = wordCounts
      .sort((a, b) => b.value - a.value)
      .slice(0, numWords);

    const layout = cloud()
      .size([900, 500])
      .words(displayedWords)
      .padding(1) // Add padding to loosen word spacing
      .rotate(() => (Math.random() > 0.9 ? 90 : 0)) // Rotate words by 0 or 90 degrees
      .font("Quicksand")
      .fontSize((d) => d.value * 5) // Adjust font size scaling as needed
      .on("end", draw);

    layout.start();

    function draw(words) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear previous words

      const g = svg
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr(
          "transform",
          `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`
        );

      g.selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.size}px`)
        .style("font-family", "Quicksand")
        .attr("text-anchor", "middle")
        .attr("class", (d, i) => `word${i % 5}`) // Assign classes for color
        .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d) => d.text)
        .on("click", (event, d) => {
          // Handle the click event
          console.log(`Word clicked: ${d.text}`);
          // Add your custom click handler code here
          alert(`Word clicked: ${d.text}`);
        });
    }
  }, [wordCounts, numWords]); // Re-render when numWords changes

  return (
    <div className="wordcloud-container">
      <svg ref={svgRef}></svg>
      <div className="slider-container">
        <label htmlFor="num-words-slider">Number of Words:</label>
        <br />
        <input
          id="num-words-slider"
          type="range"
          min="1"
          max="100"
          value={numWords}
          list="tickmarks"
          onChange={(e) => setNumWords(parseInt(e.target.value))}
        />

        <datalist id="tickmarks">
          <option value="1" label="1">
            1
          </option>
          <option value="25" label="25">
            25
          </option>
          <option value="50" label="50">
            50
          </option>
          <option value="75" label="75">
            75
          </option>
          <option value="100" label="100">
            100
          </option>
        </datalist>

        <div className="datalist-container">
          <label>1 </label>
          <label>25 </label>
          <label>50 </label>
          <label>75 </label>
          <label>100 </label>
        </div>
      </div>
    </div>
  );
};

export default WordCloud;
