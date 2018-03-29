/**
 * @file
 * Test environment for g-axis
 *
 * This sets up and tears down Puppeteer, along with Micro
 */

/* eslint-disable no-console */

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
        <link rel="stylesheet" href="https://ig.ft.com/visual-vocabulary/styles.css">
        <link rel="stylesheet" href="//www.ft.com/__origami/service/build/v2/bundles/css?modules=o-fonts@^2.2.0">
        <script>${this.code}</script>
        </head>
        <body><svg /></body>
        </html>`);

        try {
            this.url = await listen(this.server);

            this.browser = await launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-font-antialiasing'] });
            this.global.page = await this.browser.newPage();

            await this.global.page.goto(this.url, { waitUntil: 'networkidle2' });
        } catch (e) {
            console.error(e);

            try {
                this.server.close();
            } catch (ee) {
                console.error('Couldn\'t kill server!');
                console.error(ee);
            }
        }
    }

    async teardown() {
        try {
            await this.browser.close();
        } catch (e) {
            console.error('Issue with closing browser');
            console.error(e);
        }

        try {
            await this.server.close();
        } catch (e) {
            console.error('Issue with killing server');
            console.error(e);
        }

        await super.teardown();
    }

    runScript(script) {
        return super.runScript(script);
    }
}

module.exports = CustomEnvironment;
