/**
 * @file
 * Code shared between multiple axes
 */

import * as d3 from 'd3';

export const getDecimalFormat = (span) => {
    if (span >= 0.5) {
        return d3.format('.1f');
    } else if (span < 0.5) {
        return d3.format('.2f');
    } else if (span <= 0.011) {
        return d3.format('.3f');
    } else if (span < 0.0011) {
        return d3.format('.4f');
    } else if (span < 0.00011) {
        return d3.format('.5f');
    } else if (span < 0.000011) {
        return d3.format('.6f');
    } else if (isNaN(span)) {
        throw new Error('Span value is not a number');
    }

    return null;
};

export const getAxis = (alignment) => {
    try {
        return {
            top: d3.axisTop(),
            bottom: d3.axisBottom(),
            left: d3.axisLeft(),
            right: d3.axisRight(),
        }[alignment];
    } catch (e) {
        throw new Error('Invalid axis specified.');
    }
};

export const convertToPointScale = scale =>
    d3
        .scalePoint()
        .domain(scale.domain())
        .range(scale.range());

export const getTimeTicks = intvl =>
    ({
        century: d3.timeYear.every(100),
        jubilee: d3.timeYear.every(50),
        decade: d3.timeYear.every(10),
        lustrum: d3.timeYear.every(5),
        years: d3.timeYear.every(1),
        fiscal: d3.timeYear.every(1),
        quarters: d3.timeYear.every(1),
        months: d3.timeMonth.every(1),
        weeks: d3.timeWeek.every(1),
        daily: d3.timeDay.every(1),
        days: d3.timeDay.every(1),
        hours: d3.timeHour.every(1),
    }[intvl]);

export const getTimeTicksMinor = intvl =>
    ({
        century: d3.timeYear.every(10),
        jubilee: d3.timeYear.every(10),
        decade: d3.timeYear.every(1),
        lustrum: d3.timeYear.every(1),
        years: d3.timeMonth.every(1),
        fiscal: d3.timeMonth.every(1),
        quarters: d3.timeMonth.every(3),
        months: d3.timeDay.every(1),
        weeks: d3.timeDay.every(1),
        daily: d3.timeHour.every(1),
        days: d3.timeHour.every(1),
        hours: d3.timeMinute.every(1),
    }[intvl]);

export const getTimeTickFormat = (intvl, { fullYear, scale }) => {
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
        daily(d, i) {
            const format = getDaily(d, i);
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

    function getDaily(d, i) {
        const last = scale.domain().length - 1;
        if (i === 0) {
            return `${formatDay(d)} ${formatMonth(d)}`;
        }
        if (d.getDate() === 1) {
            return `${formatMonth(d)}`;
        }
        if (d.getDay() === 5) {
            return `${formatDay(d)}`;
        }
        if (i === last) {
            return formatDay(d);
        }
        return '';
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
        if (fullYear || +formatFullYear(d) % 100 === 0 || i === 0) {
            return formatFullYear(d);
        }
        return formatYear(d);
    }
    function getFiscal(d, i) {
        if (fullYear || +formatFullYear(d) % 100 === 0 || i === 0) {
            return `${formatFullYear(d)}/${Number(formatYear(d)) + 1}`;
        }
        return `${formatYear(d)}/${Number(formatYear(d)) + 1}`;
    }
};

export const setLabelIds = ({ selection, frameName, axis }) => {
    selection
        .selectAll(`.axis.${axis.toLowerCase()}Axis text`)
        .attr('id', `${frameName}${axis.toLowerCase()}Label`);

    selection
        .selectAll(`.axis.${axis.toLowerCase()}Axis line`)
        .attr('id', `${frameName}${axis.toLowerCase()}Tick`);
};

export const getDefaultXAxisLabel = label => ({
    tag: label.tag,
    hori: label.hori || 'middle',
    vert: label.vert || 'bottom',
    anchor: label.anchor || 'middle',
    rotate: label.rotate || 0,
});

export const getDefaultYAxisLabel = label => ({
    tag: label.tag,
    hori: label.hori || 'left',
    vert: label.vert || 'middle',
    anchor: label.anchor || 'middle',
    rotate: label.rotate || -90,
});

export const getXVertical = ({ align, vert, plotHeight, rem, tickSize }) => {
    const calcOffset = () => {
        if (tickSize > 0 && tickSize < rem) {
            return tickSize + (rem * 0.8); // prettier-ignore
        }
        return (rem * 0.9); // prettier-ignore
    };
    return {
        toptop: 0 - rem,
        topmiddle: 0,
        topbottom: 0 + rem,
        bottomtop: plotHeight,
        bottommiddle: plotHeight + calcOffset(),
        bottombottom: plotHeight + calcOffset() + (rem * 1.1), // prettier-ignore
    }[align + vert];
};

export const getXHorizontal = ({ hori, plotWidth }) =>
    ({
        left: plotWidth - plotWidth,
        middle: plotWidth / 2,
        right: plotWidth,
    }[hori]);

export const getYVertical = ({ vert, plotHeight }) =>
    ({
        top: plotHeight - plotHeight,
        middle: plotHeight / 2,
        bottom: plotHeight,
    }[vert]);

export const getYHorizontal = ({
    align,
    hori,
    plotWidth,
    rem,
    tickSize,
    labelWidth,
}) => {
    const calcOffset = () => {
        if (tickSize > 0 && tickSize < rem) {
            return tickSize / 2;
        }
        return 0;
    };

    // prettier-ignore
    return ({
        leftleft: 0 - (labelWidth + (rem * 0.6)),
        leftmiddle: 0 - (labelWidth / 2) - calcOffset(),
        leftright: rem * 0.7,
        rightleft: plotWidth - labelWidth,
        rightmiddle: plotWidth + (labelWidth / 2) + (rem * 0.5) + calcOffset(),
        rightright: plotWidth + (rem) + calcOffset(),
    }[align + hori]);
};

export const getBandWidth = ({ index, bands, plotWidth, scale }) => {
    if (index === bands.length - 1) {
        return plotWidth - scale(bands[index]);
    }
    return scale(bands[index + 1]) - scale(bands[index]);
};

export const formatNumber = (
    d,
    { divisor, numberFormat, deciFormat, deciCheck, logScale },
) => {
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
};

export const generateDateTickValues = ({
    intraday,
    scale,
    interval,
    endTicks,
}) => {
    if (intraday) {
        // prettier-ignore
        return scale
            .domain()
            .filter(
                (d, i) =>
                    (i > 0
                        ? d.getDay() !==
                          new Date(scale.domain()[i - 1]).getDay()
                        : d.getDay()),
            );
    }

    let newTicks = scale.ticks(getTimeTicks(interval));
    const dayCheck = scale.domain()[0].getDate();
    const monthCheck = scale.domain()[0].getMonth();

    if (dayCheck !== 1 && monthCheck !== 0) {
        newTicks.unshift(scale.domain()[0]);
    }

    if (
        interval === 'lustrum' ||
        interval === 'decade' ||
        interval === 'jubilee' ||
        interval === 'century'
    ) {
        newTicks.push(d3.timeYear(scale.domain()[1]));
    }

    if (endTicks) {
        newTicks = scale.domain();
    }

    return newTicks;
};

export const generateLabels = (
    axis,
    { label, plotHeight, parent, align, plotWidth, rem, tickSize, labelWidth },
) => {
    const axisLabel = parent.append('g');
    const defaultLabel =
        axis === 'x'
            ? getDefaultXAxisLabel(label)
            : getDefaultYAxisLabel(label);

    switch (axis) {
    case 'x':
        axisLabel
                .attr('class', 'axis xAxis')
                .append('text')
                .attr(
                    'y',
                    getXVertical({
                        align,
                        vert: defaultLabel.vert,
                        plotHeight,
                        rem,
                        tickSize,
                    }),
                )
                .attr(
                    'x',
                    getXHorizontal({ hori: defaultLabel.hori, plotWidth }),
                )
                .text(defaultLabel.tag);
        break;
    case 'y':
        axisLabel.attr('class', 'axis xAxis');

        axisLabel
                .append('text')
                .attr(
                    'y',
                    getYVertical({ vert: defaultLabel.vert, plotHeight }),
                )
                .attr(
                    'x',
                    getYHorizontal({
                        align,
                        hori: defaultLabel.hori,
                        plotWidth,
                        rem,
                        tickSize,
                        labelWidth,
                    }),
                )
                .text(defaultLabel.tag);
        break;
    default:
        throw new Error('No axis direction specified');
    }

    const text = axisLabel.selectAll('text');
    const width = text.node().getBBox().width / 2;
    const height = text.node().getBBox().height / 2;
    const textX = text.node().getBBox().x + width;
    const textY = text.node().getBBox().y + height;
    text.attr(
        'transform',
        `rotate(${defaultLabel.rotate}, ${textX}, ${textY})`,
    ).style('text-anchor', defaultLabel.anchor);
};

export const generateBanding = (
    direction,
    { parent, bands, scale, plotHeight, plotWidth, labelWidth, align, rem },
) => {
    switch (direction) {
    case 'x':
        parent
                .append('g')
                .attr('class', 'highlights')
                .selectAll('rect')
                .data(bands)
                .enter()
                .append('rect')
                .attr('y', 0)
                .attr('height', plotHeight)
                .attr('x', (d) => {
                    if (scale.step) {
                        const yOffset =
                            (scale.step() / 100) * (scale.paddingInner() * 100);
                        return scale(d.pos) - (yOffset / 2); // prettier-ignore
                    }
                    return scale(d.pos);
                })
                .attr('width', scale.step ? scale.step() : d => d.width);
        break;
    case 'y':
        parent
                .append('g')
                .attr('class', 'highlights')
                .selectAll('rect')
                .data(bands)
                .enter()
                .append('rect')
                .attr('x', 0)
                .attr('width', () => {
                    if (align === 'left' || !rem) {
                        return plotWidth - labelWidth;
                    }
                    return plotWidth - labelWidth - rem;
                })
                .attr('y', (d) => {
                    // prettier-ignore
                    if (scale.step) {
                        const yOffset = (scale.step() / 100)
                            * (scale.paddingInner() * 100);
                        return scale(d.pos) - (yOffset / 2);
                    }
                    return scale(d.pos);
                })
                .attr('height', scale.step ? scale.step() : d => d.height);
        break;
    default:
        throw new Error('No axis direction specified for banding');
    }
};
