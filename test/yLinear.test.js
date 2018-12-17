/**
 * @file
 * Test suite for yLinear
 */

import pretty from "pretty";

jest.setTimeout(20000);

beforeAll(global.build("yLinear"));
beforeEach(global.start);

test("left-aligned, default scales", async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: false,
            subtitle: "Left-aligned, default scales",
            title: "yLinear test"
        };

        const svg = window.d3.select(document.querySelector("svg"));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate yLinear
        const yAxis = window
            .yLinear()
            .plotDim([
                currentFrame.dimension().width,
                currentFrame.dimension().height
            ])
            .tickSize(currentFrame.dimension().width)
            .domain([0, 200])
            .align("left")
            .rem(currentFrame.rem())
            .range([currentFrame.dimension().height, 0])
            .frameName("webFrameMDefault");

        // Set up yAxis
        currentFrame.plot().call(yAxis);

        // Get newly-calculated margin value
        const newMargin = yAxis.labelWidth() + currentFrame.margin().left;

        // Use newMargin redefine the new margin and range of xAxis
        currentFrame.margin({ left: newMargin });

        // Translate axis from the left
        yAxis
            .yLabel()
            .attr(
                "transform",
                `translate(${Math.floor(
                    yAxis.tickSize() - yAxis.labelWidth()
                )}, 0)`
            );

        // Call parent container to update positioning
        svg.call(currentFrame);
    });

    const bodyHTML = await global.page.evaluate(
        () => document.documentElement.innerHTML
    );
    expect(pretty(bodyHTML)).toMatchSnapshot();
});

test("right-aligned, default scales", async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: false,
            subtitle: "Right-aligned, default scales",
            title: "yLinear test"
        };

        const svg = window.d3.select(document.querySelector("svg"));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate yLinear
        const yAxis = window
            .yLinear()
            .plotDim([
                currentFrame.dimension().width,
                currentFrame.dimension().height
            ])
            .tickSize(currentFrame.dimension().width - currentFrame.rem())
            .domain([0, 200])
            .rem(currentFrame.rem())
            .align("right")
            .range([currentFrame.dimension().height, 0])
            .frameName("webFrameMDefault");

        // Set up yAxis
        currentFrame.plot().call(yAxis);

        // Get newly-calculated margin value
        const newMargin = yAxis.labelWidth() + currentFrame.margin().right;

        // Use newMargin redefine the new margin and range of xAxis
        currentFrame.margin({ right: newMargin });

        // Call parent container to update positioning
        svg.call(currentFrame);
    });

    const bodyHTML = await global.page.evaluate(
        () => document.documentElement.innerHTML
    );
    expect(pretty(bodyHTML)).toMatchSnapshot();
});
