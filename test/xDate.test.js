/**
 * @file
 * Test suite for xDate
 */

import pretty from 'pretty';

jest.setTimeout(20000);

beforeAll(global.build('xDate'));
beforeEach(global.start);

test('bottom-aligned, default scales', async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: false,
            subtitle: 'Bottom-aligned, default scales',
            title: 'xDate test',
        };

        const svg = await window.d3.select(document.querySelector('svg'));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate xDate
        const xAxis = window
            .xDate()
            .plotDim([
                currentFrame.dimension().width,
                currentFrame.dimension().height,
            ])
            .rem(currentFrame.rem())
            .frameName('webFrameMDefault')
            .align('bottom')
            .tickSize(Math.floor(currentFrame.rem() * 0.75))
            .range([0, Math.floor(currentFrame.dimension().width)])
            .minorTickSize(Math.floor(currentFrame.rem() * 0.3));

        // Set up xAxis
        currentFrame.plot().call(xAxis);

        // Translate axis to bottom of plot
        xAxis
            .xLabel()
            .attr(
                'transform',
                `translate(0,${Math.floor(currentFrame.dimension().height)})`,
            );
        xAxis
            .xLabelMinor()
            .attr(
                'transform',
                `translate(0,${Math.floor(currentFrame.dimension().height)})`,
            );
    });

    // Lame hack to deal with the unrounded numbers from d3-axis
    await global.page.evaluate(() =>
        [...document.querySelectorAll('[transform]')].forEach((el) => {
            const transform = el.getAttribute('transform');
            const [, x, y] = transform.match(
                /translate\s?\(([\d.]+),\s?([\d.]+)\)/,
            );
            if (x && y) {
                const updated = transform.replace(
                    /translate\s?\(([\d.]+),\s?([\d.]+)\)/,
                    `transform(${Math.floor(x)}, ${Math.floor(y)})`,
                );
                el.setAttribute('transform', updated);
            }
        }),
    );

    const snap = await global.page.evaluate(
        () => document.querySelector('g.chart-plot').innerHTML,
    );
    expect(pretty(snap)).toMatchSnapshot();
});

test('top-aligned, default scales', async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: false,
            subtitle: 'Top-aligned, default scales',
            title: 'xDate test',
        };

        const svg = await window.d3.select(document.querySelector('svg'));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate xDate
        const xAxis = window
            .xDate()
            .plotDim([
                currentFrame.dimension().width,
                currentFrame.dimension().height,
            ])
            .rem(currentFrame.rem())
            .frameName('webFrameMDefault')
            .align('top')
            .tickSize(Math.floor(currentFrame.rem() * 0.75))
            .range([0, Math.floor(currentFrame.dimension().width)])
            .minorTickSize(Math.floor(currentFrame.rem() * 0.3));

        // Set up xAxis
        currentFrame.plot().call(xAxis);
    });

    // Lame hack to deal with the unrounded numbers from d3-axis
    await global.page.evaluate(() =>
        [...document.querySelectorAll('[transform]')].forEach((el) => {
            const transform = el.getAttribute('transform');
            const [, x, y] = transform.match(
                /translate\s?\(([\d.]+),\s?([\d.]+)\)/,
            );
            if (x && y) {
                const updated = transform.replace(
                    /translate\s?\(([\d.]+),\s?([\d.]+)\)/,
                    `transform(${Math.floor(x)}, ${Math.floor(y)})`,
                );
                el.setAttribute('transform', updated);
            }
        }),
    );

    const snap = await global.page.evaluate(
        () => document.querySelector('g.chart-plot').innerHTML,
    );
    expect(pretty(snap)).toMatchSnapshot();
});
