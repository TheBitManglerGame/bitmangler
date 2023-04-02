import { Digit, digitsToInt, Op, intToDigits } from "./Common";

export function evalExpr(inBits: Digit[], constOperand: Digit[]|null, op: Op): Digit[] {
    if (op === Op.NOOP) {
        console.log("[DEBUG]: eval: NOOP, returning inBits");
        return inBits;
    }
    if (constOperand  === null) {
        console.log("[DEBUG] eval: Const operand not present, returning inBits", inBits);
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
        case Op.NOT:    { res = intToDigits(~an); break; }
        default: {
            console.error("applybinOp: unexpected op", op);
            res = [];
        }
    }
    console.log("[DEBUG]: eval: result: ", res);
    return res;
}
