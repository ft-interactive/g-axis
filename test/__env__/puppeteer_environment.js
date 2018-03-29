/**
 * @file
 * Test environment for g-axis
 *
 * This sets up and tears down Puppeteer, along with Micro
 */

const NodeEnvironment = require('jest-environment-node');
const listen = require('test-listen');
const micro = require('micro');
const { launch } = require('puppeteer');
const { rollup } = require('rollup');

class CustomEnvironment extends NodeEnvironment {
    async setup() {
        await super.setup();

        this.global.build = this.generateCode.bind(this);
        this.global.start = this.startServer.bind(this);
    }

    generateCode(axis) {
        return async () => {
            const bundle = await rollup({
                input: `${__dirname}/../../src/${axis}.js`,
                external: [
                    'd3',
                ],
            });

            const output = await bundle.generate({
                format: 'umd',
                name: axis,
                globals: {
                    d3: 'd3',
                },
            });

            this.code = output.code;
        };
    }

    async startServer() {
        this.server = micro(async () => `<!doctype html>
        <html>
        <head>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.js"></script>
        <script src="https://unpkg.com/g-chartframe@5.1.12/build/g-chartframe.js"></script>
        <script>${this.code}</script>
        </head>
        <body><svg /></body>
        </html>`);

        this.url = await listen(this.server);

        this.browser = await launch();
        this.global.page = await this.browser.newPage();

        await this.global.page.goto(this.url);
    }

    async teardown() {
        await this.browser.close();
        await this.server.close();
        await super.teardown();
    }

    runScript(script) {
        return super.runScript(script);
    }
}

module.exports = CustomEnvironment;
