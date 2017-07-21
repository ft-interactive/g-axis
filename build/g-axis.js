(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
    (factory((global.gAxis = global.gAxis || {}),global.d3));
}(this, function (exports,d3) { 'use strict';

    function xDate () {
        let mindate = new Date(1970, 1, 1);
        let maxdate = new Date(2017, 6, 1);
        let scale = d3.scaleTime()
            .domain([mindate, maxdate])
            .range([0, 220]);
        let interval = 'lustrum';
        let minorAxis = true;
        let tickSize = 10;
        let minorTickSize = 5;
        let fullYear = false;
        let align = 'bottom';
        let xLabel;
        let xLabelMinor;

        function axis(parent) {
            function getAxis(alignment) {
                return {
                    top: d3.axisTop(),
                    bottom: d3.axisBottom(),
                }[alignment];
            }

            const xAxis = getAxis(align)
                .tickSize(tickSize)
                .ticks(getTicks(interval))
                .tickFormat(tickFormat(interval))
                .scale(scale)

            const xMinor = d3.axisBottom()
                .tickSize(minorTickSize)
                .ticks(getTicksMinor(interval))
                .tickFormat('')
                .scale(scale);

            xLabel = parent.append('g')
                .attr('class', 'axis baseline')
                .call(xAxis);

            if (minorAxis) {
                xLabelMinor = parent.append('g')
                    .attr('class', (d) => {
                        const plotHeight = d3.select('.chart-plot').node().getBBox().height;
                        if (plotHeight === tickSize) {
                            return 'axis xAxis';
                        }
                        return 'axis baseline';
                    })
                    .call(xMinor);
            }
        }

        function getTicks(interval) {
            return {
                'century' : d3.timeYear.every(100),
                'jubilee': d3.timeYear.every(50),
                'decade': d3.timeYear.every(10),
                'lustrum': d3.timeYear.every(5),
                'years': d3.timeYear.every(1),
                'quarters': d3.timeMonth.every(3),
                'months': d3.timeMonth.every(1),
                'weeks': d3.timeWeek.every(1),
                'days': d3.timeDay.every(1),
                'hours': d3.timeHour.every(1)
            }[interval];
        }
        function getTicksMinor(interval) {
            return {
                'century': d3.timeYear.every(10),
                'jubilee': d3.timeYear.every(10),
                'decade': d3.timeYear.every(1),
                'lustrum': d3.timeYear.every(1),
                'years': d3.timeMonth.every(1),
                'quarters': d3.timeMonth.every(1),
                'months': d3.timeDay.every(1),
                'weeks': d3.timeDay.every(1),
                'days': d3.timeHour.every(1),
                'hours': d3.timeMinute.every(1)
            }[interval];
        }

        function tickFormat(interval) {
            let formatFullYear = d3.timeFormat('%Y'),
            formatYear = d3.timeFormat('%y'),
            formatMonth = d3.timeFormat('%b'),
            formatWeek = d3.timeFormat('%W'),
            formatDay = d3.timeFormat('%d'),
            formatHour = d3.timeFormat('%H:%M');
            return {
                'century': d3.timeFormat('%Y'),
                'jubilee': function(d, i) {
                    const format = checkCentury(d, i);
                    return format;
                },
                'decade': function(d, i) {
                    const format = checkCentury(d, i);
                    return format;
                },
                'lustrum':function(d, i) {
                    const format = checkCentury(d, i);
                    return format;
                },
                'years': function(d, i) {
                    const format = checkCentury(d, i);
                    return format;
                },
                'quarters':function(d, i) {
                    const format = getQuarters(d, i);
                    return format;
                },
                'months': function(d, i) {
                    const format = checkMonth(d, i);
                    return format;
                },
                'weeks':function(d, i) {
                    const format = getWeek(d, i);
                    return format;
                },
                'days':function(d, i) {
                    const format = getDays(d, i);
                    return format;
                },
                'hours': function(d, i) {
                    const format = getHours(d, i);
                    return format;
                },
            }[interval];

            function getHours(d, i) {
                if (d.getHours() === 1 || i === 0) {
                    return formatHour(d) + ' ' + formatDay(d);
                }
                return formatHour(d);
            }

            function getDays(d, i) {
                if (d.getDate() === 1 || i === 0) {
                    return formatDay(d) + ' ' + formatMonth(d);
                }
                return formatDay(d);
            }

            function getWeek(d, i) {
                if (d.getDate() < 9) {
                    return formatWeek(d) + ' ' + formatMonth(d);
                }
                return formatWeek(d);
            }

            function getQuarters(d, i) {
                if (d.getMonth() < 3 && i < 4) {
                    return 'Q1 ' + formatFullYear(d);
                }
                if (d.getMonth() < 3) {
                    return 'Q1';
                }
                if (d.getMonth() >= 3 && d.getMonth() < 6) {
                    return 'Q2';
                }
                if (d.getMonth() >= 6 && d.getMonth() < 9) {
                    return 'Q3';
                }
                if (d.getMonth() >= 9 && d.getMonth() < 12) {
                    return 'Q4';
                }
            }

            function checkMonth(d, i) {
                if (d.getMonth() === 0 || i === 0) {
                    const newYear = d3.timeFormat('%b %Y');
                    return newYear(d);
                }
                return formatMonth(d);
            }

            function checkCentury(d, i) {
                if (fullYear || (+formatFullYear(d) % 100 === 0) || (i === 0)) {
                    return formatFullYear(d);
                }
                return formatYear(d);
            }
        }
        axis.align = (d) => {
            align = d;
            return axis;
        };
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

        axis.fullYear = (d) => {
            fullYear = d;
            return axis;
        };
        axis.interval = (d) => {
            interval = d;
            return axis;
        };
        axis.tickSize = (d) => {
            if (!d) return tickSize;
            tickSize = d;
            return axis;
        };
        axis.minorTickSize = (d) => {
            if (!d) return minorTickSize;
            minorTickSize = d;
            return axis;
        };
        axis.minorAxis = (d) => {
            minorAxis = d;
            return axis;
        };
        axis.xLabel = (d) => {
            if (d === undefined) return xLabel;
            xLabel = d;
            return axis;
        };
        axis.xLabelMinor = (d) => {
            if (d === undefined) return xLabelMinor;
            xLabelMinor = d;
            return axis;
        };
        return axis;
    }

    function xLinear () {
        let scale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, 220]);
        let tickSize = 50;
        let numTicks = 5;
        let align = 'bottom';
        let xAxisHighlight = 0;
        let xLabel;

        function getAxis(alignment) {
            return {
                top: d3.axisTop(),
                bottom: d3.axisBottom(),
            }[alignment];
        }

        function axis(parent) {
            const xAxis = getAxis(align)
          .tickSize(tickSize)
          .ticks(numTicks)
          .scale(scale);

            xLabel = parent.append('g')
          .attr('class', 'axis xAxis')
          .call(xAxis);

            xLabel.selectAll('.tick')
          .filter(d => d === 0 || d === xAxisHighlight)
          .classed('baseline', true);
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

    function xAxisOrdinal() {
        let align = 'bottom';
        let scale = d3.scaleBand()
            .domain(['Oranges', 'Lemons', 'Apples', 'Pears'])
            .rangeRound([0, 220])
            .paddingInner(0.1)
            .paddingOuter(0.05);
        let labelWidth = 0; // eslint-disable-line
        let tickSize = 0;
        let offset = 0;
        let xLabel;

        function axis(parent) {
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
                .attr('transform', `translate(0,${offset})`)
                .call(xAxis);
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
        axis.rangeRound = (d) => {
            scale.rangeRound(d);
            return axis;
        };
        axis.bandwidth = (d) => {
            if (!d) return scale.bandwidth();
            scale.bandwidth(d);
            return axis;
        };

        axis.paddingInner = (d) => {
            if (!d) return scale.paddingInner();
            scale.paddingInner(d);
            return axis;
        };

        axis.paddingOuter = (d) => {
            if (!d) return scale.paddinguter();
            scale.paddinguter(d);
            return axis;
        };

        axis.xLabel = (d) => {
            if (d === undefined) return xLabel;
            labelWidth = d;
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

        function getAxis(alignment) {
            return {
                top: d3.axisTop(),
                bottom: d3.axisBottom(),
            }[alignment];
        }

        return axis;
    }

    function yLinear () {
        let scale = d3.scaleLinear()
            .domain([0, 10000])
            .range([120, 0]);
        let align = 'right';
        let labelWidth = 0;
        let tickSize = 300;
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
        axis.align = (d) => {
            align = d;
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
        axis.yLabel = (d) => {
            if (d === undefined) return yLabel;
            yLabel = d;
            return axis;
        };

        return axis;
    }

    function yOrdinal () {
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

        function getAxis(alignment) {
            return {
                left: d3.axisLeft(),
                right: d3.axisRight(),
            }[alignment];
        }

        function axis(parent) {
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

            parent.selectAll('.axis.yAxis text')
                .attr('id', 'yAxisLabel');
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

    exports.xDate = xDate;
    exports.xLinear = xLinear;
    exports.xOrdinal = xAxisOrdinal;
    exports.yLinear = yLinear;
    exports.yOrdinal = yOrdinal;

    Object.defineProperty(exports, '__esModule', { value: true });

}));