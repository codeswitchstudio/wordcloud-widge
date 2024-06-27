//Extract Word Frequencies: Parse the JSON and extract the word frequencies.

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import "./WordCloud.css"; // Import the CSS file

const WordCloud = () => {
  const svgRef = useRef();
  const [wordFrequencies, setWordFrequencies] = useState(null);

  useEffect(() => {
    // Fetch the JSON data
    fetch("/Carl_Rogers_Counsels_An_Individual_On_Anger_pretty_tx.json")
      .then((response) => response.json())
      .then((data) => {
        const frequencies = data["word frequencies"];
        setWordFrequencies(frequencies);
      });
  }, []);

  useEffect(() => {
    if (!wordFrequencies) return;

    const words = Object.keys(wordFrequencies).map((word) => ({
      text: word,
      size: wordFrequencies[word] * 10, // Scale the word size as needed
    }));

    const layout = cloud()
      .size([800, 400])
      .words(words)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font("Quicksand")
      .fontSize((d) => d.size)
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
        .style("font-family", "Quicksand")
        .attr("class", (d, i) => `word${i % 5}`) // Assign classes for color
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d) => d.text);
    }
  }, [wordFrequencies]);

  return <svg ref={svgRef} className="word-cloud"></svg>;
};

export default WordCloud;
