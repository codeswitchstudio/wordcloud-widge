import React from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client"; // Use createRoot from react-dom/client
import App from "./App.jsx"; // Ensure the correct import of App
import "./WordCloud.css";

ReactDOM.createRoot(document.getElementById("root")).render(<App />); // Use createRoot and render

//ReactDOM.render(<App />, document.getElementById("root"));
