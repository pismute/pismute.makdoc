# d3js: chapter 8. axis

> 이 글은 http://infovis.kr 스터디 하면서 작성했고 [d3.js](http://www.aladin.co.kr/shop/wproduct.aspx?ISBN=896626106X) 8장의 내용이다.

## [Axis](https://github.com/mbostock/d3/wiki/SVG-Axes)

이 페이지 내내 사용하는 공통 코드(7장의 내용):

```js
//global로 선언하는 것은 안좋은 습관이지만,
//아래 예제에서 계속 사용하기 위해 global로 선언한다.
var g = window;

g.w = 500;
g.h = 300;
g.padding = 20;
g.dataset = [
    [5, 20],
    [480, 90],
    [250, 50],
    [100, 33],
    [330, 95],
    [410, 12],
    [475, 44],
    [25, 67],
    [85, 21],
    [220, 88],
    [600, 150]
];

g.xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[0])])
    .range([padding, w - padding*2]);

g.yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[1])])
    .range([h-padding, padding]);

g.rScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[1])])
    .range([2, 5]);

//global
window.scatterplot = function(selector){
    var svg = d3.select(selector).append('svg')
        .attr('width', w)
        .attr('height', h);

    var circle = svg.selectAll('circle')
        .data(dataset);

    circle.enter()
        .append('circle')
        .attr('cx', function(d){
            return xScale(d[0]);
        })
        .attr('cy', function(d){
            return yScale(d[1]);
        })
        .attr('r', function(d){
            return rScale(d[1]);
        });

    return svg;
};
```

산포도 그리기:

<p id="phr-scatterplot-01"></p>

```js
//svg.append('g')
scatterplot('#phr-scatterplot-01').append('g')
    .call(d3.svg.axis()
        .scale(xScale)
        .orient('bottom'));
```

Axis그릴려면 많은 SVG 엘리먼트가 필요한데 그 엘리먼트를 담는 Container 역활엔 Group을 의미하는 `g`가 적합하다:

**bottom에 그렸는데 위에 나온다.ㅎㅎ**

### 8.3 보기 좋게 다듬기.

<p id="phr-scatterplot-02"></p>

```js
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

var svg = scatterplot('#phr-scatterplot-02')
svg.append('g')
    .attr("class", "axis")
    .call(xAxis);

var text = svg.selectAll('text')
    .data(dataset);

text.enter()
    .append('text')
    .text((d)=> d.join(', '))
    .attr('x', (d)=> xScale(d[0]))
    .attr('y', (d)=> yScale(d[1]))
    .attr('font-family', 'sans-serif')
    .attr('font-size', '11px')
    .attr('fill', 'red');
```

```css
.axis path,
.axis line {
    fill: none;
    stroke: black;
    shape-rendering: scrispEdges;
}
.axis text {
    font-family: sans-serif;
    font-size: 11px;
    fill: olive;
}
```

<style>
.axis path,
.axis line {
    fill: none;
    stroke: black;
    shape-rendering: scrispEdges;
}
.axis text {
    font-family: sans-serif;
    font-size: 11px;
    fill: olive;
}
</style>

#### transform

위치를 이동시키자:

<p id="phr-scatterplot-03"></p>

```js
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

var svg = scatterplot('#phr-scatterplot-03')
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${h-padding})`) //translate(0, 280)
    .call(xAxis);

var text = svg.selectAll('text')
    .data(dataset);

text.enter()
    .append('text')
    .text((d)=> d.join(', '))
    .attr('x', (d)=> xScale(d[0]))
    .attr('y', (d)=> yScale(d[1]))
    .attr('font-family', 'sans-serif')
    .attr('font-size', '11px')
    .attr('fill', 'red');
```

### 8.4 눈금 생성 시 확인 사항

7개나 5개 d3가 생성해주는 눈금 개 수는 같다. d3는 `ticks()`로 설정한 눈금 근처로 해서 데이터에 맞는 눈금 개수를 알아서 생성해준다:

<p id="phr-scatterplot-04"></p>

```js
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(7);

var svg = scatterplot('#phr-scatterplot-04')
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(xAxis);

var text = svg.selectAll('text')
    .data(dataset);

text.enter()
    .append('text')
    .text((d)=> d.join(', '))
    .attr('x', (d)=> xScale(d[0]))
    .attr('y', (d)=> yScale(d[1]))
    .attr('font-family', 'sans-serif')
    .attr('font-size', '11px')
    .attr('fill', 'red');
```

<p id="phr-scatterplot-05"></p>

```js
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(5);

var svg = scatterplot('#phr-scatterplot-05')
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(xAxis);

var text = svg.selectAll('text')
    .data(dataset);

text.enter()
    .append('text')
    .text((d)=> d.join(', '))
    .attr('x', (d)=> xScale(d[0]))
    .attr('y', (d)=> yScale(d[1]))
    .attr('font-family', 'sans-serif')
    .attr('font-size', '11px')
    .attr('fill', 'red');
```

### Y축도 만들자

<p id="phr-scatterplot-06"></p>

```js
var padding = 30;

//아래 예제에서 재정의 하기 귀찮으니 글로벌로 선언한다.
var g = window
g.xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(5);

g.yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .ticks(5);

var svg = scatterplot('#phr-scatterplot-06');
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(xAxis);

svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);

var text = svg.selectAll('text')
    .data(dataset);

text.enter()
    .append('text')
    .text((d)=> d.join(', '))
    .attr('x', (d)=> xScale(d[0]))
    .attr('y', (d)=> yScale(d[1]))
    .attr('font-family', 'sans-serif')
    .attr('font-size', '11px')
    .attr('fill', 'red');
```

## 8.6 마지막 손질

<p id="phr-scatterplot-07"></p>

```js
var g = window
g.dataset = [];
var numDataPoints = 50;
var xRange = Math.random() * 1000;
var yRange = Math.random() * 1000;
for( var i = 0; i < numDataPoints; i++){
    var newNumber1 = Math.floor(Math.random() * xRange);
    var newNumber2 = Math.floor(Math.random() * xRange);
    dataset.push([newNumber1, newNumber2]);
}

//데이터가 달라졌으니 Scale도 다시(계속 위 예제의 것을 재사용 함) 만들고
g.xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[0])])
    .range([padding, w - padding*2]);

g.yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[1])])
    .range([h-padding, padding]);

g.rScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[1])])
    .range([2, 5]);

//Scale이 바뀌었으니 Axis도
g.xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(5);

g.yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .ticks(5);

var svg = scatterplot('#phr-scatterplot-07');
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(xAxis);

svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);

var text = svg.selectAll('text')
    .data(dataset);

text.enter()
    .append('text')
    .text((d)=> d.join(', '))
    .attr('x', (d)=> xScale(d[0]))
    .attr('y', (d)=> yScale(d[1]))
    .attr('font-family', 'sans-serif')
    .attr('font-size', '11px')
    .attr('fill', 'red');
```

#### text 제거

<p id="phr-scatterplot-08"></p>

```js
var svg = scatterplot('#phr-scatterplot-08');
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(xAxis);

svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);
```

## 8.7 눈금의 라벨 포매팅

[d3.format](https://github.cm/mbostock/d3/wiki/Formatting#d3_format)

<p id="phr-scatterplot-09"></p>

```js
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(5)
    .tickFormat(d3.format('.1%'));

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .ticks(5)
    .tickFormat(d3.format('03d'));

var svg = scatterplot('#phr-scatterplot-09');
svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(xAxis);

svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);
```
