import * as d3 from 'd3';

export default function () {
    let align = 'bottom';
    let fullYear = false;
    let interval = 'lustrum';
    const maxdate = new Date(2017, 6, 1);
    const mindate = new Date(1970, 1, 1);
    let minorAxis = true;
    let minorTickSize = 5;
    let offset = 0;
    let scale = d3.scaleTime()
        .domain([mindate, maxdate])
        .range([0, 220]);
    let tickSize = 10;
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
            .scale(scale);

        const xMinor = d3.axisBottom()
            .tickSize(minorTickSize)
            .ticks(getTicksMinor(interval))
            .tickFormat('')
            .scale(scale);

        xLabel = parent.append('g')
            .attr('class', 'axis baseline')
            .attr('transform', `translate(0,${offset})`)
            .call(xAxis);

        if (minorAxis) {
            xLabelMinor = parent.append('g')
            .attr('class', () => {
                const plotHeight = d3.select('.chart-plot').node().getBBox().height;
                if (plotHeight === tickSize) {
                    return 'axis xAxis';
                } return 'axis baseline';
            })
            .call(xMinor);
        }
    }

    function getTicks(intvl) {
        return {
            century: d3.timeYear.every(100),
            jubilee: d3.timeYear.every(50),
            decade: d3.timeYear.every(10),
            lustrum: d3.timeYear.every(5),
            years: d3.timeYear.every(1),
            quarters: d3.timeMonth.every(3),
            months: d3.timeMonth.every(1),
            weeks: d3.timeWeek.every(1),
            days: d3.timeDay.every(1),
            hours: d3.timeHour.every(1),
        }[intvl];
    }
    function getTicksMinor(intvl) {
        return {
            century: d3.timeYear.every(10),
            jubilee: d3.timeYear.every(10),
            decade: d3.timeYear.every(1),
            lustrum: d3.timeYear.every(1),
            years: d3.timeMonth.every(1),
            quarters: d3.timeMonth.every(1),
            months: d3.timeDay.every(1),
            weeks: d3.timeDay.every(1),
            days: d3.timeHour.every(1),
            hours: d3.timeMinute.every(1),
        }[intvl];
    }

    function tickFormat(intvl) {
        const formatFullYear = d3.timeFormat('%Y');
        const formatYear = d3.timeFormat('%y');
        return {
            century: d3.timeFormat('%Y'),
            jubilee(d, i) {
                const format = checkCentury(d, i);
                return format;
            },
            decade(d, i) {
                const format = checkCentury(d, i);
                return format;
            },
            lustrum(d, i) {
                const format = checkCentury(d, i);
                return format;
            },
            years(d, i) {
                const format = checkCentury(d, i);
                return format;
            },
            quarters: d3.timeFormat('%b'),
            months: d3.timeFormat('%b'),
            weeks: d3.timeFormat('%b'),
            days: d3.timeFormat('%d'),
            hours: d3.timeFormat('%I:00'),
        }[intvl];

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

    axis.offset = (d) => {
        if (!d) return offset;
        offset = d;
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
