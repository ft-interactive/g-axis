/**
 * @file
 * Test suite for xOrdinal
 */

import pretty from "pretty";

jest.setTimeout(20000);

beforeAll(global.build("xOrdinal"));
beforeEach(global.start);

test("bottom-aligned, default scales", async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: false,
            subtitle: "Bottom-aligned, default scales",
            title: "xOrdinal test"
        };

        const svg = await window.d3.select(document.querySelector("svg"));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate xAxis
        const xAxis = window
            .xOrdinal()
            .plotDim([
                currentFrame.dimension().width,
                currentFrame.dimension().height
            ])
            .rangeRound([0, currentFrame.dimension().width])
            .align("bottom")
            .rem(currentFrame.rem())
            .frameName("webFrameMDefault");

        // Set up xAxis
        currentFrame.plot().call(xAxis);

        // Translate to bottom of plot
        xAxis
            .xLabel()
            .attr(
                "transform",
                `translate(0,${Math.round(
                    currentFrame.dimension().height - currentFrame.rem() / 1.5
                )})`
            );
    });

    const snap = await global.page.evaluate(
        () => document.querySelector("g.chart-plot").innerHTML
    );
    expect(pretty(snap)).toMatchSnapshot();
});

test("top-aligned, default scales", async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: false,
            subtitle: "Top-aligned, default scales",
            title: "xOrdinal test"
        };

        const svg = await window.d3.select(document.querySelector("svg"));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate xAxis
        const xAxis = window
            .xOrdinal()
            .plotDim([
                currentFrame.dimension().width,
                currentFrame.dimension().height
            ])
            .rem(currentFrame.rem())
            .rangeRound([0, currentFrame.dimension().width])
            .align("top")
            .frameName("webFrameMDefault");

        // Set up xAxis
        currentFrame.plot().call(xAxis);
    });

    const snap = await global.page.evaluate(
        () => document.querySelector("g.chart-plot").innerHTML
    );
    expect(pretty(snap)).toMatchSnapshot();
});
