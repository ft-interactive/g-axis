/**
 * @file
 * Date x-axes
 */

import * as d3 from 'd3';
import {
    convertToPointScale,
    generateDateTickValues,
    generateLabels,
    getAxis,
    getBandWidth,
    getTimeTickFormat,
    getTimeTicksMinor,
    setLabelIds,
} from './utils';

export default function xaxisDate() {
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
    let minorAxis = true;
    let tickSize = 10;
    let minorTickSize = 5;
    let fullYear = false;
    let align = 'bottom';
    let label;
    let plotDim = [200, 100];
    let xLabel;
    let xLabelMinor;
    let rem = 10;
    let endTicks;
    let customFormat = false;
    let tickValues;

    function axis(parent) {
        const plotWidth = plotDim[0];
        const plotHeight = plotDim[1];
        const xAxis = getAxis(align);

        if (intraday) {
            scale = convertToPointScale(scale);
        }

        xAxis
            .tickSize(tickSize)
            .tickFormat(getTimeTickFormat(interval, { fullYear, scale }))
            .scale(scale)
            .tickValues(
                generateDateTickValues({
                    intraday,
                    scale,
                    interval,
                    endTicks,
                }),
            );

        const xMinor = getAxis(align)
            .tickSize(minorTickSize)
            .tickFormat('')
            .scale(scale);

        if (!intraday) {
            xMinor.ticks(getTimeTicksMinor(interval));
        }

        if (tickValues) {
            xAxis.tickValues(tickValues);
        }

        if (customFormat) {
            xAxis.tickFormat(customFormat);
        }

        const bandHolder = parent.append('g').attr('class', 'highlights');

        xLabel = parent
            .append('g')
            .attr('class', 'axis xAxis axis baseline')
            .call(xAxis);

        if (minorAxis) {
            xLabelMinor = parent
                .append('g')
                .attr('class', () => {
                    if (plotHeight === tickSize) {
                        return 'axis xAxis';
                    }
                    return 'axis xAxis axis baseline';
                })
                .call(xMinor);
        }

        if (frameName) {
            setLabelIds({ selection: xLabel, axis: 'x', frameName });
            if (minorAxis) {
                xLabelMinor
                    .selectAll('.axis.xAxis line')
                    .attr('id', `${frameName}xTick`);
            }
        }

        if (label) {
            generateLabels('x', {
                align,
                label,
                parent,
                plotHeight,
                plotWidth,
                rem,
                tickSize,
            });
        }
        if (banding) {
            let bands = xAxis.tickValues();

            bands = bands
                .map((d, i) => ({
                    date: d,
                    width: getBandWidth({ index: i, bands, plotWidth, scale }),
                }))
                .filter((d, i) => i % 2 === 0);

            // console.log('bands', bands);

            bandHolder
                .selectAll('rect')
                .data(bands)
                .enter()
                .append('rect')
                .attr('y', 0)
                .attr('height', plotHeight)
                .attr('x', d => scale(d.date))
                .attr('width', d => d.width);
        }

        xLabel.selectAll('.domain').remove();
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
    axis.endTicks = (d) => {
        if (d === undefined) return endTicks;
        endTicks = d;
        return axis;
    };
    axis.label = (d) => {
        if (d === undefined) return label;
        label = d;
        return axis;
    };
    axis.plotDim = (d) => {
        if (!d) return plotDim;
        plotDim = d;
        return axis;
    };
    axis.rem = (d) => {
        if (!d) return rem;
        rem = d;
        return axis;
    };
    axis.tickFormat = (d) => {
        customFormat = d;
        scale.tickFormat(d);
        return axis;
    };
    axis.tickValues = (d) => {
        if (!d) return tickValues;
        tickValues = d;
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
    axis.scale = (d) => {
        if (!d) return scale;
        scale = d;
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
    axis.xLabel = (d) => {
        if (d === undefined) return xLabel;
        xLabel = d;
        return axis;
    };
    axis.xLabelMinor = (d) => {
        if (d === undefined) return xLabelMinor;
        xLabelMinor = d;
        return axis;
    };
    return axis;
}
