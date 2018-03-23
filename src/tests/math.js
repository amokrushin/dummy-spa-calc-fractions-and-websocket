import test from 'tape';
import { yard, rpn, calcFractions } from '../libs/math';

test('yard =1+2*3', (t) => {
    const expr = [
        { type: 'operand', value: [1, 1] },
        { type: 'operator', value: '+' },
        { type: 'operand', value: [2, 1] },
        { type: 'operator', value: '*' },
        { type: 'operand', value: [3, 1] },
    ];

    const actual = yard(expr);
    const expected = [
        { type: 'operand', value: [1, 1] },
        { type: 'operand', value: [2, 1] },
        { type: 'operand', value: [3, 1] },
        { type: 'operator', value: '*' },
        { type: 'operator', value: '+' },
    ];
    t.deepEqual(actual, expected, 'result match');
    t.end();
});

test('yard =1*(2+3)', (t) => {
    const expr = [
        { type: 'operand', value: [1, 1] },
        { type: 'operator', value: '*' },
        { type: 'parenthesis', value: '(' },
        { type: 'operand', value: [2, 1] },
        { type: 'operator', value: '+' },
        { type: 'operand', value: [3, 1] },
        { type: 'parenthesis', value: ')' },
    ];

    const actual = yard(expr);
    const expected = [
        { type: 'operand', value: [1, 1] },
        { type: 'operand', value: [2, 1] },
        { type: 'operand', value: [3, 1] },
        { type: 'operator', value: '+' },
        { type: 'operator', value: '*' },
    ];
    t.deepEqual(actual, expected, 'result match');
    t.end();
});


test('yard =1+2*3*(1+1)', (t) => {
    const expr = [
        { type: 'operand', value: [1, 1] },
        { type: 'operator', value: '+' },
        { type: 'operand', value: [2, 1] },
        { type: 'operator', value: '*' },
        { type: 'operand', value: [3, 1] },
        { type: 'operator', value: '*' },
        { type: 'parenthesis', value: '(' },
        { type: 'operand', value: [1, 1] },
        { type: 'operator', value: '+' },
        { type: 'operand', value: [1, 1] },
        { type: 'parenthesis', value: ')' },
    ];

    const actual = yard(expr);
    const expected = [
        { type: 'operand', value: [1, 1] },
        { type: 'operand', value: [2, 1] },
        { type: 'operand', value: [3, 1] },
        { type: 'operator', value: '*' },
        { type: 'operand', value: [1, 1] },
        { type: 'operand', value: [1, 1] },
        { type: 'operator', value: '+' },
        { type: 'operator', value: '*' },
        { type: 'operator', value: '+' },
    ];
    t.deepEqual(actual, expected, 'result match');
    t.end();
});

test('rpn =1+2*3', (t) => {
    const expr = [
        { type: 'operand', value: [1, 1] },
        { type: 'operand', value: [2, 1] },
        { type: 'operand', value: [3, 1] },
        { type: 'operator', value: '*' },
        { type: 'operator', value: '+' },
    ];

    const actual = rpn(expr, calcFractions);

    const expected = { s: 1, n: 7, d: 1 };

    t.deepEqual(actual, expected, 'result match');
    t.end();
});

test('rpn =1*(2+3)', (t) => {
    const expr = [
        { type: 'operand', value: [1, 1] },
        { type: 'operand', value: [2, 1] },
        { type: 'operand', value: [3, 1] },
        { type: 'operator', value: '+' },
        { type: 'operator', value: '*' },
    ];

    const actual = rpn(expr, calcFractions);

    const expected = { s: 1, n: 5, d: 1 };

    t.deepEqual(actual, expected, 'result match');
    t.end();
});

test('rpn =1+2*3*(1+1)', (t) => {
    const expr = [
        { type: 'operand', value: [1, 1] },
        { type: 'operand', value: [2, 1] },
        { type: 'operand', value: [3, 1] },
        { type: 'operator', value: '*' },
        { type: 'operand', value: [1, 1] },
        { type: 'operand', value: [1, 1] },
        { type: 'operator', value: '+' },
        { type: 'operator', value: '*' },
        { type: 'operator', value: '+' },
    ];

    const actual = rpn(expr, calcFractions);

    const expected = { s: 1, n: 13, d: 1 };

    t.deepEqual(actual, expected, 'result match');
    t.end();
});

test('rpn =5/3-1/3', (t) => {
    const expr = [
        { type: 'operand', value: [5, 3] },
        { type: 'operand', value: [1, 3] },
        { type: 'operator', value: '-' }
    ];

    const actual = rpn(expr, calcFractions);

    const expected = { s: 1, n: 4, d: 3 };

    t.deepEqual(actual, expected, 'result match');
    t.end();
});
