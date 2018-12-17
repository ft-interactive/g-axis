/**
 * @file
 * Test suite for xLinear
 */

import pretty from "pretty";

jest.setTimeout(20000);

beforeAll(global.build("xLinear"));
beforeEach(global.start);

test("bottom-aligned, default scales", async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: false,
            subtitle: "Bottom-aligned, default scales",
            title: "xLinear test"
        };

        const svg = await window.d3.select(document.querySelector("svg"));
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
                currentFrame.dimension().height
            ])
            .rem(currentFrame.rem())
            .tickSize(currentFrame.rem())
            .align("bottom")
            .frameName("webFrameMDefault");

        // Set up xAxis
        currentFrame.plot().call(xAxis);

        // Translate axis to bottom of plot
        xAxis
            .xLabel()
            .attr(
                "transform",
                `translate(0,${Math.round(currentFrame.dimension().height)})`
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

test("top-aligned, default scales", async () => {
    await global.page.evaluate(async () => {
        const sharedConfig = {
            source: false,
            subtitle: "Top-aligned, default scales",
            title: "xLinear test"
        };

        const svg = await window.d3.select(document.querySelector("svg"));
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
                currentFrame.dimension().height
            ])
            .rem(currentFrame.rem())
            .tickSize(currentFrame.rem())
            .range([0, currentFrame.dimension().width])
            .align("top")
            .frameName("webFrameMDefault");

        // Set up xAxis
        currentFrame.plot().call(xAxis);
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
