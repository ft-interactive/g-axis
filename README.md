# gAxis

Pre styled centralised repository of axis for use with the FT's g-chartframe architecture as part of the Visual Vocabulary. Creates ordinal, linear or date axis that can be appended to the .plot obejct in the g-chartframe hopefully eliminating the need to code another standard axis or set up the tick format for a date sequence.

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
import * as gAxis from 'g-axis';

```

### NPM install
Not yet deployed

## Getting started

<b>Note</b> All examples shown are from the web frame style

Always create and call a y-axis first, as it returms <b>.yLable()</b> that holds a value equal to the width of the widest tick label. This value is used to re-define the left or right margin of the chartframe before defining the <b>.domain()</b> of the x-axis e.g.

yOrdinal axis where the width of 'Switzerland' is returned in <b>.yLable</b>
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLabel-large.png)

'Dem Republic of Congo' leave less space for the x-axis <b>.domain()</b>
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLabel-small.png)



The following axis types are currently defined in theis repo

Go to section

* [xDate](#-xdate)
* xLinear()
* xOrdinal()
* yLinear()
* yOrdinal()

# xDate

<b>Note</b> Your y-axis of choice should be created and appended to the current frame before attaching an x-axis as the size of the y-axis tick text should be used to determine the .domain() of the new x-axis

Add the following code to your index.js to append a default xDate() axis to the current frame (grey here but is not normally visible). <b>Note</b> that <b>.tickSize()</b> is included although not vital to create the axis. No positioning has been applied. The minor axis is visible as the default setting for <b>.minorAxis() </b>is true.

```
const xAxis = gAxis.xDate();

xAxis
	.tickSize(currentFrame.rem()*.75)
	.minorTickSize(currentFrame.rem()*.3)

currentFrame.plot()
	.call(xAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-default.png)

## Postioning

To position the axis in the frame add the following code after the axis has been called. This will place the axis at correctly at eithr the top or bottom depending on the <b>.align()</b> setter, bottom by default.

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

## xDate API reference

#myAxis<b>.domain([Array])</b> defines the axis domain in the same way as you would when creating a normal d3.scaleTime(). If no <b>.domain()</b> is defined the default is [Jan 01 1970,Jun 01 2017]

#myAxis<b>.range([Array])</b> defines the axis  range in the same way as you would when creating a normal d3.scaleLinear(). If no <b>.range()</b> is defined the default is [0,220])

#myAxis<b>.fullYear([boolean])</b> used on charts where <b>interval('year')</b>is used and forces the notation into a full year i.e 1977 instead of 77

#myAxis<b>.interval([String])</b> Defines the tick interval on the axis (see examples). By default this is set to "lustrum" meaning every five years. It can be set to:
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

 #myAxis<b>.tickSize([number])</b> used on charts where <b>interval('year')< is used and forces the notation into a full year i.e 1977 instead of 77




## xLinear

## xOrdinal

## yLinear

## yOrdinal


