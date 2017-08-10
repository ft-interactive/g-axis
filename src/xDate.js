import * as d3 from 'd3';

export default function () {
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
            .attr('class', 'axis xAxis axis baseline')
            .call(xAxis);

        if (minorAxis) {
            xLabelMinor = parent.append('g')
                .attr('class', (d) => {
                    const plotHeight = d3.select('.chart-plot').node().getBBox().height;
                    if (plotHeight === tickSize) {
                        return 'axis xAxis';
                    }
                    return 'axis xAxis axis baseline';
                })
                .call(xMinor);
        }

        if (frameName) {
            xLabel.selectAll('.axis.xAxis text')
                .attr('id', frameName + 'xLabel');
            xLabel.selectAll('.axis.xAxis line')
                .attr('id', frameName + 'xTick');
            if (minorAxis) {
                xLabelMinor.selectAll('.axis.xAxis line')
                    .attr('id', frameName + 'xTick');
            }
        }

        xLabel.selectAll('.domain').remove();
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
    axis.frameName = (d) => {
        if (!d) return frameName;
        frameName = d;
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
