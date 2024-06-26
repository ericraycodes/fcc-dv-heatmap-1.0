

/** HEAT MAP VISUALIZATION
    * @parameter Array: the fetched dataset to visualize; array of objects.
    * @library D3: loaded and accessed through a CDN.
    */
function mapData(dataset) {
  // console
  console.log("creating heat map...");

  // map dimensions
  const w = 1500;
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

  // scale Y
  const yScale = d3.scaleOrdinal()
    .domain([d3.min(dataset, d => d.month), d3.max(dataset, d => d.month)])
    .range([h - padBot, padTop]);
  // scale X
  const xScale = d3.scaleOrdinal()
    .domain([d3.min(dataset, d => d.year), d3.max(dataset, d => d.year)])
    .range([padLeft, w - padRight]);

  // Y axis
  const yAxis = d3.axisLeft(yScale);
  svg.append("g").attr("transform", `translate(${padLeft}, 0)`).call(yAxis);
  // X axis
  const xAxis = d3.axisBottom(xScale);
  svg.append("g").attr("transform", `translate(0, ${h - padBot})`).call(xAxis);
}




/** EVENT LISTENER: REQUEST DATA ON 'DOMCONTENTLOADED'
    * @event 'DOMContentLoaded'
    *
    * This script is deferred. The event will fire when
    * the D3 library and other resources are loaded successfully.
    *
    * This event will run a call back to request external dataset.
    * A function is run to visualize dataset when loaded.
    */
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
