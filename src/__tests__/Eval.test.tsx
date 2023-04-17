import { evalExpr, evalShift } from '../Eval'
import { Op, intToDigits } from '../Common'

describe('Evaluator', () => {
  test('evalExpr', () => {
    const inBits = intToDigits(42)
    const constOperand = intToDigits(7)

    const noopResult = evalExpr(inBits, constOperand, Op.NOOP)
    expect(noopResult).toEqual(inBits)

    const notResult = evalExpr(inBits, constOperand, Op.NOT)
    expect(notResult).toEqual(intToDigits(~42 & 0xff))

    const orResult = evalExpr(inBits, constOperand, Op.OR)
    expect(orResult).toEqual(intToDigits(42 | 7))

    const andResult = evalExpr(inBits, constOperand, Op.AND)
    expect(andResult).toEqual(intToDigits(42 & 7))

    const xorResult = evalExpr(inBits, constOperand, Op.XOR)
    expect(xorResult).toEqual(intToDigits(42 ^ 7))
  })

  test('evalShift', () => {
    const bits = intToDigits(42)

    const noShiftResult = evalShift(bits, 0)
    expect(noShiftResult).toEqual(bits)

    const leftShiftResult = evalShift(bits, -2)
    expect(leftShiftResult).toEqual(intToDigits(42 << 2))

    const rightShiftResult = evalShift(bits, 3)
    expect(rightShiftResult).toEqual(intToDigits(42 >>> 3))
  })
})
