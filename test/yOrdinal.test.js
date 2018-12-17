/**
 * @file
 * Test suite for yOrdinal
 */

import pretty from "pretty";

jest.setTimeout(20000);

beforeAll(global.build("yOrdinal"));
beforeEach(global.start);

test("left-aligned, default scales", async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: false,
            subtitle: "Left-aligned, default scales",
            title: "yOrdinal test"
        };

        const svg = await window.d3.select(document.querySelector("svg"));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate yOrdinal
        const yAxis = window
            .yOrdinal()
            .rangeRound([0, currentFrame.dimension().height])
            .plotDim([
                currentFrame.dimension().width,
                currentFrame.dimension().height
            ])
            .frameName("webFrameMDefault")
            .rem(currentFrame.rem())
            .align("left");

        // Set up yAxis
        currentFrame.plot().call(yAxis);

        // Get newly-calculated margin value
        const newMargin = yAxis.labelWidth() + currentFrame.margin().left;

        // Use newMargin redefine the new margin and range of xAxis
        currentFrame.margin({ left: newMargin });

        // Call parent container to update positioning
        svg.call(currentFrame);
    });

    // Lame hack to deal with the unrounded numbers from d3-axis
    await global.page.evaluate(() => {
        [...document.querySelectorAll("[transform]")].map(el => {
            const transform = el.getAttribute("transform");
            const [, x, y] = transform.match(
                /translate\s?\(([\d.]+),\s?([\d.]+)\)/
            );
            if (x && y) {
                const updated = transform.replace(
                    /translate\s?\(([\d.]+),\s?([\d.]+)\)/,
                    `transform(${Math.floor(x)}, ${Math.floor(y)})`
                );
                el.setAttribute("transform", updated);
            }
        });
    });

    const snap = await global.page.evaluate(
        () => document.querySelector("g.chart-plot").innerHTML
    );
    expect(pretty(snap)).toMatchSnapshot();
});

test("right-aligned, default scales", async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: false,
            subtitle: "Right-aligned, default scales",
            title: "yOrdinal test"
        };

        const svg = await window.d3.select(document.querySelector("svg"));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate yOrdinal
        const yAxis = window
            .yOrdinal()
            .rangeRound([0, currentFrame.dimension().height])
            .plotDim([
                currentFrame.dimension().width,
                currentFrame.dimension().height
            ])
            .rem(currentFrame.rem())
            .frameName("webFrameMDefault")
            .align("right");

        // Set up yAxis
        currentFrame.plot().call(yAxis);

        // Get newly-calculated margin value
        const newMargin = yAxis.labelWidth() + currentFrame.margin().right;

        // Use newMargin redefine the new margin and range of xAxis
        currentFrame.margin({ right: newMargin });

        // Call parent container to update positioning
        svg.call(currentFrame);

        yAxis
            .yLabel()
            .attr(
                "transform",
                `translate(${Math.floor(
                    currentFrame.dimension().width - yAxis.labelWidth()
                )}, 0)`
            );
    });

    // Lame hack to deal with the unrounded numbers from d3-axis
    await global.page.evaluate(() => {
        [...document.querySelectorAll("[transform]")].map(el => {
            const transform = el.getAttribute("transform");
            const [, x, y] = transform.match(
                /translate\s?\(([\d.]+),\s?([\d.]+)\)/
            );
            if (x && y) {
                const updated = transform.replace(
                    /translate\s?\(([\d.]+),\s?([\d.]+)\)/,
                    `transform(${Math.floor(x)}, ${Math.floor(y)})`
                );
                el.setAttribute("transform", updated);
            }
        });
    });

    const snap = await global.page.evaluate(
        () => document.querySelector("g.chart-plot").innerHTML
    );
    expect(pretty(snap)).toMatchSnapshot();
});
