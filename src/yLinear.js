/**
 * @file
 * Linear y-axes
 */

import * as d3 from 'd3';
import {
    formatNumber,
    generateBanding,
    generateLabels,
    getAxis,
    getDecimalFormat,
    setLabelIds,
} from './utils';

export default function () {
    let banding;
    let scale = d3
        .scaleLinear()
        .domain([0, 10000])
        .range([120, 0]);
    let align = 'right';
    let divisor = 1;
    let invert = false;
    let labelWidth = 0;
    let logScale = false;
    let numTicks = 5;
    let plotDim = [120, 100];
    let tickSize = 300;
    let yAxisHighlight = 0;
    let yLabel;
    let label;
    let rem = 10;
    let frameName;
    let tickValues;
    let customFormat = false;

    function axis(parent) {
        const deciCheck = false;
        const span = scale.domain()[1] - scale.domain()[0];
        const plotWidth = plotDim[0];
        const plotHeight = plotDim[1];

        if (logScale) {
            const newScale = d3
                .scaleLog()
                .domain(scale.domain())
                .range(scale.range());
            scale = newScale;
        }
        if (invert) {
            const newRange = scale.range().reverse();
            scale.range(newRange);
        }

        const deciFormat = getDecimalFormat(span);
        const numberFormat = d3.format(',');

        const yAxis = getAxis(align)
            .ticks(numTicks)
            .scale(scale)
            .tickFormat(d =>
                formatNumber(d, {
                    divisor,
                    numberFormat,
                    deciFormat,
                    deciCheck,
                    logScale,
                }),
            );

        if (tickValues) {
            yAxis.tickValues(tickValues);
        }

        if (customFormat) {
            yAxis.tickFormat(customFormat);
        }

        yLabel = parent
            .append('g')
            .attr('class', 'axis yAxis')
            .call(yAxis);

        if (!labelWidth && yLabel.node().getBBox) {
            // Calculate width of widest .tick text
            yLabel.selectAll('.yAxis text').each(function calcTickTextWidth() {
                labelWidth = Math.max(this.getBBox().width, labelWidth);
            });
        } else if (!labelWidth) {
            const maxChars = d3.max(
                yLabel.selectAll('.yAxis text').nodes(),
                d => d3.select(d).text().length,
            );

            labelWidth = maxChars * rem;
        }

        // Use this to amend the tickSIze and re cal the vAxis
        if (tickSize < labelWidth) {
            yLabel.call(yAxis.tickSize(tickSize));
        } else {
            yLabel.call(yAxis.tickSize(tickSize - labelWidth));
        }

        if (align === 'right') {
            yLabel
                .selectAll('text')
                .attr('transform', `translate(${Math.round(labelWidth)},0)`);
        }

        if (frameName) {
            setLabelIds({ selection: yLabel, axis: 'y', frameName });
        }

        if (label) {
            generateLabels('y', {
                align,
                label,
                labelWidth,
                parent,
                plotHeight,
                plotWidth,
                rem,
                tickSize,
            });
        }

        if (banding) {
            const getBandWidth = (index, bands) => {
                if (index === 0) {
                    return plotHeight - scale(bands[index]);
                }
                return scale(bands[index - 1]) - scale(bands[index]);
            };

            const bands = (tickValues
                ? yAxis.tickValues()
                : scale.ticks(numTicks)
            )
                .map((d, i, a) => ({
                    pos: d,
                    height: getBandWidth(i, a),
                }))
                .filter((d, i) => i % 2 === 0);

            generateBanding('y', {
                parent,
                bands,
                scale,
                plotWidth,
                labelWidth,
            });
        }

        yLabel
            .selectAll('.tick')
            .filter(d => d === 0 || d === yAxisHighlight)
            .classed('baseline', true);

        yLabel.selectAll('.domain').remove();
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
    axis.plotDim = (d) => {
        if (!d) return plotDim;
        plotDim = d;
        return axis;
    };
    axis.range = (d) => {
        scale.range(d);
        return axis;
    };
    axis.rem = (d) => {
        if (!d) return rem;
        rem = d;
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
    axis.logScale = (d) => {
        if (d === undefined) return logScale;
        logScale = d;
        return axis;
    };
    axis.tickFormat = (d) => {
        customFormat = d;
        scale.tickFormat(d);
        return axis;
    };
    axis.tickSize = (d) => {
        if (!d) return tickSize;
        tickSize = d;
        return axis;
    };
    axis.tickValues = (d) => {
        if (!d) return tickValues;
        tickValues = d;
        return axis;
    };
    axis.yAxisHighlight = (d) => {
        yAxisHighlight = d;
        return axis;
    };
    axis.numTicks = (d) => {
        numTicks = d;
        return axis;
    };
    axis.invert = (d) => {
        if (d === undefined) return invert;
        invert = d;
        return axis;
    };
    axis.yLabel = (d) => {
        if (d === undefined) return yLabel;
        yLabel = d;
        return axis;
    };
    return axis;
}
