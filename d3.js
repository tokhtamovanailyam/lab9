// Define the size of the SVG canvas
const width = 500;
const height = 500;

// Create the SVG canvas
const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

// Generate 100 random points within the canvas
const data = d3.range(100).map(() => ({
  x: Math.random() * width,
  y: Math.random() * height
}));

// Create the scatter plot
svg.selectAll('circle')
  .data(data)
  .enter().append('circle')
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', 4);

// Load the Titanic dataset
d3.csv('titanic.csv').then(data => {
console.log(data); 
  // Select the relevant columns
  data = data.map(d => ({ age: d['Age'] }));

  // Compute the age distribution
  const ageCounts = d3.rollup(data, v => v.length, d => d.age);

  // Convert the age distribution to an array of objects
  const ageData = Array.from(ageCounts, ([age, count]) => ({ age, count }));

  // Compute the total number of passengers
  const totalPassengers = d3.sum(ageData, d => d.count);

  // Compute the percentage of passengers in each age group
  ageData.forEach(d => {
    d.percent = d.count / totalPassengers;
  });

  // Create the pie chart
  const radius = Math.min(width, height) / 2 - 50;
  const pie = d3.pie().value(d => d.percent);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);
  const colors = d3.scaleOrdinal(d3.schemeCategory10);
  const arcs = svg.selectAll('arc')
    .data(pie(ageData))
    .enter().append('g')
    .attr('transform', `translate(${width/2}, ${height/2})`);
  arcs.append('path')
    .attr('d', arc)
    .attr('fill', d => colors(d.data.age));
  arcs.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .text(d => `${d.data.age}: ${(d.data.percent * 100).toFixed(1)}%`);

});
