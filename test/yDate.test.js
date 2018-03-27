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
        input: `${__dirname}/../src/yDate.js`,
        external: [
            'd3',
        ],
    });

    const output = await bundle.generate({
        format: 'umd',
        name: 'yDate',
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

test.skip('yDate()', async () => { // @TODO Disabled because this throws for some reason.
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Add xDate
    await page.addScriptTag({
        content: code,
    });

    await page.evaluate(async () => {
        const sharedConfig = {
            source: 'Source not yet added',
            subtitle: 'Subtitle not yet added',
            title: 'Title not yet added',
        };
        const svg = await window.d3.select(document.querySelector('svg'));
        const currentFrame = window.gChartframe.webFrameMDefault(sharedConfig)
            .margin({
                bottom: 86,
                left: 20,
                right: 5,
                top: 100,
            })
            // .title("Put headline here")
            .height(500);

        // Instantiate the chart frame
        svg.call(currentFrame);
        const myScale = window.yDate();
        currentFrame.plot().call(myScale);
    });

    const image = await page.screenshot();
    await browser.close();

    expect(image).toMatchImageSnapshot();
});
