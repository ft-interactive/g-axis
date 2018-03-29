/**
 * @file
 * Test suite for yOrdinal
 */

import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

beforeAll(global.build('yOrdinal'));
beforeEach(global.start);

test('left-aligned, default scales', async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: 'g-axis',
            subtitle: 'Left-aligned, default scales',
            title: 'yOrdinal test',
        };

        const svg = await window.d3.select(document.querySelector('svg'));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate yOrdinal
        const yAxis = window.yOrdinal()
            .rangeRound([0, currentFrame.dimension().height])
            .plotDim([currentFrame.dimension().width, currentFrame.dimension().height])
            .frameName('webFrameMDefault')
            .align('left');

        // Set up yAxis
        currentFrame.plot().call(yAxis);

        // Get newly-calculated margin value
        const newMargin = yAxis.labelWidth() + currentFrame.margin().left;

        // Use newMargin redefine the new margin and range of xAxis
        currentFrame.margin({ left: newMargin });

        // Call parent container to update positioning
        svg.call(currentFrame);
    });

    const image = await global.page.screenshot();
    expect(image).toMatchImageSnapshot();
});

test('right-aligned, default scales', async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: 'g-axis',
            subtitle: 'Right-aligned, default scales',
            title: 'yOrdinal test',
        };

        const svg = await window.d3.select(document.querySelector('svg'));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate yOrdinal
        const yAxis = window.yOrdinal()
            .rangeRound([0, currentFrame.dimension().height])
            .plotDim([currentFrame.dimension().width, currentFrame.dimension().height])
            .frameName('webFrameMDefault')
            .align('right');

        // Set up yAxis
        currentFrame.plot().call(yAxis);

        // Get newly-calculated margin value
        const newMargin = yAxis.labelWidth() + currentFrame.margin().right;

        // Use newMargin redefine the new margin and range of xAxis
        currentFrame.margin({ right: newMargin });

        // Call parent container to update positioning
        svg.call(currentFrame);
    });

    const image = await global.page.screenshot();
    expect(image).toMatchImageSnapshot();
});
