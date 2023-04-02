export const enum OpType {
    BIN_OPERATION = 'BinaryOperation',
    CONST_OPERATION = 'ConstOperation',
}

export const enum Op {
    SHIFTL = "SHIFTL",
    SHIFTR = "SHIFTR",
    OR = "OR",
    XOR = "XOR",
    AND = "AND",
    NOT = "NOT",
    NOOP = "NOOP",
}

export type Digit = 0 | 1;

function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export function intToDigits(num:number): Digit[] {
    return num.toString(2).padStart(8, '0').split('').map(n => parseInt(n) as Digit);
}

export function digitsToInt(inBits: Digit[]) {
  assert(inBits.length === 8, 'Input array must have exactly 8 elements');
    return Number.parseInt(inBits.join(''), 2);
}

export const ONE: Digit[] = intToDigits(1);
export const ZERO: Digit[] = intToDigits(0);
