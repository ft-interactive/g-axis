import * as d3 from 'd3';

export default function () {
    const mindate = new Date(1970, 1, 1);
    const maxdate = new Date(2017, 6, 1);
    let scale = d3.scaleTime()
        .domain([mindate, maxdate])
        .range([0, 220]);
    let frameName;
    let intraday = false;
    let interval = 'lustrum';
    let minorAxis = true;
    let tickSize = 10;
    let minorTickSize = 5;
    let fullYear = false;
    let align = 'bottom';
    let label;
    let xLabel;
    let xLabelMinor;
    let label;
    let rem = 10;
    let endTicks;
    let customFormat = false;
    let tickValues;

    function axis(parent) {
        function getAxis(alignment) {
            if (intraday) {
                console.log('intraday axis'); // eslint-disable-line
                const newDomain = scale.domain();
                const newRange = scale.range();
                scale = d3.scalePoint()
                    .domain(newDomain)
                    .range(newRange);
                return {
                    top: d3.axisTop(),
                    bottom: d3.axisBottom(),
                }[alignment];
            }
            return {
                top: d3.axisTop(),
                bottom: d3.axisBottom(),
            }[alignment];
        }

        const xAxis = getAxis(align);
        if (intraday) {
            xAxis
                .tickSize(tickSize)
                .tickFormat(tickFormat(interval))
                .scale(scale);
            xAxis.tickValues(scale.domain().filter((d, i) => {
                let checkDate;
                if (i === 0) { return d.getDay(); }
                if (i > 0) { checkDate = new Date(scale.domain()[i - 1]); }
                return (d.getDay() !== checkDate.getDay());
            }));
        } else {
            xAxis
                .tickSize(tickSize)
                // .ticks(getTicks(interval))
                .tickFormat(tickFormat(interval))
                .scale(scale);
            let newTicks = scale.ticks(getTicks(interval));
            const dayCheck = (scale.domain()[0]).getDate();
            const monthCheck = scale.domain()[0].getMonth();
            if (dayCheck !== 1 && monthCheck !== 0) {
                newTicks.unshift(scale.domain()[0]);
            }
            if (interval === 'lustrum' || interval === 'decade' || interval === 'jubilee' || interval === 'century') {
                newTicks.push(d3.timeYear(scale.domain()[1]));
            }
            if (endTicks) { newTicks = scale.domain(); }
            xAxis.tickValues(newTicks);
        }

        const xMinor = getAxis(align);
        if (intraday) {
            xMinor
                .tickSize(minorTickSize)
                .tickFormat('')
                .scale(scale);
        } else {
            xMinor
                .tickSize(minorTickSize)
                .ticks(getTicksMinor(interval))
                .tickFormat('')
                .scale(scale);
        }

        if (tickValues) {
            xAxis.tickValues(tickValues);
        }

        if (customFormat) {
            xAxis.tickFormat(customFormat);
        }

        xLabel = parent.append('g')
            .attr('class', 'axis xAxis axis baseline')
            .call(xAxis);

        if (minorAxis) {
            xLabelMinor = parent.append('g')
                .attr('class', () => {
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
            .attr('id', `${frameName}xLabel`);
            xLabel.selectAll('.axis.xAxis line')
            .attr('id', `${frameName}xTick`);
            if (minorAxis) {
                xLabelMinor.selectAll('.axis.xAxis line')
                .attr('id', `${frameName}xTick`);
            }
        }
        
        if (label) {
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
            text.attr('transform', 'rotate(' + (defaultLabel.rotate) + ', ' + textX + ', ' + textY + ')')
                .style('text-anchor', defaultLabel.anchor);

            function getVerticle(axisAlign, vertAlign) {
                return {
                    toptop: 0 - (rem),
                    topmiddle: 0,
                    topbottom: 0 + (rem),
                    bottomtop: tickSize,
                    bottommiddle: tickSize + (rem * 1),
                    bottombottom: tickSize + (rem * 2),
                }[axisAlign + vertAlign];
            }

            function getHorizontal(hori) {
                return {
                    left: scale.range()[0],
                    middle: (scale.range()[1] - scale.range()[0]) / 2,
                    right: scale.range()[1],
                }[hori];
            }
        }

        xLabel.selectAll('.domain').remove();
    }

    function getTicks(intvl) {
        return {
            century: d3.timeYear.every(100),
            jubilee: d3.timeYear.every(50),
            decade: d3.timeYear.every(10),
            lustrum: d3.timeYear.every(5),
            years: d3.timeYear.every(1),
            fiscal: d3.timeYear.every(1),
            quarters: d3.timeYear.every(1),
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
            fiscal: d3.timeMonth.every(1),
            quarters: d3.timeMonth.every(3),
            months: d3.timeDay.every(1),
            weeks: d3.timeDay.every(1),
            days: d3.timeHour.every(1),
            hours: d3.timeMinute.every(1),
        }[intvl];
    }

    function tickFormat(intvl) {
        const formatFullYear = d3.timeFormat('%Y');
        const formatYear = d3.timeFormat('%y');
        const formatMonth = d3.timeFormat('%b');
        const formatWeek = d3.timeFormat('%W');
        const formatDay = d3.timeFormat('%d');
        const formatHour = d3.timeFormat('%H:%M');
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
            fiscal(d, i) {
                const format = getFiscal(d, i);
                return format;
            },
            quarters(d, i) {
                const format = getQuarters(d, i);
                return format;
            },
            months(d, i) {
                const format = checkMonth(d, i);
                return format;
            },
            weeks(d, i) {
                const format = getWeek(d, i);
                return format;
            },
            days(d, i) {
                const format = getDays(d, i);
                return format;
            },
            hours(d, i) {
                const format = getHours(d, i);
                return format;
            },
        }[intvl];

        function getHours(d, i) {
            if (d.getHours() === 1 || i === 0) {
                return `${formatHour(d)} ${formatDay(d)}`;
            }
            return formatHour(d);
        }

        function getDays(d, i) {
            if (d.getDate() === 1 || i === 0) {
                return `${formatDay(d)} ${formatMonth(d)}`;
            }
            return formatDay(d);
        }

        function getWeek(d) {
            if (d.getDate() < 9) {
                return `${formatWeek(d)} ${formatMonth(d)}`;
            }
            return formatWeek(d);
        }

        function getQuarters(d, i) {
            if (d.getMonth() < 3 && i < 4) {
                return `Q1 ${formatFullYear(d)}`;
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
            throw new Error('Invalid quarter');
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
        function getFiscal(d, i) {
            if (fullYear || (+formatFullYear(d) % 100 === 0) || (i === 0)) {
                return `${formatFullYear(d)}/${Number(formatYear(d)) + 1}`;
            }
            return `${formatYear(d)}/${Number(formatYear(d)) + 1}`;
        }
    }
    axis.align = (d) => {
        align = d;
        return axis;
    };
    axis.endTicks = (d) => {
        if (d === undefined) return endTicks;
        endTicks = d;
        return axis;
    };
    axis.label = (d) => {
        if (d === undefined) return label;
        label = d;
        return axis;
    };
    axis.rem = (d) => {
        if (!d) return rem;
        rem = d;
        return axis;
    };
    axis.tickFormat = (d) => {
        customFormat = d;
        scale.tickFormat(d);
        return axis;
    };
    axis.tickValues = (d) => {
        if (!d) return tickValues;
        tickValues = d;
        return axis;
    };
    axis.frameName = (d) => {
        if (d === undefined) return frameName;
        frameName = d;
        return axis;
    };
    axis.intraday = (d) => {
        if (d === undefined) return intraday;
        intraday = d;
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

    axis.fullYear = (d) => {
        if (d === undefined) return fullYear;
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
        if (d === undefined) return minorAxis;
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
