export const enum OpType {
    BIN_OPERATION = 'BinaryOperation',
    CONST_OPERATION = 'ConstOperation',
}

export const enum Op {
    OR = "OR",
    XOR = "XOR",
    AND = "AND",
    NOT = "NOT",
    NOOP = "NOOP",
}

export enum ShiftDir { LEFT = 'LEFT', RIGHT ='RIGHT' };

export function renderDirection(dir: ShiftDir) {
  if (dir === ShiftDir.LEFT) return "<<";
  if (dir === ShiftDir.RIGHT) return ">>";
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

export const ONE: Digit[]  = intToDigits(1);
export const ZERO: Digit[] = intToDigits(0);

export interface OperandState {
  originalBits: Digit[]
  bits: Digit[];
  shift: number;
}
