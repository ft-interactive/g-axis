import * as d3 from 'd3';

export default function () {
    let align = 'left';
    let scale = d3.scaleBand()
        .domain(['Oranges', 'Lemons', 'Apples', 'Pears'])
        .rangeRound([0, 220])
        .paddingInner(0.1)
        .paddingOuter(0.05);

    let labelWidth = 0;
    let tickSize = 0;
    let offset = 0;
    let yLabel;
    let label;
    let frameName;
    let invert = false;

    function getAxis(alignment) {
        return {
            left: d3.axisLeft(),
            right: d3.axisRight(),
        }[alignment];
    }

    function axis(parent) {
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

        yLabel = parent.append('g')
            .attr('class', 'axis yAxis')
            .call(yAxis);

        // Calculate width of widest .tick text
        parent.selectAll('.yAxis text').each(function calcTickTextWidth() {
            labelWidth = Math.max(this.getBBox().width, labelWidth);
        });

        if (frameName) {
            yLabel.selectAll('.axis.yAxis text')
            .attr('id', `${frameName}yLabel`);
            yLabel.selectAll('.axis.xAxis line')
            .attr('id', `${frameName}yTick`);
        }

        if (label) {
            const defaultLabel = {
                tag: label.tag,
                hori: (label.hori || 'left'),
                vert: (label.vert || 'middle'),
                anchor: (label.anchor || 'middle'),
                rotate: (label.rotate || -90),
            };

            const axisLabel = parent.append('g')
                .attr('class', 'axis xAxis');

            axisLabel.append('text')
                .attr('y', getVerticle(defaultLabel.vert))
                .attr('x', getHorizontal(align, defaultLabel.hori))
                .text(defaultLabel.tag)

            const text = axisLabel.selectAll('text');
            const width = (text.node().getBBox().width) / 2;
            const height = (text.node().getBBox().height) / 2;
            const textX = text.node().getBBox().x + width;
            const textY = text.node().getBBox().y + height;
            text.attr('transform', 'rotate(' + (defaultLabel.rotate) + ', ' + textX + ', ' + textY + ')')
                .style('text-anchor', defaultLabel.anchor);

            function getVerticle(vert) {
                return {
                    top: scale.range()[0],
                    middle: (scale.range()[1] - scale.range()[0]) / 2,
                    bottom: scale.range()[1],
                }[vert];
            }

            function getHorizontal(axisAlign, horiAlign) {
                return {
                    leftleft: 0 - (labelWidth + (rem / .9)),
                    leftmiddle: 0 - (labelWidth / 2),
                    leftright: (rem),
                    rightleft: tickSize,
                    rightmiddle: tickSize + (rem * 1),
                    rightright: tickSize + (rem * 2),
                }[axisAlign + horiAlign];
            }
        }

        yLabel.selectAll('.domain').remove();
    }

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
    axis.align = (d) => {
        if (!d) return align;
        align = d;
        return axis;
    };

    return axis;
}
