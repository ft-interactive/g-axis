/**
 * @file
 * Test suite for xLinear
 */

import pretty from 'pretty';

jest.setTimeout(20000);

beforeAll(global.build('xLinear'));
beforeEach(global.start);

test('bottom-aligned, default scales', async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: 'g-axis',
            subtitle: 'Bottom-aligned, default scales',
            title: 'xLinear test',
        };

        const svg = await window.d3.select(document.querySelector('svg'));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Adds some margin to deal with the lack of a y-axis in test
        const newMargin = currentFrame.rem();
        currentFrame.margin({ right: newMargin });

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate xLinear
        const xAxis = window
            .xLinear()
            .range([0, currentFrame.dimension().width])
            .plotDim([
                currentFrame.dimension().width,
                currentFrame.dimension().height,
            ])
            .rem(currentFrame.rem())
            .tickSize(currentFrame.rem())
            .align('bottom')
            .frameName('webFrameMDefault');

        // Set up xAxis
        currentFrame.plot().call(xAxis);

        // Translate axis to bottom of plot
        xAxis
            .xLabel()
            .attr(
                'transform',
                `translate(0,${currentFrame.dimension().height})`,
            );
    });

    const bodyHTML = await global.page.evaluate(
        () => document.documentElement.innerHTML,
    );
    expect(pretty(bodyHTML)).toMatchSnapshot();
});

test('top-aligned, default scales', async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: 'g-axis',
            subtitle: 'Top-aligned, default scales',
            title: 'xLinear test',
        };

        const svg = await window.d3.select(document.querySelector('svg'));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Adds some margin to deal with the lack of a y-axis in test
        const newMargin = currentFrame.rem();
        currentFrame.margin({ right: newMargin });

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate xLinear
        const xAxis = window
            .xLinear()
            .plotDim([
                currentFrame.dimension().width,
                currentFrame.dimension().height,
            ])
            .rem(currentFrame.rem())
            .tickSize(currentFrame.rem())
            .range([0, currentFrame.dimension().width])
            .align('top')
            .frameName('webFrameMDefault');

        // Set up xAxis
        currentFrame.plot().call(xAxis);
    });

    const bodyHTML = await global.page.evaluate(
        () => document.documentElement.innerHTML,
    );
    expect(pretty(bodyHTML)).toMatchSnapshot();
});
