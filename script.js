

/** HEAT MAP VISUALIZATION
    * @parameter Array: the fetched dataset to visualize; array of objects.
    * @library D3: loaded and accessed through a CDN.
    */
function mapData(dataset) {
  // console
  console.log("creating heat map...");
  // console.log("dataset.monthlyVariance:", dataset.monthlyVariance);
  // console.log(typeof dataset.monthlyVariance[0].year);


  // data info
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  const yearMin = d3.min(dataset.monthlyVariance, d => d.year);
  const yearMax = d3.max(dataset.monthlyVariance, d => d.year);
  console.log("yearmin:", yearMin);
  console.log("yearmax:", yearMax);
  let yearRange = [];
  let year = yearMin;
  do {
    yearRange.push(year);
    year++;
  } while (year <= yearMax)
  console.log("yearRange:",yearRange);


  // heading
  const h1 = d3.select("#title").text("Monthly Global Land Surface Temperature");
  const h2 = d3.select("#description").html(`${yearMin} - ${yearMax}: base temperature ${dataset.baseTemperature}&deg;C`);


  // map dimensions
  const w = 1500;
  const h = 500;
  const padTop = 10;
  const padBot = 60;
  const padLeft = 100;
  const padRight = 10;


  // svg
  const svg = d3.select("#heatmap-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);


  // Y axis
  const yScale = d3.scaleBand()
    .domain(months)
    .range([h - padBot, padTop]);
  const yAxis = d3.axisLeft(yScale);
  svg.append("g")
    .attr("transform", `translate(${padLeft}, 0)`)
    .call(yAxis)
    .attr("id", "y-axis");
  svg.append("text")
    .text("Months")
    .attr("text-anchor", "start")
    .attr("x", -250)
    .attr("y", 30)
    .style("transform", "rotate(-90deg)")
    .style("font-size", "80%")

  // X axis
  const xScale = d3.scaleBand()
    .domain(yearRange)
    .range([padLeft, w - padRight]);
  const xAxis = d3.axisBottom(xScale)
    .tickValues(xScale.domain().filter(yr => yr%10===0));
  svg.append("g")
    .attr("transform", `translate(0, ${h - padBot})`)
    .call(xAxis)
    .attr("id", "x-axis");
  svg.append("text")
    .text("Years")
    .attr("text-anchor", "start")
    .attr("x", 750)
    .attr("y", 480)
    // .style("transform", "rotate(-90deg)")
    .style("font-size", "80%")

  // heat colors: cold - hot : #3A1078, #6482AD, #C63C51, #921A40
  const tempColors = ['#3A1078', '#6482AD', '#C63C51', '#921A40'];

  // temperature data
  const tempMin = d3.min(dataset.monthlyVariance, d => dataset.baseTemperature + d.variance);
  const tempMax = d3.max(dataset.monthlyVariance, d => dataset.baseTemperature + d.variance);
  console.log("temperature range:", tempMin, '-', tempMax);

  // temp - color scale
  const tempColorScale = d3.scaleQuantize()
    .domain([tempMin, tempMax])
    .range(tempColors);
  console.log("color scale:", tempColorScale(tempMax));

  console.log("x band:", xScale.bandwidth());
  console.log("y band:", yScale.bandwidth());

  // heat cells
  svg.selectAll("rect")
    .data(dataset.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-year", d => d.year)
    .attr("data-month", d => months[d.month - 1])    
    .attr("data-temp", d => dataset.baseTemperature + d.variance)
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(months[d.month - 1]))
    .attr("fill", d => tempColorScale(dataset.baseTemperature + d.variance))
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
