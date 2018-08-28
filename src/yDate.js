/**
 * @file
 * Date y-axes
 */

import * as d3 from 'd3';
import {
    getAxis,
    convertToPointScale,
    getDefaultYAxisLabel,
    getTimeTickFormat,
    getTimeTicks,
    getTimeTicksMinor,
    setLabelIds,
} from './utils';

export default function () {
    let banding;
    const mindate = new Date(1970, 1, 1);
    const maxdate = new Date(2017, 6, 1);
    let scale = d3
        .scaleTime()
        .domain([mindate, maxdate])
        .range([0, 220]);
    let frameName;
    let intraday = false;
    let interval = 'lustrum';
    let labelWidth = 0;
    let minorAxis = true;
    let plotDim = [220, 100];
    let tickSize = 10;
    let minorTickSize = 5;
    let rem = 10;
    let fullYear = false;
    let align = 'left';
    let yLabel;
    let label;
    let yLabelMinor;
    let endTicks;
    let customFormat = false;
    let tickValues;

    function axis(parent) {
        const plotWidth = plotDim[0];
        const plotHeight = plotDim[1];
        const yAxis = getAxis(align);
        if (intraday) {
            scale = convertToPointScale(scale);
            yAxis
                .tickSize(tickSize)
                .tickFormat(getTimeTickFormat(interval, { fullYear, scale }))
                .scale(scale);
            yAxis.tickValues(
                scale.domain().filter((d, i) => {
                    let checkDate;
                    if (i === 0) {
                        return d.getDay();
                    }
                    if (i > 0) {
                        checkDate = new Date(scale.domain()[i - 1]);
                    }
                    return d.getDay() !== checkDate.getDay();
                }),
            );
        } else {
            yAxis
                .tickSize(tickSize)
                // .ticks(getTicks(interval))
                .tickFormat(getTimeTickFormat(interval, { fullYear, scale }))
                .scale(scale);
            let newTicks = scale.ticks(getTimeTicks(interval));
            const dayCheck = scale.domain()[0].getDate();
            const monthCheck = scale.domain()[0].getMonth();
            if (dayCheck !== 1 && monthCheck !== 0) {
                newTicks.unshift(scale.domain()[0]);
            }
            if (
                interval === 'lustrum' ||
                interval === 'decade' ||
                interval === 'jubilee' ||
                interval === 'century'
            ) {
                newTicks.push(d3.timeYear(scale.domain()[1]));
            }
            if (endTicks) {
                newTicks = scale.domain();
            }
            yAxis.tickValues(newTicks);
        }

        const yMinor = getAxis(align);
        if (intraday) {
            yMinor
                .tickSize(minorTickSize)
                .tickFormat('')
                .scale(scale);
        } else {
            yMinor
                .tickSize(minorTickSize)
                .ticks(getTimeTicksMinor(interval))
                .tickFormat('')
                .scale(scale);
        }

        if (tickValues) {
            yAxis.tickValues(tickValues);
        }

        if (customFormat) {
            yAxis.tickFormat(customFormat);
        }

        const bandHolder = parent.append('g').attr('class', 'highlights');

        yLabel = parent
            .append('g')
            .attr('class', 'axis yAxis axis baseline')
            .call(yAxis);

        // Calculate width of widest .tick text
        yLabel.selectAll('.yAxis text').each(function calcTickTextWidth() {
            labelWidth = Math.max(this.getBBox().width, labelWidth);
        });

        // Use this to amend the tickSIze and re cal the vAxis
        if (tickSize < labelWidth) {
            yLabel.call(yAxis.tickSize);
        } else {
            yLabel.call(yAxis.tickSize(tickSize - labelWidth));
        }

        if (align === 'right') {
            yLabel
                .selectAll('text')
                .attr('transform', `translate(${labelWidth},0)`)
                .style('text-anchor', 'end');
        } else {
            yLabel.selectAll('text').style('text-anchor', 'end');
        }

        if (minorAxis) {
            yLabelMinor = parent
                .append('g')
                .attr('class', () => {
                    const pHeight = d3
                        .select('.chart-plot')
                        .node()
                        .getBBox().height;
                    if (pHeight === tickSize) {
                        return 'axis yAxis';
                    }
                    return 'axis yAxis axis baseline';
                })
                .call(yMinor);
        }

        if (frameName) {
            setLabelIds({ selection: yLabel, axis: 'y', frameName });
            if (minorAxis) {
                yLabelMinor
                    .selectAll('.axis.yAxis line')
                    .attr('id', `${frameName}xTick`);
            }
        }
        if (label) {
            const defaultLabel = getDefaultYAxisLabel(label);

            const axisLabel = parent.append('g').attr('class', 'axis xAxis');

            const getVertical = vert =>
                ({
                    top: plotHeight - plotHeight,
                    middle: plotHeight / 2,
                    bottom: plotHeight,
                }[vert]);

            const calcOffset = () => {
                if (tickSize > 0 && tickSize < rem) {
                    return tickSize / 2;
                }
                return 0;
            };

            // prettier-ignore
            const getHorizontal = (axisAlign, horiAlign) => ({
                leftleft: 0 - (labelWidth + (rem * 0.6)),
                leftmiddle: 0 - (labelWidth / 2) - calcOffset(),
                leftright: rem * 0.7,
                rightleft: plotWidth - labelWidth,
                rightmiddle: plotWidth + (labelWidth / 2) + (rem * 0.5) + calcOffset(),
                rightright: plotWidth + (rem) + calcOffset(),
            }[axisAlign + horiAlign]);

            axisLabel
                .append('text')
                .attr('y', getVertical(defaultLabel.vert))
                .attr('x', getHorizontal(align, defaultLabel.hori))
                .text(defaultLabel.tag);

            // The following doesn't appear to be used anywhere:

            // const text = axisLabel.selectAll('text');
            // const width = (text.node().getBBox().width) / 2;
            // const height = (text.node().getBBox().height) / 2;
            // const textX = text.node().getBBox().x + width;
            // const textY = text.node().getBBox().y + height;
            // text.attr('transform', 'rotate(' + (defaultLabel.rotate) + ', ' + textX + ', ' + textY + ')')
            //     .style('text-anchor', defaultLabel.anchor);
        }

        if (banding) {
            const getBandWidth = (index, bands) => {
                if (index === bands.length - 1) {
                    return plotHeight - scale(bands[index]);
                }
                return scale(bands[index + 1]) - scale(bands[index]);
            };

            const bands = yAxis
                .tickValues()
                .map((d, i, a) => ({
                    date: d,
                    height: getBandWidth(i, a),
                }))
                .filter((d, i) => i % 2 === 0);

            bandHolder
                .selectAll('rect')
                .data(bands)
                .enter()
                .append('rect')
                .attr('x', 0)
                .attr('width', () => {
                    if (align === 'left ') {
                        return plotWidth - labelWidth;
                    }
                    return plotWidth - labelWidth - rem;
                })
                .attr('y', d => scale(d.date))
                .attr('height', d => d.height);
        }

        yLabel.selectAll('.domain').remove();
    }

    axis.align = (d) => {
        align = d;
        return axis;
    };
    axis.banding = (d) => {
        if (d === undefined) return banding;
        banding = d;
        return axis;
    };
    axis.tickFormat = (d) => {
        customFormat = d;
        scale.tickFormat(d);
        return axis;
    };
    axis.endTicks = (d) => {
        if (d === undefined) return endTicks;
        endTicks = d;
        return axis;
    };
    axis.frameName = (d) => {
        if (d === undefined) return frameName;
        frameName = d;
        return axis;
    };
    axis.intraday = (d) => {
        if (d === undefined) return intraday;
        intraday = d;
        return axis;
    };
    axis.label = (d) => {
        if (d === undefined) return label;
        label = d;
        return axis;
    };
    axis.labelWidth = (d) => {
        if (!d) return labelWidth;
        labelWidth = d;
        return axis;
    };
    axis.plotDim = (d) => {
        if (!d) return plotDim;
        plotDim = d;
        return axis;
    };
    axis.scale = (d) => {
        if (!d) return scale;
        scale = d;
        return axis;
    };
    axis.tickValues = (d) => {
        if (!d) return tickValues;
        tickValues = d;
        return axis;
    };
    axis.domain = (d) => {
        scale.domain(d);
        return axis;
    };
    axis.range = (d) => {
        scale.range(d);
        return axis;
    };

    axis.fullYear = (d) => {
        if (d === undefined) return fullYear;
        fullYear = d;
        return axis;
    };
    axis.interval = (d) => {
        interval = d;
        return axis;
    };
    axis.tickSize = (d) => {
        if (!d) return tickSize;
        tickSize = d;
        return axis;
    };
    axis.minorTickSize = (d) => {
        if (!d) return minorTickSize;
        minorTickSize = d;
        return axis;
    };
    axis.minorAxis = (d) => {
        if (d === undefined) return minorAxis;
        minorAxis = d;
        return axis;
    };
    axis.rem = (d) => {
        if (!d) return rem;
        rem = d;
        return axis;
    };
    axis.yLabel = (d) => {
        if (d === undefined) return yLabel;
        yLabel = d;
        return axis;
    };
    axis.yLabelMinor = (d) => {
        if (d === undefined) return yLabelMinor;
        yLabelMinor = d;
        return axis;
    };
    return axis;
}
