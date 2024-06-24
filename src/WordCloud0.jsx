// WordCloud.jsx
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const WordCloud = () => {
  const svgRef = useRef();
  const [wordCounts, setWordCounts] = useState([]);

  useEffect(() => {
    // Fetch the data from the JSON file
    fetch("/data.json")
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

    const layout = cloud()
      .size([800, 400])
      .words(wordCounts)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font("Impact")
      .fontSize((d) => d.value * 5) // Adjust font size scaling as needed
      .on("end", draw);

    layout.start();

    function draw(words) {
      const svg = d3
        .select(svgRef.current)
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr(
          "transform",
          `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`
        );

      svg
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.size}px`)
        .style("font-family", "Impact")
        .style("fill", (d, i) => d3.schemeCategory10[i % 10])
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d) => d.text);
    }
  }, [wordCounts]);

  return <svg ref={svgRef}></svg>;
};

export default WordCloud;
