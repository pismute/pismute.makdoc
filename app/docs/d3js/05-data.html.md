# d3js: chapter 5. data

<style>
circle {
    fill: none;
    fill-opacity: .2;
    stroke: black;
    stroke-width: 1.5px;
</style>

> 이 글은 http://infovis.kr 스터디 하면서 작성했고 [d3.js](http://www.aladin.co.kr/shop/wproduct.aspx?ISBN=896626106X) 5장의 내용이다.

<p id="phr-scatch"></p>

```js
var dataset = [5, 10, 15, 20, 25];

d3.select('#phr-scatch').selectAll('p')
    .data(dataset)
    .enter()
        .append('p')
        .text((d)=> `$d: New paragraph!`)
        .style('color', (d)=> (d>15)? 'red': 'black');
```

### Data Join - [Thinking with Joins - mike bostocks](http://bost.ocks.org/mike/join/)

`selectAll("circle")`은 "circle" 엘리먼트랑 data랑 역는 행위:

<p id="phr-join"></p>

```js
var svg = d3.select("#phr-join").append("svg")
        .attr("width", 720)
        .attr("height", 240)
    .append("g")
        .attr("transform", "translate(0,128)");

var data = svg.append("g")
    .attr("transform", "translate(300)");

data.append("circle")
    .style("fill", "#3182bd");

data.append("text")
    .attr("y", -120)
    .text("Data")
    .style("font-weight", "bold");

data.append("text")
    .attr("x", -50)
    .text("Enter");

svg.append("text")
    .attr("x", 360).
    text("Update");

var elements = svg.append("g")
    .attr("transform", "translate(420)");

elements.append("circle")
    .style("fill", "#e6550d");

elements.append("text")
    .attr("y", -120)
    .text("Elements")
    .style("font-weight", "bold");

elements.append("text")
    .attr("x", 50)
    .text("Exit");

svg.selectAll("circle")
    .attr("r", 110);

svg.selectAll("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle");
```

- update(inner) selection: Data points joined to **existing elements**
- enter(left) selection: Leftover **unbound data** produce the enter
- exit(right) selection: **any remaining unbound elements**

update/enter/exit selection을 어떤식으로 코딩해야 할지는 [General Update Pattern, I](http://bl.ocks.org/mbostock/3808218)를 보는게 좋다.

#### Update/Exit Selection:

<div id="phr-join-update">
    <p></p>
    <p></p>
    <p></p>
    <p></p>
    <p></p>
    <div></div>
    <div></div>
</div>

```html
<div id="phr-join-update">
    <p></p>
    <p></p>
    <p></p>
    <p></p>
    <p></p>
    <div></div> //no selection
    <div></div> //no selection
</div>
```
```js
var dataset = [1,2,3];

d3.select('#phr-join-update').selectAll('p')
    .data(dataset) //return update selection
        .text( (d)=> `$d: update selection`)
        .style('color', 'green')
    .exit()
        .text('exit selection')
        .style('color', 'red');
```

#### Enter Selection:

<div id="phr-join-enter">
    <p></p>
    <p></p>
    <p></p>
</div>

```html
<div id="phr-join-enter">
    <p></p>
    <p></p>
    <p></p>
</div>
```

```js
var dataset = [1,2,3,4,5];

d3.select('#phr-join-enter').selectAll('p')
    .data(dataset) //return update selection
        .text( (d)=> `$d: update selection`)
        .style('color', 'green')
    .enter()    //return enter selection
        .append('p')
        .text( (d)=> `$d: enter selection` )
        .style('color', 'red');
```

#### Transition

d3js 책 9장에서 배운다:

<script>
    runLangJs()
</script>
