const tape = require('tape'); // eslint-disable-line
const gAxis = require('../');

tape('gAxis exposes xLinear, yLinear and yOrdinal axes', (test) => {
	test.ok(gAxis.xLinear, 'xLinear exists');
	test.equal(typeof gAxis.xLinear, 'function');

	test.ok(gAxis.yLinear, 'yLinear exists');
	test.equal(typeof gAxis.yLinear, 'function');

	test.ok(gAxis.yOrdinal, 'yOrdinal exists');
	test.equal(typeof gAxis.yOrdinal, 'function');

	test.end();
});
