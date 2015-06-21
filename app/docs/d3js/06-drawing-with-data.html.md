# d3js: chapter 6. drawing with data

> 이 글은 http://infovis.kr 스터디 하면서 작성했고 [d3.js](http://www.aladin.co.kr/shop/wproduct.aspx?ISBN=896626106X) 6장의 내용이다.

## 6.3.1 SVG를 만들어 보자

<p id="phr-svg-sample"></p>

```js-run-d3
var w = 500
var h = 100
var dataset = [5, 10, 15, 20, 25];

var svg = d3.select('#phr-svg-sample').append('svg')
    .attr('width', w)
    .attr('height', h);

var circle = svg.selectAll('circle')
    .data(dataset);

circle.enter()
    .append('circle')
    .attr('cx', (d,i)=> (i*50) + 25)
    .attr('cy', h/2)
    .attr('r', (d)=> d)
    .attr('fill', 'yellow')
    .attr('stroke', 'orange')
    .attr('stroke-width', (d)=> d/2);
```

## 6.4 막대 차트 만들기.

<p id="phr-bar-chart"></p>

```js-run-d3
var w = 500
var h = 100
var dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
    11, 12, 15, 20, 18, 17, 16, 18, 23, 25];
var barPadding = 1;

var svg = d3.select('#phr-bar-chart').append('svg')
    .attr('width', w)
    .attr('height', h);

var rect = svg.selectAll('rect')
    .data(dataset);

rect.enter()
    .append('rect')
    .attr('x', (d, i)=> i * (w/dataset.length))
    .attr('y', (d)=> h - d*4)
    .attr('width', w/dataset.length - barPadding)
    .attr('height', (d)=> d*4)
    .attr("fill", (d)=> `rgb(0, 0, $d*10)`);

var text = svg.selectAll('text')
    .data(dataset);

text.enter()
    .append('text')
    .text((d)=> d)
    .attr('x', (d, i)=> i * (w/dataset.length) + (w/dataset.length - barPadding) /2)
    .attr('y', (d)=> h - (d*4) + 14)
    .attr('font-family', 'sans-serif')
    .attr('font-size', '11px')
    .attr('fill', 'white')
    .attr('text-anchor', 'middle');
```

## 6.5 산포도(scatterplot) 만들기

<p id="phr-scatterplot"></p>

```js-run-d3
var w = 500
var h = 100
var dataset = [
    [5, 20],
    [480, 90],
    [250, 50],
    [100, 33],
    [330, 95],
    [410, 12],
    [475, 44],
    [25, 67],
    [85, 21],
    [220, 88]
];

var svg = d3.select('#phr-scatterplot').append('svg')
    .attr('width', w)
    .attr('height', h);

var circle = svg.selectAll('circle')
    .data(dataset);

circle.enter()
    .append('circle')
    .attr('cx', (d)=> d[0])
    .attr('cy', (d)=> d[1])
    .attr('r', (d)=> Math.sqrt(h-d[1]));

var text = svg.selectAll('text')
    .data(dataset);

text.enter()
    .append('text')
    .text((d)=> `${d[0]}, ${d[1]}`)
    .attr('x', (d)=> d[0])
    .attr('y', (d)=> d[1])
    .attr('font-family', 'sans-serif')
    .attr('font-size', '11px')
    .attr('fill', 'red');
```
