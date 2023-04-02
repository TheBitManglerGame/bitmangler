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

export function prepare(num:number): Digit[] {
  return num.toString(2).padStart(8, '0').split('').map(n => parseInt(n) as Digit);
}
