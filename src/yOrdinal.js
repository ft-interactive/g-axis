/**
 * @file
 * Ordinal y-axes
 */

import * as d3 from 'd3';
import { generateLabels, getAxis } from './utils';

export default function () {
    let banding;
    let align = 'left';
    let scale = d3
        .scaleBand()
        .domain(['Oranges', 'Lemons', 'Apples', 'Pears'])
        .rangeRound([0, 220])
        .paddingInner(0.1)
        .paddingOuter(0.05);

    let labelWidth = 0;
    let tickSize = 0;
    let offset = 0;
    let yLabel;
    let label;
    let plotDim = [220, 100];
    let rem = 10;
    let frameName;
    let invert = false;

    function axis(parent) {
        const plotWidth = plotDim[0];
        const plotHeight = plotDim[1];

        if (invert) {
            const newDomain = scale.domain().reverse();
            scale.domain(newDomain);
        }

        const yAxis = getAxis(align)
            .tickSize(tickSize)
            .scale(scale);

        if (scale.domain.length > 1) {
            scale.paddingInner(0.1);
        } else {
            scale.paddingInner(0.2);
        }

        const bandHolder = parent.append('g').attr('class', 'highlights');

        yLabel = parent
            .append('g')
            .attr('class', 'axis yAxis')
            .call(yAxis);

        // Calculate width of widest .tick text
        parent.selectAll('.yAxis text').each(function calcTickTextWidth() {
            labelWidth = Math.max(this.getBBox().width, labelWidth);
        });

        if (frameName) {
            yLabel
                .selectAll('.axis.yAxis text')
                .attr('id', `${frameName}yLabel`);
            yLabel
                .selectAll('.axis.xAxis line')
                .attr('id', `${frameName}yTick`);
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
            const bands = scale
                .domain()
                .map(d => ({
                    pos: d,
                }))
                .filter((d, i) => i % 2 === 0);

            const yOffset = (scale.step() / 100) * (scale.paddingInner() * 100); // prettier-ignore

            // prettier-ignore
            bandHolder.selectAll('rect')
                .data(bands)
                .enter()
                .append('rect')
                .attr('x', 0)
                .attr('width', plotWidth - labelWidth)
                .attr('y', d => scale(d.pos) - (yOffset / 2))
                .attr('height', scale.step());
        }

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
    axis.scale = (d) => {
        if (!d) return scale;
        scale = d;
        return axis;
    };
    axis.domain = (d) => {
        scale.domain(d);
        return axis;
    };
    axis.frameName = (d) => {
        if (d === undefined) return frameName;
        frameName = d;
        return axis;
    };
    axis.invert = (d) => {
        if (d === undefined) return invert;
        invert = d;
        return axis;
    };
    axis.label = (d) => {
        if (d === undefined) return label;
        label = d;
        return axis;
    };
    axis.rangeRound = (d) => {
        scale.rangeRound(d);
        return axis;
    };
    axis.bandwidth = (d) => {
        if (!d) return scale.bandwidth();
        scale.bandwidth(d);
        return axis;
    };
    axis.labelWidth = (d) => {
        if (d === undefined) return labelWidth;
        labelWidth = d;
        return axis;
    };
    axis.yLabel = (d) => {
        if (d === undefined) return yLabel;
        yLabel = d;
        return axis;
    };
    axis.paddingInner = (d) => {
        if (!d) return scale.paddingInner();
        scale.paddingInner(d);
        return axis;
    };
    axis.paddingOuter = (d) => {
        if (!d) return scale.paddingOuter();
        scale.paddingOuter(d);
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
    axis.tickSize = (d) => {
        if (d === undefined) return tickSize;
        tickSize = d;
        return axis;
    };
    axis.offset = (d) => {
        if (d === undefined) return offset;
        offset = d;
        return axis;
    };

    return axis;
}
