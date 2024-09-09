

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


  // HEADING: Title and Description
  const h1 = d3.select("#title").text("Monthly Global Land Surface Temperature");
  const h2 = d3.select("#description").html(`${yearMin} - ${yearMax}: base temperature ${dataset.baseTemperature}&deg;C`);


  // map dimensions
  const w = 1450;
  const h = 500;
  const padTop = 10;
  const padBot = 50;
  const padLeft = 70;
  const padRight = 10;


  // HEAT MAP SVG
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
    .attr("y", 10)
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
    .attr("x", w / 2)
    .attr("y", h - 10)
    .style("font-size", "80%")


  // heat colors: cold - cool (0 - 15 deg C)
  const tempColors = [
    '#002B5B', '#1A5F7A', '#159895', '#57C5B6', 
    '#9ED5C5', '#BCEAD5', '#DEF5E5', '#F1FADA', 
  ];
  // temperature data
  const tempMin = d3.min(dataset.monthlyVariance, d => dataset.baseTemperature + d.variance);
  const tempMax = d3.max(dataset.monthlyVariance, d => dataset.baseTemperature + d.variance);
  console.log("temperature range:", tempMin, '-', tempMax);
  // const tempRange = [0, 15];
  const tempRange = [0, 15];

  // temp - color scale : 0 - 15 deg C
  const tempColorScale = d3.scaleQuantize()
    .domain([...tempRange])
    .range([...tempColors]);
  console.log("color scale:", tempColorScale(tempMax));

  console.log("x band:", xScale.bandwidth());
  console.log("y band:", yScale.bandwidth());

  // TOOLTIP
  const tooltip = d3.select("#tooltip");
  // HEAT CELLS
  const cells = svg.selectAll("rect")
    .data(dataset.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-year", d => d.year)
    .attr("data-month", d => d.month - 1)    
    .attr("data-temp", d => dataset.baseTemperature + d.variance)
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(months[d.month - 1]))
    .attr("fill", d => tempColorScale(dataset.baseTemperature + d.variance))
    // mouse-event tooltip
    .on("mouseover", d => {
      console.log("mouseover:", d3.event);
      const cellDOM = d3.event.target.getBoundingClientRect();
      console.log("cellDOM:", cellDOM);
      tooltip
        .attr("data-year", d.year)
        .html(
          `
          <p>${d.year} ${months[d.month - 1]}</p>
          <p>${Math.round((dataset.baseTemperature + d.variance) * 1000) / 1000} &deg;C</p>
          `
        )
        .style("visibility", "visible")
        .style("top", cellDOM.y - 55 + "px");
      const tooltipDOM = document.querySelector("#tooltip").getBoundingClientRect();
      console.log("tooltipDOM:", tooltipDOM);
      tooltip
        .style("left", cellDOM.x + (cellDOM.width/2) - (tooltipDOM.width / 2) + "px");
    })
    .on("mouseout", d => {
      tooltip
        .style("visibility", "hidden")
    })


  // LEGEND
  const legendWidth = 400;
  const legendHeight = 50;
  const legendPad = 20;
  const legend = d3.select("#legend-container")
    .append("svg")
    .attr("id", "legend")
    .attr("width", legendWidth)
    .attr("height", legendHeight);
  // legend scale
  const legendScale = d3.scaleLinear()
    .domain([tempRange[0] - 1, tempRange[1] + 1])
    .range([legendPad, legendWidth - legendPad]);
  // legend axis
  const legendAxis = d3.axisBottom(legendScale);
  legend.append("g")
    .call(legendAxis)
    .attr("transform", `translate(0, ${legendPad})`);
  // legend graph
  legend.selectAll("rect")
    .data([...tempColors])
    .enter()
    .append("rect")
    .attr("fill", d => d)
    .attr("x", d => {
      const x = tempColorScale.invertExtent(d)[0];
      console.log("x:", x);
      return legendScale(x);
    })
    .attr("y", legendPad / 2)
    .attr("width", d => {
      const minMaxArr = tempColorScale.invertExtent(d);
      console.log("width min-max:", minMaxArr);
      const width = minMaxArr[1] - minMaxArr[0];
      console.log("width:", width, legendScale(width));
      return legendScale(width) - legendPad*2;
    })
    .attr("height", legendPad / 2);
  legend.append("text")
    .html(`&deg;C`)
    .attr("text-anchor", "start")
    .attr("x", 390)
    .attr("y", 30)
    .style("font-size", "80%");



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
