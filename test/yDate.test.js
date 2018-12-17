/**
 * @file
 * Test suite for yDate
 *
 * @jest-environment node
 */

import pretty from "pretty";

// jest.setTimeout(20000);
// expect.extend({ toMatchImageSnapshot: global.toMatchImageSnapshot });

// beforeAll(global.build('yDate'));
// beforeEach(global.start);

// @TODO this is canonical AFAICT but it still renders off-plot for some reason
test.skip("left-aligned, default scales", async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: false,
            subtitle: "Left-aligned, default scales",
            title: "yDate test"
        };

        const svg = await window.d3.select(document.querySelector("svg"));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate yDate
        const yAxis = window
            .yDate()
            .plotDim([
                currentFrame.dimension().width,
                currentFrame.dimension().height
            ])
            .rem(currentFrame.rem())
            .minorTickSize(currentFrame.rem() * 0.3)
            .range([0, currentFrame.dimension().height])
            .align("left")
            .frameName("webMDefault");

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
                `translate(${Math.round(
                    yAxis.tickSize() - yAxis.labelWidth()
                )}, 0)`
            );

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
                    `transform(${Math.round(x)}, ${Math.round(y)})`
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

test.skip("right-aligned, default scales", async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: false,
            subtitle: "Right-aligned, default scales",
            title: "yDate test"
        };

        const svg = await window.d3.select(document.querySelector("svg"));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate yDate
        const yAxis = window
            .yDate()
            .plotDim([
                currentFrame.dimension().width,
                currentFrame.dimension().height
            ])
            .minorTickSize(currentFrame.rem() * 0.3)
            .range([0, currentFrame.dimension().height])
            .align("right")
            .rem(currentFrame.rem())
            .frameName("webMDefault");

        // Set up yAxis
        currentFrame.plot().call(yAxis);

        // Get newly-calculated margin value
        const newMargin = yAxis.labelWidth() + currentFrame.margin().right;

        // Use newMargin redefine the new margin and range of xAxis
        currentFrame.margin({ right: newMargin });

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
                    `transform(${Math.round(x)}, ${Math.round(y)})`
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
