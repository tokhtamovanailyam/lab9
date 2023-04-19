width = 500;
height = 500;
svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

data = d3.range(100).map(() => ({
  x: Math.random() * width,
  y: Math.random() * height
}));

svg.selectAll('circle')
  .data(data)
  .enter().append('circle')
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', 4);

d3.csv('titanic.csv').then(data => {
console.log(data); 
  data = data.map(d => ({ age: d['Age'] }));
 age1 = d3.rollup(data, v => v.length, d => d.age);
 age2 = Array.from(age1, ([age, count]) => ({ age, count }));
 passengers = d3.sum(age2, d => d.count);

  age2.forEach(d => {
    d.percent = d.count / passengers;
  });

  radius = Math.min(width, height) / 2 - 50;
  pie = d3.pie().value(d => d.percent);
  arc = d3.arc().innerRadius(0).outerRadius(radius);
  colors = d3.scaleOrdinal(d3.schemeCategory10);
  arcs = svg.selectAll('arc')
    .data(pie(age2))
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