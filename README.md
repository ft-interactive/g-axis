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

The following axis types are vurrently defined in theis repo

Go to section

* [xDate](# xdate)
* xLinear()
* xOrdinal()
* yLinear()
* yOrdinal()

# xDate

<b>Note</b> Your y-axis of choice should be created and appended to the current frame before attaching an x-axis as the size of the y-axis tick text should be used to determine the .domain() of the new x-axis

Add the following code to your index.js to append a default xDate() axis to the current frame (grey here but is not normally visible). <b>Note</b> that <b>.tickSize()</b> is included although not vital to create the axis

```
const xAxis = gAxis.xDate();

xAxis
	.tickSize(currentFrame.rem()/.75)
	.minorTickSize(currentFrame.rem()/.3)

currentFrame.plot()
	.call(xAxis);
```

![alt tag](https://github.com/ft-interactive/g-axise/blob/master/images/xDate-default.png)


## xLinear

## xOrdinal

## yLinear

## yOrdinal


