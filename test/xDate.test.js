/**
 * @file
 * Test suite for xDate
 */
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

beforeAll(global.build('xDate'));
beforeEach(global.start);

test('bottom-aligned, default scales', async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: 'g-axis',
            subtitle: 'Bottom-aligned, default scales',
            title: 'xDate test',
        };

        const svg = await window.d3.select(document.querySelector('svg'));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate xDate
        const xAxis = window.xDate()
            .plotDim([currentFrame.dimension().width, currentFrame.dimension().height])
            .frameName('webFrameMDefault')
            .align('bottom')
            .tickSize(currentFrame.rem() * 0.75)
            .range([0, currentFrame.dimension().width])
            .minorTickSize(currentFrame.rem() * 0.3);

        // Set up xAxis
        currentFrame.plot().call(xAxis);

        // Translate axis to bottom of plot
        xAxis.xLabel().attr('transform', `translate(0,${currentFrame.dimension().height})`);
        xAxis.xLabelMinor().attr('transform', `translate(0,${currentFrame.dimension().height})`);
    });

    const image = await global.page.screenshot();

    expect(image).toMatchImageSnapshot();
});

test('top-aligned, default scales', async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: 'g-axis',
            subtitle: 'Top-aligned, default scales',
            title: 'xDate test',
        };

        const svg = await window.d3.select(document.querySelector('svg'));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate xDate
        const xAxis = window.xDate()
            .plotDim([currentFrame.dimension().width, currentFrame.dimension().height])
            .frameName('webFrameMDefault')
            .align('top')
            .tickSize(currentFrame.rem() * 0.75)
            .range([0, currentFrame.dimension().width])
            .minorTickSize(currentFrame.rem() * 0.3);

        // Set up xAxis
        currentFrame.plot().call(xAxis);
    });

    const image = await global.page.screenshot();
    expect(image).toMatchImageSnapshot();
});
