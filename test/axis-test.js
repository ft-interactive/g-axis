const tape = require('tape'); // eslint-disable-line
const axis = require('../');

tape('foo() returns the answer to the ultimate question of life, the universe, and everything.', (test) => {
	test.equal(axis.yOrdinal().labelWidth(), 0);
	test.equal(axis.xLinearl().xAxisHighlight(), 0);
	test.end();
});
