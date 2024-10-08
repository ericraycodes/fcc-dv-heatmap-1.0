# Concept

## About
Visualizing dataset as heat map. The third certification project of freeCodeCamp's Data Visualization Course.

## Workflow
 1. Prepared the project's name and directory.
 1. Prepared the necessary source files: html, js, css.
 1. Created a remote git repository for version control throughout development.
 1. Secured the necessary CDNs: D3 library and fCC test suite.
 1. Built the HTML structure of the project.
 1. Coded the logic of the project with JavaScript and D3 library.
 1. The CSS styles are added along the way when needed.
 1. Conducted tests throughout development features and phases via the fCC test suite.

## Logic
 - The logic starts when all CDNs are securely loaded.
 - Second, fetch external dataset through XHR.
 - Finally, visualize data as a heat map - as instructed, through the use of the D3 library.
   1. Select the container to append the heat map `<SVG>`.
   1. Define heatmap dimensions: *width*, *height*, *paddings*.
   1. Define the kind of **scale** the heatmap needs.
   1. Create labeled *axes*.
   1. Create the **heatmap** from the dataset using `<rect>` elements with *properties*.
   1. Add the features: *tooltip*, *legend*.

## References
 - This is the example [functionality](https://heat-map.freecodecamp.rocks/)
 - TickValues for ordinal scales: [reference](https://observablehq.com/@d3/axis-ticks)
 - Temperature metric of coldness and hotness: [reference](https://thinkmetric.uk/basics/temperature/)
 - SVG CSS styling: [stroke](https://www.w3schools.com/graphics/svg_stroking.asp)
 - How to access DOM element's box properties: [HTMLElement.getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect)
 - How to keep mouse-events on elements beneath the hovering tooltip: [pointer-events: none](https://www.geeksforgeeks.org/how-to-click-through-a-div-to-its-underlying-elements-in-css/)

# Others
## HTML Entities used
 - `&deg;`, used for the **degree** symbol
## Temperature Color Scale Sample
 - This represents 0 - 15 deg Celcius (freezing point to a cool temperature):
  `['#002B5B', '#1A5F7A', '#159895', '#57C5B6', '#8EC3B0', '#9ED5C5', '#BCEAD5', '#DEF5E5'];`
