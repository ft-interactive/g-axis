const tape = require('tape'); // eslint-disable-line
const foo = require('../');

tape('foo() returns the answer to the ultimate question of life, the universe, and everything.', (test) => {
	test.equal(foo.foo(), 42);
	test.end();
});
