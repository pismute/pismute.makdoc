# d3js: chapter 7. scale

> 이 글은 http://infovis.kr 스터디 하면서 작성했고 [d3.js](http://www.aladin.co.kr/shop/wproduct.aspx?ISBN=896626106X) 7장의 내용이다.

> 척도(scale)는 입력되는 정의역(domain)과 출력되는 치역(range)을 매핑한 함수를 말한다.- Mike Bostock

- 척도는 함수다.
- 이 장에서는 [Linear Scale](https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear)만 다룬다.

## 7.5 산포도에 척도

<p id="phr-scatterplot-01"></p>


```js-run-d3
var w = 500;
var h = 100;

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

var svg = d3.select('#phr-scatterplot-01').append('svg')
    .attr('width', w)
    .attr('height', h);

var circle = svg.selectAll('circle')
    .data(dataset);

circle.enter()
    .append('circle')
    .attr('cx', (d)=> d[0])
    .attr('cy', (d)=> d[1])
    .attr('r', (d)=> Math.sqrt(h-d[1]))

var text = svg.selectAll('text')
    .data(dataset);

text.enter()
    .append('text')
    .text((d)=> d.join(', '))
    .attr('x', (d)=> d[0])
    .attr('y', (d)=> d[1])
    .attr('font-family', 'sans-serif')
    .attr('font-size', '11px')
    .attr('fill', 'red');
```

### 7.5.2 동적인 척도 만들기.

<p id="phr-scatterplot-02"></p>

```js-run-d3
var w = 500;
var h = 100;

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

//정적 스케일
var xScale = d3.scale.linear()
    .domain([0, 500])
    .range([0,w]);

var yScale = d3.scale.linear()
    .domain([0, 100])
    .range([0,h]);

//동적 스케일
var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[0])]) // d = [5, 20], ...
    .range([0,w]);

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[1])]) // d = [5, 20], ...
    .range([0,h]);

var svg = d3.select('#phr-scatterplot-02').append('svg')
    .attr('width', w)
    .attr('height', h);

var circle = svg.selectAll('circle')
    .data(dataset);

circle.enter()
    .append('circle')
    .attr('cx', (d)=> xScale(d[0]))
    .attr('cy', (d)=> yScale(d[1]))
    .attr('r', (d)=> Math.sqrt(h-d[1]));

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

### 7.5.4 가공하기

#### y축 바꾸기:

<p id="phr-scatterplot-03"></p>

```js-run-d3
var w = 500;
var h = 100;

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

//동적 스케일
var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[0])]) // d = [5, 20], ...
    .range([0,w]);

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[1])]) // d = [5, 20], ...
    .range([h,0]); //요걸 바꿔 본 것임

var svg = d3.select('#phr-scatterplot-03').append('svg')
    .attr('width', w)
    .attr('height', h);

var circle = svg.selectAll('circle')
    .data(dataset);

circle.enter()
    .append('circle')
    .attr('cx', (d)=> xScale(d[0]))
    .attr('cy', (d)=> yScale(d[1]))
    .attr('r', (d)=> Math.sqrt(h-d[1]));

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

#### padding 넣기:

<p id="phr-scatterplot-04"></p>

```js-run-d3
var w = 500;
var h = 100;

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

//////요기
var padding = 20;

var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[0])])
    .range([padding, w - padding*2]); //////요기

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[1])])
    .range([h-padding, padding]); //////요기

var svg = d3.select('#phr-scatterplot-04').append('svg')
    .attr('width', w)
    .attr('height', h);

var circle = svg.selectAll('circle')
    .data(dataset);

circle.enter()
    .append('circle')
    .attr('cx', (d)=> xScale(d[0]))
    .attr('cy', (d)=> yScale(d[1]))
    .attr('r', (d)=> Math.sqrt(h-d[1]));

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

[Mike Bostock's Margin Convention](http://bl.ocks.org/mbostock/3019563)을 보면 margin 코딩 패턴을 소개하고 있다.

#### 반지름도 스케일 적용:

<p id="phr-scatterplot-05"></p>

```js-run-d3
var w = 500;
var h = 100;

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

var padding = 20;

var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[0])])
    .range([padding, w - padding*2]);

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[1])])
    .range([h-padding, padding]);

//////반지름용 scale
var rScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[1])])
    .range([2, 5]);

var svg = d3.select('#phr-scatterplot-05').append('svg')
    .attr('width', w)
    .attr('height', h);

var circle = svg.selectAll('circle')
    .data(dataset);

circle.enter()
    .append('circle')
    .attr('cx', (d)=> xScale(d[0]))
    .attr('cy', (d)=> yScale(d[1]))
    .attr('r', (d)=> rScale(d[1])); //요기

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

#### 큰 데이터 추가:

<p id="phr-scatterplot-06"></p>

```js-run-d3
var w = 500;
var h = 100;

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
    [220, 88],
    [600, 150] //요거 추가.
];

var padding = 20;

var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[0])])
    .range([padding, w - padding*2]);

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[1])])
    .range([h-padding, padding]);

var rScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[1])])
    .range([2, 5]);

var svg = d3.select('#phr-scatterplot-06').append('svg')
    .attr('width', w)
    .attr('height', h);

var circle = svg.selectAll('circle')
    .data(dataset);

circle.enter()
    .append('circle')
    .attr('cx', (d)=> xScale(d[0]))
    .attr('cy', (d)=> yScale(d[1]))
    .attr('r', (d)=> rScale(d[1]));

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

#### h를 100에서 300으로:

<p id="phr-scatterplot-07"></p>

```js-run-d3
var w = 500;
var h = 300;

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
    [220, 88],
    [600, 150] //요거 추가.
];

var padding = 20;

var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[0])])
    .range([padding, w - padding*2]);

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[1])])
    .range([h-padding, padding]);

var rScale = d3.scale.linear()
    .domain([0, d3.max(dataset, (d)=> d[1])])
    .range([2, 5]);

var svg = d3.select('#phr-scatterplot-07').append('svg')
    .attr('width', w)
    .attr('height', h);

var circle = svg.selectAll('circle')
    .data(dataset);

circle.enter()
    .append('circle')
    .attr('cx', (d)=> xScale(d[0]))
    .attr('cy', (d)=> yScale(d[1]))
    .attr('r', (d)=> rScale(d[1]));

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

### 기타 척도 메소드

#### Linear

##### [nice()](https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear_nice)

정의역 반올림.

**scale(0)**:<p id="nice-01"></p>
**scale(0.123)**:<p id="nice-02"></p>
**scale(4.567)**:<p id="nice-03"></p>

```js-run-d3
var scale = d3.scale.linear()
    .domain([0.123, 4.567])
    .range([0, 500])
    .nice();

$('#nice-01').text(scale(0));
$('#nice-02').text(scale(0.123));
$('#nice-03').text(scale(4.567));
```

##### [rangeRound()](http://bit.ly/Z2ZLke)

> 안티에일리어싱(antialiasing)으로 발생할 수 있는 뿌연 경계선이 없는, 정확한 픽셀 값을 갖는 도형을 그릴 때 유용하다. - p151

치역 반올림.

**scale(0)**:<p id="range-round-01"></p>
**scale(0.123)**:<p id="range-round-02"></p>
**scale(4.567)**:<p id="range-round-03"></p>

```js-run-d3
var scale = d3.scale.linear()
    .domain([0.123, 4.567])
    .rangeRound([0, 500])
    .nice();

$('#range-round-01').text(scale(0));
$('#range-round-02').text(scale(0.123));
$('#range-round-03').text(scale(4.567));
```

##### [clamp()](http://bit.ly/12h7uTf)

기본적으로 d3는 치역 밖에 값도 반환해주지만, 정의한 치역 범위를 벗어나는 경우 치역의 최소값과 최대값 중 하나를 반환한다.

**scale(10)**:<p id="clamp-01"></p>

```js-run-d3
var scale = d3.scale.linear()
    .domain([0.123, 4.567])
    .range([0, 500]);

$('#clamp-01').text(scale(10));
```

**scale(10)**:<p id="clamp-02"></p>

```js-run-d3
var scale = d3.scale.linear()
    .domain([0.123, 4.567])
    .range([0, 500])
    .clamp(true);

$('#clamp-02').text(scale(10));
```

## 7.8 다른 종류의 척도

다른 척도로 이런게 있는데, 언젠가 업데이트를....

#### [sqrt](https://github.com/mbostock/d3/wiki/Quantitative-Scales#sqrt)
#### [pow](https://github.com/mbostock/d3/wiki/Quantitative-Scales#pow)
#### [log](https://github.com/mbostock/d3/wiki/Quantitative-Scales#log-scales)
#### [quantize](https://github.com/mbostock/d3/wiki/Quantitative-Scales#quantize-scales)
#### [quantile](https://github.com/mbostock/d3/wiki/Quantitative-Scales#quantile-scales)
#### [ordinal](https://github.com/mbostock/d3/wiki/Ordinal-Scales)
##### [d4.scale.category10](https://github.com/mbostock/d3/wiki/Ordinal-Scales#category10)
##### [d4.scale.category20](https://github.com/mbostock/d3/wiki/Ordinal-Scales#category20)
##### [d4.scale.category20b](https://github.com/mbostock/d3/wiki/Ordinal-Scales#category20b)
##### [d4.scale.category20c](https://github.com/mbostock/d3/wiki/Ordinal-Scales#category20c)
#### [d3.time.scale()](https://github.com/mbostock/d3/wiki/Time-Scales)
