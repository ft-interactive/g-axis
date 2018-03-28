/**
 * @file
 * Test suite for xDate
 */
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import listen from 'test-listen';
import micro from 'micro';
import { launch } from 'puppeteer';
import { rollup } from 'rollup';

expect.extend({ toMatchImageSnapshot });

let server;
let url;
let code;

beforeAll(async () => {
    const bundle = await rollup({
        input: `${__dirname}/../src/yLinear.js`,
        external: [
            'd3',
        ],
    });

    const output = await bundle.generate({
        format: 'umd',
        name: 'yLinear',
        globals: {
            d3: 'd3',
        },
    });

    code = output.code;
});

beforeEach(async () => {
    server = micro(async () => `<!doctype html>
    <html>
    <head>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.js"></script>
    <script src="https://unpkg.com/g-chartframe@5.1.12/build/g-chartframe.js"></script>
    <script>${code}</script>
    </head>
    <body><svg /></body>
    </html>`);
    url = await listen(server);
});

afterEach(() => server.close());

test('yLinear()', async () => {
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Add xDate
    await page.addScriptTag({
        content: code,
    });

    await page.evaluate(async () => {
        const sharedConfig = {
            source: 'g-axis',
            subtitle: 'Left-aligned, default scales',
            title: 'yLinear test',
        };

        const svg = window.d3.select(document.querySelector('svg'));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig);

        // Set up the chart frame
        svg.call(currentFrame);

        // Instantiate yLinear
        const yAxis = window.yLinear()
            .plotDim([currentFrame.dimension().width, currentFrame.dimension().height])
            .tickSize(currentFrame.dimension().width)
            .domain([0, 200])
            .align('left')
            .range([currentFrame.dimension().height, 0])
            .frameName('webFrameMDefault');

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

    const image = await page.screenshot();
    await browser.close();

    expect(image).toMatchImageSnapshot();
});
