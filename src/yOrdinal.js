import * as d3 from 'd3';

export default function () {
    let banding;
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
    let plotDim = [220, 100];
    let rem = 10;
    let frameName;
    let invert = false;

    function getAxis(alignment) {
        return {
            left: d3.axisLeft(),
            right: d3.axisRight(),
        }[alignment];
    }

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

        let bandHolder = parent
            .append('g')
            .attr('class', 'highlights');

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
                    top: plotHeight - plotHeight,
                    middle: plotHeight / 2,
                    bottom: plotHeight,
                }[vert];
            }

            function getHorizontal(axisAlign, horiAlign) {
                return {
                    leftleft: 0 - (labelWidth + (rem * 0.6)),
                    leftmiddle: 0 - (labelWidth / 2) - calcOffset(),
                    leftright: rem * 0.7,
                    rightleft: plotWidth - labelWidth,
                    rightmiddle: plotWidth + (labelWidth / 2) + (rem * 0.5) + calcOffset(),
                    rightright: plotWidth + (rem) + calcOffset(),
                }[axisAlign + horiAlign];
            }

            function calcOffset() {
                if (tickSize > 0 && tickSize < rem) {
                    return tickSize / 2;
                }
                return 0;
            }
        }

        if (banding) {
            let bands = scale.domain()
            console.log(bands)

            bands = bands.map((d,i) => {
                return{
                    pos: d,
                }
            })
            .filter((d, i) => {
                return i % 2 === 0;
            })
            const yOffset  = (scale.step() / 100) * (scale.paddingInner() * 100)
            bandHolder.selectAll('rect')
                .data(bands)
                .enter()
                .append('rect')
                .attr('x', 0)
                .attr('width', plotWidth -labelWidth)
                .attr('y', d => scale(d.pos) - (yOffset/2))
                .attr('height', scale.step())
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
