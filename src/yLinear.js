import * as d3 from 'd3';

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
        let deciCheck = false;
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

        let deciFormat;
        if (span >= 0.5) {
            deciFormat = d3.format('.1f');
        }
        if (span < 0.5) {
            deciFormat = d3.format('.2f');
        }
        if (span <= 0.011) {
            deciFormat = d3.format('.3f');
        }
        if (span < 0.0011) {
            deciFormat = d3.format('.4f');
        }
        if (span < 0.00011) {
            deciFormat = d3.format('.5f');
        }
        if (span < 0.000011) {
            deciFormat = d3.format('.6f');
        }
        const numberFormat = d3.format(',');

        const yAxis = getAxis(align)
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
            yAxis.tickValues(tickValues);
        }

        if (customFormat) {
            yAxis.tickFormat(customFormat);
        }

        const bandHolder = parent.append('g').attr('class', 'highlights');

        yLabel = parent
            .append('g')
            .attr('class', 'axis yAxis')
            .call(yAxis);

        // Calculate width of widest .tick text
        yLabel.selectAll('.yAxis text').each(function calcTickTextWidth() {
            labelWidth = Math.max(this.getBBox().width, labelWidth);
        });

        // Use this to amend the tickSIze and re cal the vAxis
        if (tickSize < labelWidth) {
            yLabel.call(yAxis.tickSize(tickSize));
        } else {
            yLabel.call(yAxis.tickSize(tickSize - labelWidth));
        }

        if (align === 'right') {
            yLabel
                .selectAll('text')
                .attr('transform', `translate(${labelWidth},0)`);
        }

        if (frameName) {
            yLabel
                .selectAll('.axis.yAxis text')
                .attr('id', `${frameName}yLabel`);
            yLabel
                .selectAll('.axis.yAxis line')
                .attr('id', `${frameName}yTick`);
        }

        if (label) {
            const defaultLabel = {
                tag: label.tag,
                hori: label.hori || 'left',
                vert: label.vert || 'middle',
                anchor: label.anchor || 'middle',
                rotate: label.rotate || -90,
            };

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

            bandHolder
                .selectAll('rect')
                .data(bands)
                .enter()
                .append('rect')
                .attr('x', 0)
                .attr('width', plotWidth - labelWidth)
                .attr('y', d => scale(d.pos))
                .attr('height', d => d.height);
        }

        yLabel
            .selectAll('.tick')
            .filter(d => d === 0 || d === yAxisHighlight)
            .classed('baseline', true);

        yLabel.selectAll('.domain').remove();
    }

    function getAxis(alignment) {
        return {
            left: d3.axisLeft(),
            right: d3.axisRight(),
        }[alignment];
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
