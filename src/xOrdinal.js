import * as d3 from 'd3';

export default function xAxisOrdinal() {
    let banding;
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

        const bandHolder = parent
            .append('g')
            .attr('class', 'highlights');

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
            const calcOffset = () => {
                if (tickSize > 0 && tickSize < rem) {
                    return tickSize + (rem * 0.8);
                }
                return (rem * 0.9);
            };

            const getVerticle = (axisAlign, vertAlign) => ({
                toptop: 0 - (rem),
                topmiddle: 0,
                topbottom: 0 + (rem),
                bottomtop: plotHeight,
                bottommiddle: plotHeight + calcOffset(),
                bottombottom: plotHeight + calcOffset() + (rem * 1.1),
            }[axisAlign + vertAlign]);

            const getHorizontal = hori => ({
                left: plotWidth - plotWidth,
                middle: plotWidth / 2,
                right: plotWidth,
            }[hori]);

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
            text.attr('transform', `rotate(${defaultLabel.rotate}, ${textX}, ${textY})`)
                .style('text-anchor', defaultLabel.anchor);
        }

        if (banding) {
            const bands = scale.domain()
                .map(d => ({
                    pos: d,
                }))
                .filter((d, i) => i % 2 === 1);

            const yOffset = (scale.step() / 100) * (scale.paddingInner() * 100);

            bandHolder.selectAll('rect')
                .data(bands)
                .enter()
                .append('rect')
                .attr('y', 0)
                .attr('height', plotHeight)
                .attr('x', d => scale(d.pos) - (yOffset / 2))
                .attr('width', scale.step());
        }

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
