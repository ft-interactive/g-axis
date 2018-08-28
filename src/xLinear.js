/**
 * @file
 * Linear x-axes
 */

import * as d3 from 'd3';
import { getDecimalFormat, getAxis } from './utils';

export default function () {
    let banding;
    let scale = d3
        .scaleLinear()
        .domain([0, 100])
        .range([0, 220]);
    let tickSize = 50;
    let numTicks = 5;
    let align = 'bottom';
    let divisor = 1;
    let invert = false;
    let logScale = false;
    let xAxisHighlight = 0;
    let xLabel;
    let label;
    let plotDim = [200, 100];
    let rem = 10;
    let frameName;
    let tickValues;
    let customFormat = false;

    function axis(parent) {
        let deciCheck = false;
        const span = scale.domain()[1] - scale.domain()[0];
        const plotWidth = plotDim[0];
        const plotHeight = plotDim[1];

        if (invert) {
            const newRange = scale.range().reverse();
            scale.range(newRange);
        }
        if (logScale) {
            const newScale = d3
                .scaleLog()
                .domain(scale.domain())
                .range(scale.range());
            scale = newScale;
        }

        const deciFormat = getDecimalFormat(span);
        const numberFormat = d3.format(',');

        const xAxis = getAxis(align)
            .tickSize(tickSize)
            .ticks(numTicks)
            .scale(scale)
            .tickFormat(formatNumber);

        function formatNumber(d) {
            const checkDecimal = Number.isInteger(d / divisor);
            if (checkDecimal === false) {
                deciCheck = true;
            }
            if (d / divisor === 0) {
                return numberFormat(d / divisor);
            }
            if (logScale) {
                return numberFormat(d / divisor);
            }
            if (deciCheck) {
                return deciFormat(d / divisor);
            }
            return numberFormat(d / divisor);
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
            .attr('class', 'axis xAxis')
            .call(xAxis);

        xLabel
            .selectAll('.tick')
            .filter(d => d === 0 || d === xAxisHighlight)
            .classed('baseline', true);

        if (frameName) {
            xLabel
                .selectAll('.axis.xAxis text')
                .attr('id', `${frameName}xLabel`);
            xLabel
                .selectAll('.axis.xAxis line')
                .attr('id', `${frameName}xTick`);
        }

        if (label) {
            const defaultLabel = {
                tag: label.tag,
                hori: label.hori || 'middle',
                vert: label.vert || 'bottom',
                anchor: label.anchor || 'middle',
                rotate: label.rotate || 0,
            };

            const axisLabel = parent.append('g').attr('class', 'axis xAxis');

            const calcOffset = () => {
                if (tickSize > 0 && tickSize < rem) {
                    return tickSize + (rem * 0.8); // prettier-ignore
                }
                return (rem * 0.9); // prettier-ignore
            };

            const getVertical = (axisAlign, vertAlign) =>
                ({
                    toptop: 0 - rem,
                    topmiddle: 0,
                    topbottom: 0 + rem,
                    bottomtop: plotHeight,
                    bottommiddle: plotHeight + calcOffset(),
                    bottombottom: plotHeight + calcOffset() + (rem * 1.1), // prettier-ignore
                }[axisAlign + vertAlign]);

            const getHorizontal = hori =>
                ({
                    left: plotWidth - plotWidth,
                    middle: plotWidth / 2,
                    right: plotWidth,
                }[hori]);

            axisLabel
                .append('text')
                .attr('y', getVertical(align, defaultLabel.vert))
                .attr('x', getHorizontal(defaultLabel.hori))
                .text(defaultLabel.tag);

            const text = axisLabel.selectAll('text');
            const width = text.node().getBBox().width / 2;
            const height = text.node().getBBox().height / 2;
            const textX = text.node().getBBox().x + width;
            const textY = text.node().getBBox().y + height;
            text.attr(
                'transform',
                `rotate(${defaultLabel.rotate}, ${textX}, ${textY})`,
            ).style('text-anchor', defaultLabel.anchor);
        }

        if (banding) {
            const getBandWidth = (index, bands) => {
                if (index === bands.length - 1) {
                    return plotWidth - scale(bands[index]);
                }
                return scale(bands[index + 1]) - scale(bands[index]);
            };

            const bands = (tickValues
                ? xAxis.tickValues()
                : scale.ticks(numTicks)
            )
                .map((d, i, a) => ({
                    pos: d,
                    width: getBandWidth(i, a),
                }))
                .filter((d, i) => i % 2 === 0);

            bandHolder
                .selectAll('rect')
                .data(bands)
                .enter()
                .append('rect')
                .attr('y', 0)
                .attr('height', plotHeight)
                .attr('x', d => scale(d.pos))
                .attr('width', d => d.width);
        }

        xLabel
            .selectAll('.tick')
            .filter(d => d === 0 || d === xAxisHighlight)
            .classed('baseline', true);

        xLabel.selectAll('.domain').remove();
    }

    axis.align = (d) => {
        if (!d) return align;
        align = d;
        return axis;
    };
    axis.banding = (d) => {
        if (d === undefined) return banding;
        banding = d;
        return axis;
    };
    axis.frameName = (d) => {
        if (!d) return frameName;
        frameName = d;
        return axis;
    };
    axis.invert = (d) => {
        if (d === undefined) return invert;
        invert = d;
        return axis;
    };
    axis.scale = (d) => {
        if (!d) return scale;
        scale = d;
        return axis;
    };
    axis.divisor = (d) => {
        if (!d) return divisor;
        divisor = d;
        return axis;
    };
    axis.domain = (d) => {
        scale.domain(d);
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
    axis.tickValues = (d) => {
        if (!d) return tickValues;
        tickValues = d;
        return axis;
    };
    axis.logScale = (d) => {
        if (d === undefined) return logScale;
        logScale = d;
        return axis;
    };
    axis.range = (d) => {
        scale.range(d);
        return axis;
    };
    axis.tickFormat = (d) => {
        customFormat = d;
        scale.tickFormat(d);
        return axis;
    };
    axis.tickSize = (d) => {
        if (d === undefined) return tickSize;
        tickSize = d;
        return axis;
    };
    axis.xLabel = (d) => {
        if (d === undefined) return xLabel;
        xLabel = d;
        return axis;
    };
    axis.numTicks = (d) => {
        if (d === undefined) return numTicks;
        numTicks = d;
        return axis;
    };
    axis.xAxisHighlight = (d) => {
        xAxisHighlight = d;
        return axis;
    };

    return axis;
}
