import * as d3 from 'd3';

export default function () {
    let scale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, 220]);
    let divisor = 1;
    let tickSize = 50;
    let numTicks = 5;
    let align = 'bottom';
    let invert = false;
    let logScale = false;
    let xAxisHighlight = 0;
    let xLabel;
    let frameName;

    function getAxis(alignment) {
        return {
            top: d3.axisTop(),
            bottom: d3.axisBottom(),
        }[alignment];
    }

    function axis(parent) {
        if (invert) {
            const newRange = scale.range().reverse();
            scale.range(newRange);
        }
        if (logScale) {
            const newScale = d3.scaleLog()
            .domain(scale.domain())
            .range(scale.range());
            scale = newScale;
        }

        const xAxis = getAxis(align)
            .tickSize(tickSize)
            .ticks(numTicks)
            .scale(scale)
            .tickFormat(formatNumber);

        let numberFormat = d3.format(".1f")
        let deciFormat = d3.format("")

        function formatNumber(d) {
            console.log(d, d/divisor, numberFormat(d/divisor));
            if (d/divisor < 1 > 0 && d / divisor < 0 > -1) {
                return deciFormat(d/divisor)
            }
            return numberFormat(d/divisor)
        }

        xLabel = parent.append('g')
            .attr('class', 'axis xAxis')
            .call(xAxis);

        xLabel.selectAll('.tick')
            .filter(d => d === 0 || d === xAxisHighlight)
            .classed('baseline', true);

        if (frameName) {
            xLabel.selectAll('.axis.xAxis text')
            .attr('id', `${frameName}xLabel`);
            xLabel.selectAll('.axis.xAxis line')
            .attr('id', `${frameName}xTick`);
        }

        xLabel.selectAll('.domain').remove();
    }

    axis.align = (d) => {
        if (!d) return align;
        align = d;
        return axis;
    };
    axis.divisor = (d) => {
        if (!d) return divisor;
        divisor = d;
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
    axis.domain = (d) => {
        scale.domain(d);
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
