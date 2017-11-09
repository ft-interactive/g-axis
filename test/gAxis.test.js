import tape from 'tape';
import * as gAxis from '../index';

tape('gAxis exposes xLinear, yLinear and yOrdinal axes', (test) => {
    test.ok(gAxis.xDate, 'xDate exists');
    test.equal(typeof gAxis.xDate, 'function');

    test.ok(gAxis.xLinear, 'xLinear exists');
    test.equal(typeof gAxis.xLinear, 'function');

    test.ok(gAxis.xOrdinal, 'xOrdinal exists');
    test.equal(typeof gAxis.xOrdinal, 'function');

    test.ok(gAxis.xLinear, 'xLinear exists');
    test.equal(typeof gAxis.xLinear, 'function');

    test.ok(gAxis.yLinear, 'yLinear exists');
    test.equal(typeof gAxis.yLinear, 'function');

    test.ok(gAxis.yOrdinal, 'yOrdinal exists');
    test.equal(typeof gAxis.yOrdinal, 'function');

    test.end();
});
