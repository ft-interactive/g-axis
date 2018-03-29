/**
 * @file
 * Test suite for xLinear
 */
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

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

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate xLinear
        const xAxis = window.xLinear()
            .plotDim([currentFrame.dimension().width, currentFrame.dimension().height])
            .range([0, currentFrame.dimension().width])
            .frameName('webFrameMDefault');

        // Set up xAxis
        currentFrame.plot().call(xAxis);

        // Translate axis to bottom of plot
        xAxis.xLabel()
            .attr('transform',
                `translate(0,${currentFrame.dimension().height - (currentFrame.rem() / 1.5)})`);
    });

    const image = await global.page.screenshot();
    expect(image).toMatchImageSnapshot();
});

test('top-aligned, default scales', async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: 'g-axis',
            subtitle: 'Bottom-aligned, default scales',
            title: 'xLinear test',
        };

        const svg = await window.d3.select(document.querySelector('svg'));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate xLinear
        const xAxis = window.xLinear()
            .plotDim([currentFrame.dimension().width, currentFrame.dimension().height])
            .range([0, currentFrame.dimension().width])
            .frameName('webFrameMDefault');

        // Set up xAxis
        currentFrame.plot().call(xAxis);

        // Translate axis to bottom of plot
        xAxis.xLabel()
            .attr('transform',
                `translate(0,${currentFrame.dimension().height - (currentFrame.rem() / 1.5)})`);
    });

    const image = await global.page.screenshot();
    expect(image).toMatchImageSnapshot();
});
