import * as d3 from 'd3';

export default function () {
   let scale = d3.scaleLinear()
        .domain([0, 10000])
        .range([120, 0]);
    let align = 'right';
    let invert = false;
    let labelWidth = 0;
    let logScale = false;
    let numTicks = 5;
    let tickSize = 300;
    let xAxisHighlight = 0;
    let xLabel;
    let frameName;

    function axis(parent) {
        if (logScale) {
            const newScale = d3.scaleLog()
            .domain(scale.domain())
            .range(scale.range());
            scale = newScale;
        }
        if (invert) {
            const newRange = scale.range().reverse();
            scale.range(newRange);
        }

        const xAxis = getAxis(align)
            .ticks(numTicks)
            .tickSize(tickSize)
            .scale(scale);

        xLabel = parent.append('g')
          .attr('class', 'axis xAxis')
          .call(xAxis);

        xLabel.selectAll('.tick')
            .filter(d => d === 0 || d === xAxisHighlight)
            .classed('baseline', true);

        if (frameName) {
            xLabel.selectAll('.axis.xAxis text')
            .attr('id', frameName+'xLabel');
            xLabel.selectAll('.axis.xAxis line')
            .attr('id', frameName+'xTick');
        }

        xLabel.selectAll('.domain').remove();
    }

    function getAxis(alignment) {
        return {
            top: d3.axisTop(),
            bottom: d3.axisBottom(),
        }[alignment];
    }

    axis.align = (d) => {
        if (!d) return align;
        align = d;
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
    axis.numTicks = (d) => {
        numTicks = d;
        return axis;
    };
    axis.range = (d) => {
        scale.range(d);
        return axis;
    };
    axis.tickSize = (d) => {
        if (!d) return tickSize;
        tickSize = d;
        return axis;
    };
    axis.scale = (d) => {
        scale = d;
        return axis;
    };
    axis.xAxisHighlight = (d) => {
        xAxisHighlight = d;
        return axis;
    };
    axis.xLabel = (d) => {
        if (d === undefined) return xLabel;
        xLabel = d;
        return axis;
    };
    return axis;
}
