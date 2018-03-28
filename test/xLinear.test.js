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
        input: `${__dirname}/../src/xLinear.js`,
        external: [
            'd3',
        ],
    });

    const output = await bundle.generate({
        format: 'umd',
        name: 'xLinear',
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

test('xLinear()', async () => {
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

    const image = await page.screenshot();
    await browser.close();

    expect(image).toMatchImageSnapshot();
});
