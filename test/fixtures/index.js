import * as d3 from 'd3';
import * as gChartframe from 'g-chartframe';
import * as gAxis from '../../index.js';
import fixtures from './fixtures';

[...document.querySelectorAll('section')].forEach((section) => {
    const { id } = section;
    const axis = gAxis[id];

    fixtures[id].forEach((fixture) => {
        const currentFrame = gChartframe
            .webFrameMDefault()
            .margin({ right: 20 });

        const svg = d3
            .select(section)
            .append('div')
            .append('svg')
            .call(currentFrame);

        fixture(axis, svg, currentFrame);
    });
});
