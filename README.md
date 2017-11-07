# gAxis [![codecov](https://codecov.io/gh/ft-interactive/g-axis/branch/master/graph/badge.svg)](https://codecov.io/gh/ft-interactive/g-axis)

Pre styled centralised repository of axis for use with the FT's g-chartframe architecture as part of the Visual Vocabulary. Creates ordinal, linear or date axis that can be appended to the .plot obejct in the g-chartframe hopefully eliminating the need to code another standard axis or set up the tick format for a date sequence.

The axis module also appends the correct script tags for use with the FT Pre-Flight script in Adobe Illustrator.

Will also work with other builds where the axis is called into an svg.

### Prerequisites
The FT axis styles---add the folowwing link in your index file header

``` html
<link rel="stylesheet" href="//rawgit.com/ft-interactive/visual-vocabulary-templates/master/styles.css">
```
The [d3 library](https://d3js.org/) is already installed in the build

### Manual installation

If you are working within the g-chartfram architecture add the following code to the top of your index.js


```
import * as gAxis from 'g-axis
```

### NPM install
Not yet deployed

## Getting started

<b>Notes</b> All examples shown are from the web frame style. Always create and call a y-axis first, as it returms <b>.labelWidth()</b> that holds a value equal to the width of the widest tick label on the y-axis. This value is used to re-define the left or right margin of the chartframe before defining the <b>.domain()</b> of the x-axis e.g.

yOrdinal axis where the width of 'Switzerland' is returned in <b>.labelWidth</b>
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLabel-large.png)
The tick 'Dem Republic of Congo'is much longer so will leave less space for the x-axis <b>.domain()</b>
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLabel-small.png)

For more detail on <b>.labelWidth()</b> and its use in positioning see:

* [yLinear Postioning](#ylinpos)

The following axis types are currently defined in this repo (click to jump to section)

* [yLinear](#ylinear)
* yOrdinal()
* [xDate](#xdate)
* xLinear()
* xOrdinal()

# <a id='ylinear'>yLinear</a>

<b>Note</b> All examples shown are from the web frame style.
yLinear() creates a d3 linear axis with a couple of additional feature to help manage styling and day-to-day production of charts that use a linear y-axis

* <b>.align()</b> allows the axis to be aligned to either the left or right hand side of the chart. 
* <b>.invert()</b> is used to invert the scale. <b>
* ,b>.logScale()</b> for when a log scale is needed.

## Getting started
Add the following code to your index.js to append a default y-axis to the current frame object (grey here but is not normally visible)

```
const yAxis = gAxis.yLinear()
const currentFrame = frame[frameName];

currentFrame.plot()
    .call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-default.png)

Use the current frame dimensions to define your <b>.range()</b> and the <b>.ticksize()</b> and a <b>.domian()</b>
```
const yAxis = gAxis.yLinear()
const currentFrame = frame[frameName];

 yAxis
    .domain([0,200])
    .range([currentFrame.dimension().height,0])
    .tickSize(currentFrame.dimension().width)

currentFrame.plot()
    .call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-sized.png)

### <a id='ylinpos'>Positioning</a>
The rendered axis returns the width of the widest text label on the y- axis via <b>.labelWidth()</b>. this will vary depending on the text e.g. '100,000' will return a larger value than '10'
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-labelwidth.png))

<b>.labelWidth()</b> is used to amend the appropriate margin of the current frame so that tick text is positioned outside it. The following code when added to you index.js file after the y-axis has been called will resize the margin depending on the <b>.align()</b> setting which is 'right' by default.
```
if (align == 'right' ){
            let newMargin = yAxis.labelWidth()+currentFrame.margin().right
            //Use newMargin redefine the new margin and range of xAxis
            currentFrame.margin({right:newMargin});
            //yAxis.yLabel().attr('transform', `translate(${currentFrame.dimension().width},0)`);
        }
        if (align == 'left' ){
            let newMargin = yAxis.labelWidth()+currentFrame.margin().left
            //Use newMargin redefine the new margin and range of xAxis
            currentFrame.margin({left:newMargin});
            yAxis.yLabel().attr('transform', `translate(${(yAxis.tickSize()-yAxis.labelWidth())},0)`);
        }
        d3.select(currentFrame.plot().node().parentNode)
            .call(currentFrame);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-resized.png)

The current frame can then still be used to correctly define the <b>.range()</b> values of an x-axis.

## <a id='ylinearapi'>yLinear API reference</a>

myAxis<b>.align([String])</b> "right" or "left". Determines the alignment of the tick text set as "right" by default. [example](#ylinleft)

myAxis<b>.domain([Array])</b> defines the axis domain in the same way as you would when creating a normal d3.scaleLinear(). If no <b>.domain()</b> is defined the default is [0,10000]

myAxis<b>.invert([boolean])</b> Inverts the scale so that the lowest figures are nearer the top and the highest figures are nearer the bottom [example](#ylinhighlight)

myAxis<b>.labelWidth([Number])</b> used to return the width of the text on the axis tick. Will vary depending on tick e.g. a label of '1,000,000' will be wider than a label of '10' and will return a higher value. See [yLinear Postioning](#ylinpos)

myAxis<b>.numTicks([Number])</b> as they name suggest defines how many ticks are on the axis. 0 to 100 with 3 tick would give a zero line, a fifty line and a hundred line.If not enough ticks have been specifiesd d3 will automatically increase the number. [example](#ylinnumticks)

myAxis<b>.range([Array])</b> defines the axis  range in the same way as you would when creating a normal d3.scaleLinear(). If no <b>.range()</b> is defined the default is [120,0])

myAxis<b>.yAxishighlight([Number])</b>Changes the style of the tick specified from the normal dotted 'axis' style to the solid 'baseline'. Mostly used on index charts where the 100 line should be highlighted of the minimum tick value goes below zero [example](#ylinhighlight)

## yLinear Examples
### <a id='ylinleft'>Left hand axis</a>
```
 myYAxis
    .domain([0,200])
    .range([currentFrame.dimension().height,0])
    .tickSize(currentFrame.dimension().width)
    .align('left')

currentFrame.plot()
    .call(myYAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-left.png)

### <a id='ylinnumticks'>Number of ticks</a>
Zero to 100 with 6 tick, making increments of every 20
```
myYAxis
    .range([currentFrame.dimension().height,0])
    .domain([0,200])
    .tickSize(currentFrame.dimension().width)
    .numTicks(6)

currentFrame.plot()
    .call(myYAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-numticks.png)

### <a id='ylinhighlight'>yAxisHighlight</a>
-50 to 200 with 150 highlighted as this is the base line. Zero automatically highlights
```
yAxis
    .domain([-50,200])
    .range([currentFrame.dimension().height,0])
    .align(align)
    .tickSize(currentFrame.dimension().width)
    .yAxisHighlight(-50);

currentFrame.plot()
    .call(myYAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-highlight.png)

### <a id='ylininvert'>Inverted scale</a>
200 down to zero. 200 line highlighted

```
yAxis
    .domain([0,200])
    .range([currentFrame.dimension().height,0])
    .tickSize(currentFrame.dimension().width)
    .yAxisHighlight(200)
    .invert(true);

currentFrame.plot()
    .call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-invert.png)



# <a id='xdate'>xDate</a>

<b>Note</b> Your y-axis of choice should be created and appended to the current frame before attaching an x-axis as the size of the y-axis tick text should be used to determine the .domain() of the new x-axis

Add the following code to your index.js to append a default xDate() axis to the current frame (grey here but is not normally visible). <b>Note</b> that <b>.tickSize()</b> is included although not vital to create the axis. No positioning has been applied. The minor axis is visible as the default setting for <b>.minorAxis() </b>is true.

```
const xAxis = gAxis.xDate();
const currentFrame = frame[frameName];

xAxis
	.tickSize(currentFrame.rem()*.75)
	.minorTickSize(currentFrame.rem()*.3)

currentFrame.plot()
	.call(xAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-default.png)

### Postioning

To position the axis in the frame add the following code after the axis has been called. This will place the axis correctly at eithr the top or bottom depending on the <b>.align()</b> setter, bottom by default. If full height ticks length are defined then this code will need to be re-calculated, see examples

```
if (align == 'bottom' ){
    myXAxis.xLabel().attr('transform', `translate(0,${currentFrame.dimension().height})`);
    if(minorAxis) {
        myXAxis.xLabelMinor().attr('transform', `translate(0,${currentFrame.dimension().height})`);
    }
}
if (align == 'top' ){
    myXAxis.xLabel().attr('transform', `translate(0,${myXAxis.tickSize()})`);
}
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-default-bottom.png)
You can now use the <b>.align()</b> to position the axis at the top or the bottom of the fram, see API reference

### xDate API reference

#xAxis<b>.domain([Array])</b> defines the axis domain in the same way as you would when creating a normal d3.scaleTime(). If no <b>.domain()</b> is defined the default is [Jan 01 1970,Jun 01 2017]

#xAxis<b>.range([Array])</b> defines the axis  range in the same way as you would when creating a normal d3.scaleLinear(). If no <b>.range()</b> is defined the default is [0,220])

#xAxis<b>.fullYear([boolean])</b> used on charts where <b>interval('year')</b>is used and forces the notation into a full year i.e 1977 instead of 77

#xAxis<b>.interval([String])</b> Defines the tick interval on the axis (see examples). By default this is set to "lustrum" meaning every five years. It can be set to:
 * "century" -- every one hundred years
 * "jubilee" -- every fifty years
 * "decade" -- every ten years
 * "lustrum" -- every five years
 * "years" -- every year
 * "quarters" -- every 3 months (Q1, Q2, Q3 etc, although the data still nees to be a valid date)
 * "months" -- every month
 * "weeks" -- every week
 * "days" -- every day

The interval of the ticks will also effect the tick formatting, which will default to the following:
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-tick-format.png)

#xAxis<b>.tickSize([Number])</b> Defines the size of the ticks. Usually set to <b>.rem()</b> *.75 for the major ticks. When full height ticks are required some adjustment will be needed to the positioning of the axis, see examples

#xAxis<b>.minorTickSize([String])</b> Defines the size of the minor ticks. Usually set to <b>.rem()</b>*.3. When full height ticks are required some adjustment will be needed to the positioning of the axis
<b>Note</b> When the height of the current frame is equal to the <b>.minorTickSize()</b> then the minor tick will change 'axis' and not 'baseline' resulting in the dotted tick lines

#xAxis<b>.minorTickSize([Boolean])</b> Set to true by default this determines if the minor axis is displayed or not

#xAxis<b>.xlabel()</b> Returns an accessor to allow the axis ticks to have changes made to their style

#xAxis<b>.xabel()</b> Returns an accessor to allow the axis ticks to have changes made to their style

## xDate Examples
### Yearly

From Jan 1 2005 to June 1 2017, with each year labeled and no minor axis. Full years are turned off by default
```
const xAxis = xaxisDate();//sets up yAxis
const currentFrame = frame[frameName];

let mindate = new Date(2005,1,1);
let maxdate = new Date(2017,6,1);

myXAxis
	.domain([mindate,maxdate])
	.range([0,currentFrame.dimension().width])
	.interval("years")
	.minorAxis(false)

currentFrame.plot()
    .call(myXAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-yearly.png)

### Every ten years

From Jan 1 1940 to June 1 2017, with every ten years labeled and a minor axis
```
const xAxis = xaxisDate();//sets up yAxis
const currentFrame = frame[frameName];

let mindate = new Date(1940,1,1);
let maxdate = new Date(2017,6,1);

myXAxis
	.domain([mindate,maxdate])
	.range([0,currentFrame.dimension().width])
	.interval("decade")
	.minorAxis(true)
	.tickSize(currentFrame.rem()*.75)
	.minorTickSize(currentFrame.rem()*.3)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-decades.png)

### Every five years

From Jan 1 1986 to June 1 2017, with every five years labeled and a minor axis
```
const xAxis = xaxisDate();//sets up yAxis
const currentFrame = frame[frameName];

let mindate = new Date(1986,1,1);
let maxdate = new Date(2017,6,1);

myXAxis
	.domain([mindate,maxdate])
	.range([0,currentFrame.dimension().width])
	.interval("lustrun")
	.minorAxis(true)
	.tickSize(currentFrame.rem()*.75)
	.minorTickSize(currentFrame.rem()*.3)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-lustrum.png)

### Every month
From Jun 1 1991 to Feb 1 2000, with month years labeled and no minor axis
```
const xAxis = xaxisDate();//sets up yAxis
const currentFrame = frame[frameName];

let mindate = new Date(1999,6,1);
let maxdate = new Date(2000,2,1);

myXAxis
	.domain([mindate,maxdate])
	.range([0,currentFrame.dimension().width])
	.interval("months")
	.minorAxis(false)
	.tickSize(currentFrame.rem()*.75)
	.minorTickSize(currentFrame.rem()*.3)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-months.png)

## <a id='ylinear'>yLinear</a>

## xOrdinal

## yLinear

## yOrdinal


