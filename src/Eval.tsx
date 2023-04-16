import { type Digit, digitsToInt, Op, intToDigits } from './Common'

export function evalExpr (inBits: Digit[], constOperand: Digit[] | null, op: Op): Digit[] {
  if (op === Op.NOOP) {
    return inBits
  }

  if (op === Op.NOT) {
    const an = digitsToInt(inBits)
    return (~an >>> 0).toString(2).slice(-8).padStart(8, '0').split('').map(n => parseInt(n) as Digit)
  }

  if (constOperand === null) {
    return inBits
  }

  const an = digitsToInt(inBits)
  const bn = digitsToInt(constOperand)
  let res: Digit[]
  switch (op) {
    case Op.OR: { res = intToDigits(an | bn); break }
    case Op.AND: { res = intToDigits(an & bn); break }
    case Op.XOR: { res = intToDigits(an ^ bn); break }
    default: {
      console.error('applybinOp: unexpected op', op)
      res = []
    }
  }
  return res
}
export function evalShift (bits: Digit[], shiftAmount: number): Digit[] {
  if (shiftAmount === 0) {
    return bits
  }

  const isLeftShift = shiftAmount < 0
  const absShiftAmount = Math.abs(shiftAmount)

  if (isLeftShift) {
    return [...bits.slice(absShiftAmount), ...Array(absShiftAmount).fill(0)]
  } else {
    return [...Array(absShiftAmount).fill(0), ...bits.slice(0, 8 - absShiftAmount)]
  }
}
