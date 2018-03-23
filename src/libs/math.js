import Fraction from 'fraction.js';

// https://en.wikipedia.org/wiki/Shunting-yard_algorithm
// http://eddmann.com/posts/implementing-the-shunting-yard-algorithm-in-javascript/

export function yard(expr) {
    const ops = { '+': 1, '-': 1, '*': 2, '/': 2 };
    const peek = (a) => a[a.length - 1];
    const stack = [];
    const OPEN_PAREN = { type: 'parenthesis', value: '(', };
    const CLOSE_PAREN = { type: 'parenthesis', value: '(', };

    return expr
        .map((token) => {
            if (token.type === 'parenthesis' && token.value === '(') {
                return OPEN_PAREN;
            }
            if (token.type === 'parenthesis' && token.value === ')') {
                return CLOSE_PAREN;
            }
            return token;
        })
        .reduce((output, token) => {
            if (token.type === 'operand') {
                output.push(token);
            }

            if (token.type === 'operator' && token.value in ops) {
                while (
                    stack.length &&
                    peek(stack).value in ops &&
                    ops[token.value] <= ops[peek(stack).value]
                    ) {
                    output.push(stack.pop());
                }
                stack.push(token);
            }

            if (token === OPEN_PAREN) {
                stack.push(token);
            }

            if (token === CLOSE_PAREN) {
                while (stack.length && peek(stack) !== OPEN_PAREN) {
                    output.push(stack.pop());
                }
                stack.pop();
            }

            return output;
        }, [])
        .concat(stack.reverse());
}

export function rpn(expr, fn) {
    return expr.reduce((stack, token) => {
        if (token.type === 'operand') {
            stack.push(token);
        }
        if (token.type === 'operator') {
            stack.push({
                type: 'operand',
                value: fn(token.value, ...stack.splice(-2, 2).map(token => token.value)),
            });
        }
        return stack;
    }, [])[0].value;
}

export function calcFractions(operator, ...values) {
    const toFraction = v => v instanceof Fraction ? v : new Fraction(v);
    switch (operator) {
        case '+': {
            const a = toFraction(values[0]);
            const b = toFraction(values[1]);
            return a.add(b);
        }
        case '-': {
            const a = toFraction(values[0]);
            const b = toFraction(values[1]);
            return a.sub(b);
        }
        case '*': {
            const a = toFraction(values[0]);
            const b = toFraction(values[1]);
            return a.mul(b);
        }
        case '/': {
            const a = toFraction(values[0]);
            const b = toFraction(values[1]);
            return a.div(b);
        }
        default:
            throw new Error(`Unexpected operator ${operator}`);
    }
}
