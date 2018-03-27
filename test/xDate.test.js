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
        input: `${__dirname}/../src/xDate.js`,
        external: [
            'd3',
        ],
    });

    const output = await bundle.generate({
        format: 'umd',
        name: 'xDate',
        globals: {
            d3: 'd3',
        },
    });

    code = output.code;
});

beforeEach(async () => {
    server = micro(async () => `<!doctype html><html><head><script src="http://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.js"></script><script>${code}</script></head><body><svg /></body></html>`);
    url = await listen(server);
});

afterEach(() => server.close());

test('xDate()', async () => {
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Add xDate
    await page.addScriptTag({
        content: code,
    });

    await page.evaluate(async () => {
        const svg = await window.d3.select(document.querySelector('svg'));
        const myScale = window.xDate();
        svg.call(myScale);
    });

    const image = await page.screenshot();
    await browser.close();

    expect(image).toMatchImageSnapshot();
});
