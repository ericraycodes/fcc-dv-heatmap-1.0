

// HEAT MAP
function mapData(data) {
  // console
  console.log("creating heat map...");

  // map dimensions
  const w = 1200;
  const h = 500;
  const padTop = 10;
  const padBot = 50;
  const padLeft = 100;
  const padRight = 10;

  // svg
  const svg = d3.select("#heatmap-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
}




// REQUEST DATA ON 'DOMCONTENTLOADED'
document.addEventListener("DOMContentLoaded", () => {
  // console DOM loaded
  console.log("DOM loaded!");

  // XHR object
  const request = new XMLHttpRequest();
  // initialize request
  const datasetURL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
  request.open("GET", datasetURL, true);
  // send request
  request.send();

  // when request is successful and data is loaded
  request.onload = () => {
    // console successful request
    console.log("Request successful!")
    // capture the data requested
    const json = JSON.parse(request.responseText);
    console.log("data:", json);
    // run visualization
    mapData(json);
  };
});
