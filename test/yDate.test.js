/**
 * @file
 * Test suite for yDate
 *
 * @jest-environment node
 */
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

// beforeAll(global.build('yDate'));
// beforeEach(global.start);

// @TODO this is canonical AFAICT but it still renders off-plot for some reason
test.skip('left-aligned, default scales', async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: 'g-axis',
            subtitle: 'Left-aligned, default scales',
            title: 'yDate test',
        };

        const svg = await window.d3.select(document.querySelector('svg'));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate yDate
        const yAxis = window.yDate()
            .plotDim([currentFrame.dimension().width, currentFrame.dimension().height])
            .rem(currentFrame.rem())
            .minorTickSize(currentFrame.rem() * 0.3)
            .range([0, currentFrame.dimension().height])
            .align('left')
            .frameName('webMDefault');

        // Set up yAxis
        currentFrame.plot().call(yAxis);

        // Get newly-calculated margin value
        const newMargin = yAxis.labelWidth() + currentFrame.margin().left;

        // Use newMargin redefine the new margin and range of xAxis
        currentFrame.margin({ left: newMargin });

        // Translate axis from the left
        yAxis.yLabel().attr('transform', `translate(${(yAxis.tickSize() - yAxis.labelWidth())}, 0)`);

        // Call parent container to update positioning
        svg.call(currentFrame);
    });

    const image = await global.page.screenshot();
    expect(image).toMatchImageSnapshot();
});

test.skip('right-aligned, default scales', async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: 'g-axis',
            subtitle: 'Right-aligned, default scales',
            title: 'yDate test',
        };

        const svg = await window.d3.select(document.querySelector('svg'));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate yDate
        const yAxis = window.yDate()
            .plotDim([currentFrame.dimension().width, currentFrame.dimension().height])
            .minorTickSize(currentFrame.rem() * 0.3)
            .range([0, currentFrame.dimension().height])
            .align('right')
            .rem(currentFrame.rem())
            .frameName('webMDefault');

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
