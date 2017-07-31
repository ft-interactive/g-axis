import * as d3 from 'd3';

export default function () {
    let scale = d3.scaleLinear()
        .domain([0, 10000])
        .range([120, 0]);
    let align = 'right';
    let labelWidth = 0;
    let tickSize = 300;
    let invert = false;
    let yAxisHighlight = 0;
    let numTicks = 5;
    let yLabel;

    function getAxis(alignment) {
        return {
            left: d3.axisLeft(),
            right: d3.axisRight(),
        }[alignment];
    }

    function axis(parent) {
        if(invert) {
            const newRange = scale.range().reverse()
            scale.range(newRange)
        }
        const yAxis = getAxis(align)
            .ticks(numTicks)
            .scale(scale);

        yLabel = parent.append('g')
          .attr('class', 'axis yAxis')
          .call(yAxis);

    // Calculate width of widest .tick text
        parent.selectAll('.yAxis text').each(function calcTickTextWidth() {
            labelWidth = Math.max(this.getBBox().width, labelWidth);
        });

        // Use this to amend the tickSIze and re cal the vAxis
        yLabel.call(yAxis.tickSize(tickSize - labelWidth));

        if(align == 'right') {
            yLabel.selectAll('text')
            .attr("dx",labelWidth)
        }

        yLabel.selectAll('.tick')
      .filter(d => d === 0 || d === yAxisHighlight)
      .classed('baseline', true);
    }

    axis.scale = (d) => {
        scale = d;
        return axis;
    };
    axis.domain = (d) => {
        scale.domain(d);
        return axis;
    };
    axis.range = (d) => {
        scale.range(d);
        return axis;
    };
    axis.labelWidth = (d) => {
        if (d === undefined) return labelWidth;
        labelWidth = d;
        return axis;
    };
    axis.tickSize = (d) => {
        if (d === undefined) return tickSize;
        tickSize = d;
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
    axis.align = (d) => {
        if (!d) return align;
        align = d;
        return axis;
    };
    axis.invert = (d) => {
        if (!d) return invert;
        invert = d;
        return axis;
    };
    axis.yLabel = (d) => {
        if (d === undefined) return yLabel;
        yLabel = d;
        return axis;
    };

    return axis
}
