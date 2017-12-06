(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
    (factory((global.gAxis = global.gAxis || {}),global.d3));
}(this, function (exports,d3) { 'use strict';

    function xDate () {
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
        let xLabel;
        let xLabelMinor;
        let endTicks;
        let customFormat = false

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
        axis.tickFormat = (d) => {
            customFormat = d;
            scale.tickFormat(d);
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

    function xLinear () {
        let scale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, 220]);
        let tickSize = 50;
        let numTicks = 5;
        let align = 'bottom';
        let divisor = 1;
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
            let deciCheck = false;
            const span = scale.domain()[1] - scale.domain()[0];

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

            let deciFormat;
            if (span >= 0.5) { deciFormat = d3.format('.1f'); }
            if (span < 0.5) { deciFormat = d3.format('.2f'); }
            if (span <= 0.011) { deciFormat = d3.format('.3f'); }
            if (span < 0.0011) { deciFormat = d3.format('.4f'); }
            if (span < 0.00011) { deciFormat = d3.format('.5f'); }
            if (span < 0.000011) { deciFormat = d3.format('.6f'); }
            const numberFormat = d3.format(',');

            const xAxis = getAxis(align)
                .tickSize(tickSize)
                .ticks(numTicks)
                .scale(scale)
                .tickFormat(formatNumber);

            function formatNumber(d) {
                const checkDecimal = Number.isInteger(d / divisor);
                if (checkDecimal === false) { deciCheck = true; }
                if (d / divisor === 0) { return numberFormat(d / divisor); }
                if (logScale) { return numberFormat(d / divisor); }
                if (deciCheck) {
                    return deciFormat(d / divisor);
                }
                return numberFormat(d / divisor);
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
        axis.divisor = (d) => {
            if (!d) return divisor;
            divisor = d;
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

    function xAxisOrdinal() {
        let align = 'bottom';
        let scale = d3.scaleBand()
            .domain(['Oranges', 'Lemons', 'Apples', 'Pears'])
            .rangeRound([0, 220])
            .paddingInner(0.1)
            .paddingOuter(0.05);
        let tickSize = 10;
        let xLabel;
        let frameName;
        let invert = false;

        function axis(parent) {
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

            xLabel = parent.append('g')
                .attr('class', 'axis xAxis')
                .call(xAxis);

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
            if (!d) return scale.paddinOuter();
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

    function yLinear () {
        let scale = d3.scaleLinear()
            .domain([0, 10000])
            .range([120, 0]);
        let align = 'right';
        let divisor = 1;
        let invert = false;
        let labelWidth = 0;
        let logScale = false;
        let numTicks = 5;
        let tickSize = 300;
        let yAxisHighlight = 0;
        let yLabel;
        let frameName;

        function axis(parent) {
            let deciCheck = false;
            const span = scale.domain()[1] - scale.domain()[0];

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

            let deciFormat;
            if (span >= 0.5) { deciFormat = d3.format('.1f'); }
            if (span < 0.5) { deciFormat = d3.format('.2f'); }
            if (span <= 0.011) { deciFormat = d3.format('.3f'); }
            if (span < 0.0011) { deciFormat = d3.format('.4f'); }
            if (span < 0.00011) { deciFormat = d3.format('.5f'); }
            if (span < 0.000011) { deciFormat = d3.format('.6f'); }
            const numberFormat = d3.format(',');

            const yAxis = getAxis(align)
                .ticks(numTicks)
                .scale(scale)
                .tickFormat(formatNumber);

            function formatNumber(d) {
                const checkDecimal = Number.isInteger(d / divisor);
                if (checkDecimal === false) { deciCheck = true; }
                if (d / divisor === 0) { return numberFormat(d / divisor); }
                if (logScale) { return numberFormat(d / divisor); }
                if (deciCheck) {
                    return deciFormat(d / divisor);
                }
                return numberFormat(d / divisor);
            }

            yLabel = parent.append('g')
              .attr('class', 'axis yAxis')
              .call(yAxis);


        // Calculate width of widest .tick text
            yLabel.selectAll('.yAxis text').each(function calcTickTextWidth() {
                labelWidth = Math.max(this.getBBox().width, labelWidth);
            });

            // Use this to amend the tickSIze and re cal the vAxis
            if (tickSize < labelWidth) {
                yLabel.call(yAxis.tickSize);
            } else { yLabel.call(yAxis.tickSize(tickSize - labelWidth)); }

            if (align === 'right') {
                yLabel.selectAll('text')
                .attr('transform', `translate(${(labelWidth)},0)`);
            }

            if (frameName) {
                yLabel.selectAll('.axis.yAxis text')
                .attr('id', `${frameName}yLabel`);
                yLabel.selectAll('.axis.yAxis line')
                .attr('id', `${frameName}yTick`);
            }

            yLabel.selectAll('.tick')
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
        axis.range = (d) => {
            scale.range(d);
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
        axis.tickSize = (d) => {
            if (!d) return tickSize;
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
        let frameName;
        let invert = false;

        function getAxis(alignment) {
            return {
                left: d3.axisLeft(),
                right: d3.axisRight(),
            }[alignment];
        }

        function axis(parent) {
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

            yLabel.selectAll('.domain').remove();
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

    function yDate () {
        const mindate = new Date(1970, 1, 1);
        const maxdate = new Date(2017, 6, 1);
        let scale = d3.scaleTime()
            .domain([mindate, maxdate])
            .range([0, 220]);
        let frameName;
        let intraday = false;
        let interval = 'lustrum';
        let labelWidth = 0;
        let minorAxis = true;
        let tickSize = 10;
        let minorTickSize = 5;
        let fullYear = false;
        let align = 'left';
        let yLabel;
        let yLabelMinor;
        let endTicks;
        let customFormat = false;

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
                        left: d3.axisLeft(),
                        right: d3.axisRight(),
                    }[alignment];
                }
                return {
                    left: d3.axisLeft(),
                    right: d3.axisRight(),
                }[alignment];
            }

            const yAxis = getAxis(align);
            if (intraday) {
                yAxis
                    .tickSize(tickSize)
                    .tickFormat(tickFormat(interval))
                    .scale(scale);
                yAxis.tickValues(scale.domain().filter((d, i) => {
                    let checkDate;
                    if (i === 0) { return d.getDay(); }
                    if (i > 0) { checkDate = new Date(scale.domain()[i - 1]); }
                    return (d.getDay() !== checkDate.getDay());
                }));
            } else {
                yAxis
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
                yAxis.tickValues(newTicks);
            }

            const yMinor = getAxis(align);
            if (intraday) {
                yMinor
                    .tickSize(minorTickSize)
                    .tickFormat('')
                    .scale(scale);
            } else {
                yMinor
                    .tickSize(minorTickSize)
                    .ticks(getTicksMinor(interval))
                    .tickFormat('')
                    .scale(scale);
            }

            if (customFormat) {
                yAxis.tickFormat(customFormat);
            }

            yLabel = parent.append('g')
                .attr('class', 'axis yAxis axis baseline')
                .call(yAxis);

            // Calculate width of widest .tick text
            yLabel.selectAll('.yAxis text').each(function calcTickTextWidth() {
                labelWidth = Math.max(this.getBBox().width, labelWidth);
            });

            // Use this to amend the tickSIze and re cal the vAxis
            if (tickSize < labelWidth) {
                yLabel.call(yAxis.tickSize);
            } else { yLabel.call(yAxis.tickSize(tickSize - labelWidth)); }

            if (align === 'right') {
                yLabel.selectAll('text')
                .attr('transform', `translate(${(labelWidth)},0)`);
            }

            if (minorAxis) {
                yLabelMinor = parent.append('g')
                    .attr('class', () => {
                        const plotHeight = d3.select('.chart-plot').node().getBBox().height;
                        if (plotHeight === tickSize) {
                            return 'axis yAxis';
                        }
                        return 'axis yAxis axis baseline';
                    })
                    .call(yMinor);
            }

            if (frameName) {
                yLabel.selectAll('.axis.yAxis text')
                .attr('id', `${frameName}yLabel`);
                yLabel.selectAll('.axis.yAxis line')
                .attr('id', `${frameName}xTick`);
                if (minorAxis) {
                    yLabelMinor.selectAll('.axis.yAxis line')
                    .attr('id', `${frameName}xTick`);
                }
            }

            yLabel.selectAll('.domain').remove();
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
        axis.tickFormat = (d) => {
            customFormat = d
            scale.tickFormat(d);
            return axis;
        };
        axis.endTicks = (d) => {
            if (d === undefined) return endTicks;
            endTicks = d;
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
        axis.labelWidth = (d) => {
            if (!d) return labelWidth;
            labelWidth = d;
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
        axis.yLabel = (d) => {
            if (d === undefined) return yLabel;
            yLabel = d;
            return axis;
        };
        axis.yLabelMinor = (d) => {
            if (d === undefined) return yLabelMinor;
            yLabelMinor = d;
            return axis;
        };
        return axis;
    }

    exports.xDate = xDate;
    exports.xLinear = xLinear;
    exports.xOrdinal = xAxisOrdinal;
    exports.yLinear = yLinear;
    exports.yOrdinal = yOrdinal;
    exports.yDate = yDate;

    Object.defineProperty(exports, '__esModule', { value: true });

}));