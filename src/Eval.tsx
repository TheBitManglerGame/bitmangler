import { Digit, digitsToInt, Op, intToDigits } from "./Common";

export function evalExpr(inBits: Digit[], constOperand: Digit[]|null, op: Op): Digit[] {
    if (op === Op.NOOP) {
        console.debug("[DEBUG]: eval: NOOP, returning inBits");
        return inBits;
    }

    if (op === Op.NOT) {
        const an = digitsToInt(inBits);
        console.debug("[DEBUG]: eval NOT: result: ", an);
        return (~an >>> 0).toString(2).slice(-8).padStart(8, '0').split('').map(n => parseInt(n) as Digit);
    }

    if (constOperand  === null) {
        console.debug("[DEBUG] eval: Const operand not present, returning inBits", inBits);
        return inBits;
    }

    const an = digitsToInt(inBits);
    const bn = digitsToInt(constOperand);
    let res: Digit[];
    switch (op) {
        case Op.OR:     { res = intToDigits(an | bn); break; }
        case Op.AND:    { res = intToDigits(an & bn); break; }
        case Op.XOR:    { res = intToDigits(an ^ bn); break; }
        case Op.SHIFTL: { res = intToDigits(an << bn); break; }
        case Op.SHIFTR: { res = intToDigits(an >> bn); break; }
        default: {
            console.error("applybinOp: unexpected op", op);
            res = [];
        }
    }
    console.debug("[DEBUG]: eval: result: ", res);
    return res;
}
