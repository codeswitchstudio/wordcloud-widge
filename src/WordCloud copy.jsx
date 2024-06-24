import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import "./WordCloud.css"; // Ensure this line is present

const WordCloud = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const layout = cloud()
      .size([800, 400])
      .words(data.map((d) => ({ text: d.text, size: d.frequency * 10 })))
      .padding(5)

      .rotate(() => 0) // Ensure all words are horizontal or  .rotate(() => (Math.random() < 0.5 ? 0 : 90))
      .fontSize((d) => d.size)
      .on("end", draw);

    layout.start();

    function draw(words) {
      d3.select(svgRef.current).selectAll("*").remove(); // Clear previous drawing
      const svg = d3
        .select(svgRef.current)
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr(
          "transform",
          `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`
        )
        .attr("class", "wordcloud"); // Apply wordcloud class

      svg
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .attr("class", (d, i) => `word${i % 5}`) // Assign classes for color
        .style("font-size", (d) => `${d.size}px`)
        .attr("text-anchor", "middle")

        .attr("font-family", "Quicksand")

        .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d) => d.text);
    }
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default WordCloud;
