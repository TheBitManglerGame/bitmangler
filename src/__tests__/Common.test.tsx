import {
  Op,
  isBinOp,
  ShiftDir,
  renderDirection,
  genRandomTargetDest,
  assert,
  intToDigits,
  digitsToInt,
  digitsFromUrlParam,
  print8LSB,
  ONE,
  ZERO
} from '../Common'

describe('UI Helpers and Types', () => {
  test('isBinOp', () => {
    expect(isBinOp(Op.AND)).toBe(true)
    expect(isBinOp(Op.OR)).toBe(true)
    expect(isBinOp(Op.XOR)).toBe(true)
    expect(isBinOp(Op.NOT)).toBe(false)
    expect(isBinOp(Op.NOOP)).toBe(false)
  })

  test('renderDirection', () => {
    expect(renderDirection(ShiftDir.LEFT)).toBe('<<')
    expect(renderDirection(ShiftDir.RIGHT)).toBe('>>')
  })

  test('genRandomTargetDest', () => {
    const [target, dest] = genRandomTargetDest()
    expect(target.length).toBe(8)
    expect(dest.length).toBe(8)
    expect(target).not.toEqual(dest)
  })

  test('assert', () => {
    expect(() => { assert(true) }).not.toThrow()
    expect(() => { assert(false) }).toThrow('Assertion failed')
  })

  test('intToDigits and digitsToInt', () => {
    const num = 42
    const digits = intToDigits(num)
    expect(digits.length).toBe(8)
    expect(digitsToInt(digits)).toBe(num)
  })

  test('digitsFromUrlParam', () => {
    const urlParam = '01010101'
    const digits = digitsFromUrlParam(urlParam)
    expect(digits).toEqual([0, 1, 0, 1, 0, 1, 0, 1])

    const nullDigits = digitsFromUrlParam(null)
    expect(nullDigits).toBeNull()
  })

  test('print8LSB', () => {
    const num = 42
    expect(print8LSB(num)).toBe('00101010')
  })

  test('ONE and ZERO', () => {
    expect(ONE).toEqual([0, 0, 0, 0, 0, 0, 0, 1])
    expect(ZERO).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
  })
})
