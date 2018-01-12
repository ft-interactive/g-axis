import * as d3 from 'd3';

export default function xAxisOrdinal() {
    let align = 'bottom';
    let scale = d3.scaleBand()
        .domain(['Oranges', 'Lemons', 'Apples', 'Pears'])
        .rangeRound([0, 220])
        .paddingInner(0.1)
        .paddingOuter(0.05);
    let tickSize = 10;
    let xLabel;
    let label;
    let plotDim = [200, 100];
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

        const xAxis = getAxis(align)
            .tickSize(tickSize)
            .scale(scale);

        if (scale.domain.length > 1) {
            scale.paddingInner(0.1);
        } else {
            scale.paddingInner(0.2);
        }

        xLabel = parent.append('g')
            .attr('class', 'axis xAxis')
            .call(xAxis);

        if (frameName) {
            xLabel.selectAll('.axis.xAxis text')
            .attr('id', `${frameName}xLabel`);
            xLabel.selectAll('.axis.xAxis line')
            .attr('id', `${frameName}xTick`);
        }

        if (label) {
            const defaultLabel = {
                tag: label.tag,
                hori: (label.hori || 'middle'),
                vert: (label.vert || 'bottom'),
                anchor: (label.anchor || 'middle'),
                rotate: (label.rotate || 0),
            };

            const axisLabel = parent.append('g')
                .attr('class', 'axis xAxis');

            axisLabel.append('text')
                .attr('y', getVerticle(align, defaultLabel.vert))
                .attr('x', getHorizontal(defaultLabel.hori))
                .text(defaultLabel.tag);

            const text = axisLabel.selectAll('text');
            const width = (text.node().getBBox().width) / 2;
            const height = (text.node().getBBox().height) / 2;
            const textX = text.node().getBBox().x + width;
            const textY = text.node().getBBox().y + height;
            text.attr('transform', 'rotate(' + (defaultLabel.rotate) + ', ' + textX + ', ' + textY + ')')
                .style('text-anchor', defaultLabel.anchor);

            function getVerticle(axisAlign, vertAlign) {
                return {
                   toptop: 0 - (rem),
                    topmiddle: 0,
                    topbottom: 0 + (rem),
                    bottomtop: plotHeight,
                    bottommiddle: plotHeight + (rem * .9),
                    bottombottom: plotHeight + (rem * 1.8),
                }[axisAlign + vertAlign];
            }

            function getHorizontal(hori) {
                return {
                    left: scale.range()[0],
                    middle: (scale.range()[1] - scale.range()[0]) / 2,
                    right: scale.range()[1],
                }[hori];
            }
        }

        xLabel.selectAll('.domain').remove();
    }

    axis.align = (d) => {
        if (!d) return align;
        align = d;
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
    axis.rangeRound = (d) => {
        scale.rangeRound(d);
        return axis;
    };
    axis.bandwidth = (d) => {
        if (d === undefined) return scale.bandwidth();
        scale.bandwidth(d);
        return axis;
    };
    axis.tickSize = (d) => {
        tickSize = d;
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
    axis.xLabel = (d) => {
        if (d === undefined) return xLabel;
        xLabel = d;
        return axis;
    };
    function getAxis(alignment) {
        return {
            top: d3.axisTop(),
            bottom: d3.axisBottom(),
        }[alignment];
    }
    return axis;
}
