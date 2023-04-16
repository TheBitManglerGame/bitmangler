import {
  BinOperation,
  ExprType,
  ShiftDirection,
  VALUE_EXPR,
  NOT_EXPR,
  BIN_APP_EXPR,
  SHIFT_EXPR,
  prettyPrint,
  evaluate,
  exprEquals,
  exprScore,
  unwindStackToExpr
} from '../Expr'

describe('Expr Module', () => {
  test('VALUE_EXPR', () => {
    const valueExpr = VALUE_EXPR(5)
    expect(valueExpr.exprType).toBe(ExprType.Value)
    if (valueExpr.exprType === ExprType.Value) {
      expect(valueExpr.value).toBe(5)
    }
  })

  test('NOT_EXPR', () => {
    const valueExpr = VALUE_EXPR(5)
    const notExpr = NOT_EXPR(valueExpr)
    expect(notExpr.exprType).toBe(ExprType.Not)
    if (notExpr.exprType === ExprType.Not) {
      expect(notExpr.expr).toEqual(valueExpr)
    }
  })

  test('BIN_APP_EXPR', () => {
    const valueExpr1 = VALUE_EXPR(5)
    const valueExpr2 = VALUE_EXPR(3)
    const binAppExpr = BIN_APP_EXPR(BinOperation.AND, valueExpr1, valueExpr2)
    expect(binAppExpr.exprType).toBe(ExprType.BinApp)
    if (binAppExpr.exprType === ExprType.BinApp) {
      expect(binAppExpr.binOp).toBe(BinOperation.AND)
      expect(binAppExpr.expr1).toEqual(valueExpr1)
      expect(binAppExpr.expr2).toEqual(valueExpr2)
    }
  })

  test('SHIFT_EXPR', () => {
    const valueExpr = VALUE_EXPR(3)

    expect(() => SHIFT_EXPR(-8, valueExpr)).toThrow('SHIFT_EXPR: invalid shift value')
    expect(() => SHIFT_EXPR(8, valueExpr)).toThrow('SHIFT_EXPR: invalid shift value')

    expect(SHIFT_EXPR(0, valueExpr)).toEqual(valueExpr)

    const shiftLeftExpr = SHIFT_EXPR(-3, valueExpr)
    expect(shiftLeftExpr.exprType).toBe(ExprType.Shift)
    if (shiftLeftExpr.exprType === ExprType.Shift) {
      expect(shiftLeftExpr.expr).toEqual(valueExpr)
      expect(shiftLeftExpr.dir).toBe(ShiftDirection.ShiftLeft)
      expect(shiftLeftExpr.shiftVal).toBe(3)
    }

    const shiftRightExpr = SHIFT_EXPR(3, valueExpr)
    expect(shiftRightExpr.exprType).toBe(ExprType.Shift)
    if (shiftRightExpr.exprType === ExprType.Shift) {
      expect(shiftRightExpr.expr).toEqual(valueExpr)
      expect(shiftRightExpr.dir).toBe(ShiftDirection.ShiftRight)
      expect(shiftRightExpr.shiftVal).toBe(3)
    }
  })

  test('prettyPrint', () => {
    const valueExpr = VALUE_EXPR(5)
    expect(prettyPrint(valueExpr)).toBe('00000101')

    const notExpr = NOT_EXPR(valueExpr)
    expect(prettyPrint(notExpr)).toBe('~00000101')

    const andExpr = BIN_APP_EXPR(BinOperation.AND, VALUE_EXPR(3), VALUE_EXPR(6))
    expect(prettyPrint(andExpr)).toBe('(00000011 & 00000110)')

    const orExpr = BIN_APP_EXPR(BinOperation.OR, VALUE_EXPR(3), VALUE_EXPR(6))
    expect(prettyPrint(orExpr)).toBe('(00000011 | 00000110)')

    const xorExpr = BIN_APP_EXPR(BinOperation.XOR, VALUE_EXPR(3), VALUE_EXPR(6))
    expect(prettyPrint(xorExpr)).toBe('(00000011 ^ 00000110)')

    const shiftLeftExpr = SHIFT_EXPR(-3, valueExpr)
    expect(prettyPrint(shiftLeftExpr)).toBe('(00000101 << 3)')

    const shiftRightExpr = SHIFT_EXPR(3, valueExpr)
    expect(prettyPrint(shiftRightExpr)).toBe('(00000101 >> 3)')

    const complexExpr = BIN_APP_EXPR(
      BinOperation.AND,
      NOT_EXPR(SHIFT_EXPR(2, VALUE_EXPR(3))),
      BIN_APP_EXPR(BinOperation.OR, SHIFT_EXPR(-1, VALUE_EXPR(6)), VALUE_EXPR(9))
    )
    expect(prettyPrint(complexExpr)).toBe('(~(00000011 >> 2) & ((00000110 << 1) | 00001001))')
  })

  test('evaluate', () => {
    const expr1 = VALUE_EXPR(0b1100)
    const expr2 = VALUE_EXPR(0b1010)
    const andExpr = BIN_APP_EXPR(BinOperation.AND, expr1, expr2)
    const orExpr = BIN_APP_EXPR(BinOperation.OR, expr1, expr2)
    const xorExpr = BIN_APP_EXPR(BinOperation.XOR, expr1, expr2)

    expect(evaluate(andExpr)).toBe(0b1000)
    expect(evaluate(orExpr)).toBe(0b1110)
    expect(evaluate(xorExpr)).toBe(0b0110)
  })

  test('exprEquals', () => {
    const valueExpr1 = VALUE_EXPR(5)
    const valueExpr2 = VALUE_EXPR(5)
    const valueExpr3 = VALUE_EXPR(7)

    expect(exprEquals(valueExpr1, valueExpr2)).toBe(true)
    expect(exprEquals(valueExpr1, valueExpr3)).toBe(false)

    const notExpr1 = NOT_EXPR(valueExpr1)
    const notExpr2 = NOT_EXPR(valueExpr1)
    const notExpr3 = NOT_EXPR(valueExpr3)

    expect(exprEquals(notExpr1, notExpr2)).toBe(true)
    expect(exprEquals(notExpr1, notExpr3)).toBe(false)

    const shiftLeftExpr1 = SHIFT_EXPR(-3, valueExpr1)
    const shiftLeftExpr2 = SHIFT_EXPR(-3, valueExpr1)
    const shiftLeftExpr3 = SHIFT_EXPR(-2, valueExpr1)

    expect(exprEquals(shiftLeftExpr1, shiftLeftExpr2)).toBe(true)
    expect(exprEquals(shiftLeftExpr1, shiftLeftExpr3)).toBe(false)

    const complexExpr1 = BIN_APP_EXPR(
      BinOperation.AND,
      NOT_EXPR(SHIFT_EXPR(2, VALUE_EXPR(3))),
      BIN_APP_EXPR(BinOperation.OR, SHIFT_EXPR(-1, VALUE_EXPR(6)), VALUE_EXPR(9))
    )

    const complexExpr2 = BIN_APP_EXPR(
      BinOperation.AND,
      NOT_EXPR(SHIFT_EXPR(2, VALUE_EXPR(3))),
      BIN_APP_EXPR(BinOperation.OR, SHIFT_EXPR(-1, VALUE_EXPR(6)), VALUE_EXPR(9))
    )

    const complexExpr3 = BIN_APP_EXPR(
      BinOperation.AND,
      NOT_EXPR(SHIFT_EXPR(2, VALUE_EXPR(3))),
      BIN_APP_EXPR(BinOperation.OR, SHIFT_EXPR(-1, VALUE_EXPR(7)), VALUE_EXPR(9))
    )

    expect(exprEquals(complexExpr1, complexExpr2)).toBe(true)
    expect(exprEquals(complexExpr1, complexExpr3)).toBe(false)
  })

  test('exprScore', () => {
    const valueExpr = VALUE_EXPR(5)
    const notExpr = NOT_EXPR(valueExpr)
    const shiftLeftExpr = SHIFT_EXPR(-3, valueExpr)
    const binAppExpr = BIN_APP_EXPR(BinOperation.AND, valueExpr, NOT_EXPR(shiftLeftExpr))

    expect(exprScore(valueExpr)).toBe(0)
    expect(exprScore(notExpr)).toBe(1)
    expect(exprScore(shiftLeftExpr)).toBe(1)

    // ValueExpr + NOT (1) + BinApp (2) + ShiftLeftExpr (1) = 4
    expect(exprScore(binAppExpr)).toBe(4)

    const complexExpr = BIN_APP_EXPR(
      BinOperation.AND,
      NOT_EXPR(SHIFT_EXPR(2, VALUE_EXPR(3))),
      BIN_APP_EXPR(BinOperation.OR, SHIFT_EXPR(-1, VALUE_EXPR(6)), VALUE_EXPR(9))
    )

    // ValueExpr (0) + NOT (1) + ShiftRight (1) + BinApp (2) + ShiftLeft (1) + BinApp (2) + ValueExpr (0) = 7
    expect(exprScore(complexExpr)).toBe(7)
  })

  test('unwindStackToExpr', () => {
    const valueExpr = VALUE_EXPR(5)
    const notExpr = NOT_EXPR(valueExpr)
    const shiftLeftExpr = SHIFT_EXPR(-3, valueExpr)
    const binAppExpr = BIN_APP_EXPR(BinOperation.AND, valueExpr, NOT_EXPR(shiftLeftExpr))

    const evaluationFrames1 = [VALUE_EXPR(5)]
    const evaluationFrames2 = [VALUE_EXPR(5), NOT_EXPR(VALUE_EXPR(5))]
    const evaluationFrames3 = [VALUE_EXPR(5), SHIFT_EXPR(-3, VALUE_EXPR(5))]
    const evaluationFrames4 = [
      VALUE_EXPR(5),
      BIN_APP_EXPR(BinOperation.AND, VALUE_EXPR(5), NOT_EXPR(SHIFT_EXPR(-3, VALUE_EXPR(5))))
    ]

    const result1 = unwindStackToExpr(evaluationFrames1)
    const result2 = unwindStackToExpr(evaluationFrames2)
    const result3 = unwindStackToExpr(evaluationFrames3)
    const result4 = unwindStackToExpr(evaluationFrames4)

    expect(exprEquals(result1, valueExpr)).toBe(true)
    expect(exprEquals(result2, notExpr)).toBe(true)
    expect(exprEquals(result3, shiftLeftExpr)).toBe(true)
    expect(exprEquals(result4, binAppExpr)).toBe(true)
  })
})
