/**
 * @file
 * Basic unit tests for g-xAxis
 *
 * @jest-environment node
 */

import * as gAxis from '../index';

jest.setTimeout(20000);

test('package "main" exports necessary axes', () => {
    expect(gAxis.xDate).toBeDefined();
    expect(gAxis.xDate).toBeInstanceOf(Function);

    expect(gAxis.yDate).toBeDefined();
    expect(gAxis.yDate).toBeInstanceOf(Function);

    expect(gAxis.xLinear).toBeDefined();
    expect(gAxis.xLinear).toBeInstanceOf(Function);

    expect(gAxis.xOrdinal).toBeDefined();
    expect(gAxis.xOrdinal).toBeInstanceOf(Function);

    expect(gAxis.xLinear).toBeDefined();
    expect(gAxis.xLinear).toBeInstanceOf(Function);

    expect(gAxis.yLinear).toBeDefined();
    expect(gAxis.yLinear).toBeInstanceOf(Function);

    expect(gAxis.yOrdinal).toBeDefined();
    expect(gAxis.yOrdinal).toBeInstanceOf(Function);
});
