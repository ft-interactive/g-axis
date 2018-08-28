/**
 * @file
 * Shared code
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

export const convertToPointScale = scale => d3
        .scalePoint()
        .domain(scale.domain())
        .range(scale.range());
