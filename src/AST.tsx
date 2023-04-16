
export enum BinOperation { AND, OR, XOR }
export enum ExprType { BinApp, Not, Shift, Value }
export enum ShiftDirection { ShiftLeft, ShiftRight }

export type ShiftVal = 1 | 2 | 3 | 4 | 5 | 6 | 7

function valueToDirection (value: number): ShiftDirection {
  if (value < 0) return ShiftDirection.ShiftLeft
  if (value > 0) return ShiftDirection.ShiftRight
  throw new Error('valueToDirection: Unexpected shift value')
}

export type Expr
    = { exprType: ExprType.BinApp, binOp: BinOperation, expr1: Expr, expr2: Expr }
    | { exprType: ExprType.Not, expr: Expr }
    | { exprType: ExprType.Shift, expr: Expr, dir: ShiftDirection, shiftVal: ShiftVal }
    | { exprType: ExprType.Value, value: number }

export function VALUE_EXPR (x: number): Expr { return { exprType: ExprType.Value, value: x } }
export function NOT_EXPR (expr: Expr): Expr { return { exprType: ExprType.Not, expr } }
export function BIN_APP_EXPR (binOp: BinOperation, expr1: Expr, expr2: Expr): Expr {
  return { exprType: ExprType.BinApp, binOp, expr1, expr2 }
}
export function SHIFT_EXPR (i: number, expr: Expr): Expr {
  if (i === 0) return expr
  if (i < -7 || i > 7) throw new Error('SHIFT_EXPR: invalid shift value')
  const shiftedExpr: Expr = {
    exprType: ExprType.Shift,
    expr,
    dir: valueToDirection(i),
    shiftVal: Math.abs(i) as ShiftVal
  }
  return shiftedExpr
}
export const ONE_EXPR_VAL: Expr = { exprType: ExprType.Value, value: 1 }
export const ZERO_EXPR_VAL: Expr = { exprType: ExprType.Value, value: 0 }

export function prettyPrint (expr: Expr): string {
  switch (expr.exprType) {
    case ExprType.BinApp: {
      const op = binOpToString(expr.binOp)
      const left = prettyPrint(expr.expr1)
      const right = prettyPrint(expr.expr2)
      return `(${left} ${op} ${right})`
    }
    case ExprType.Not: {
      const notExpr = prettyPrint(expr.expr)
      return `~${notExpr}`
    }
    case ExprType.Shift: {
      const shiftExpr = prettyPrint(expr.expr)
      const direction = shiftDirectionToString(expr.dir)
      const shiftVal = expr.shiftVal
      return `(${shiftExpr} ${direction} ${shiftVal})`
    }
    case ExprType.Value: {
      return expr.value.toString(2).padStart(8, '0')
    }
    default:
      throw new Error('Invalid expression type')
  }
}

function binOpToString (binOp: BinOperation): string {
  switch (binOp) {
    case BinOperation.AND:
      return '&'
    case BinOperation.OR:
      return '|'
    case BinOperation.XOR:
      return '^'
    default:
      throw new Error('Invalid binary operation')
  }
}

function shiftDirectionToString (shiftDirection: ShiftDirection): string {
  switch (shiftDirection) {
    case ShiftDirection.ShiftLeft:
      return '<<'
    case ShiftDirection.ShiftRight:
      return '>>'
    default:
      throw new Error('Invalid shift direction')
  }
}

export function serializeToJS (expr: Expr): string {
  switch (expr.exprType) {
    case ExprType.BinApp: {
      const op = binOpToJSOperator(expr.binOp)
      const left = serializeToJS(expr.expr1)
      const right = serializeToJS(expr.expr2)
      return `(${left} ${op} ${right})`
    }
    case ExprType.Not: {
      const notExpr = serializeToJS(expr.expr)
      return `(~${notExpr})`
    }
    case ExprType.Shift: {
      const shiftExpr = serializeToJS(expr.expr)
      const direction = shiftDirectionToJSOperator(expr.dir)
      const shiftVal = expr.shiftVal
      return `(${shiftExpr} ${direction} ${shiftVal})`
    }
    case ExprType.Value: {
      return expr.value.toString()
    }
    default:
      throw new Error('Invalid expression type')
  }
}

function binOpToJSOperator (binOp: BinOperation): string {
  switch (binOp) {
    case BinOperation.AND:
      return '&'
    case BinOperation.OR:
      return '|'
    case BinOperation.XOR:
      return '^'
    default:
      throw new Error('Invalid binary operation')
  }
}

function shiftDirectionToJSOperator (shiftDirection: ShiftDirection): string {
  switch (shiftDirection) {
    case ShiftDirection.ShiftLeft:
      return '<<'
    case ShiftDirection.ShiftRight:
      return '>>'
    default:
      throw new Error('Invalid shift direction')
  }
}

export function evaluate (expr: Expr): number {
  function toByte (value: number): number {
    const x = value & 0xFF
    // console.debug("toByte =>", x);
    return x
  }

  function evalShift (value: number, shiftAmount: number): number {
    if (shiftAmount === 0) {
      return value
    }

    const isLeftShift = shiftAmount < 0
    const absShiftAmount = Math.abs(shiftAmount)

    if (isLeftShift) {
      return toByte(value << absShiftAmount)
    } else {
      return toByte(value >> absShiftAmount)
    }
  }

  switch (expr.exprType) {
    case ExprType.BinApp: {
      const left = evaluate(expr.expr1)
      const right = evaluate(expr.expr2)
      switch (expr.binOp) {
        case BinOperation.AND:
          return toByte(left & right)
        case BinOperation.OR:
          return toByte(left | right)
        case BinOperation.XOR:
          return toByte(left ^ right)
        default:
          throw new Error('Invalid binary operation')
      }
    }
    case ExprType.Not: {
      const notExpr = evaluate(expr.expr)
      return toByte(~notExpr)
    }
    case ExprType.Shift: {
      const shiftExpr = evaluate(expr.expr)
      const shiftVal = expr.shiftVal
      return evalShift(shiftExpr, expr.dir === ShiftDirection.ShiftLeft ? -shiftVal : shiftVal)
    }
    case ExprType.Value: {
      return expr.value
    }
    default:
      throw new Error('Invalid expression type')
  }
}

export function exprEquals (e1: Expr, e2: Expr): boolean {
  if (e1.exprType !== e2.exprType) {
    return false
  }

  function isBinApp (expr: Expr): expr is { exprType: ExprType.BinApp, binOp: BinOperation, expr1: Expr, expr2: Expr } {
    return expr.exprType === ExprType.BinApp
  }

  function isNot (expr: Expr): expr is { exprType: ExprType.Not, expr: Expr } {
    return expr.exprType === ExprType.Not
  }

  function isShift (expr: Expr): expr is { exprType: ExprType.Shift, expr: Expr, dir: ShiftDirection, shiftVal: ShiftVal } {
    return expr.exprType === ExprType.Shift
  }

  function isValue (expr: Expr): expr is { exprType: ExprType.Value, value: number } {
    return expr.exprType === ExprType.Value
  }

  if (isBinApp(e1) && isBinApp(e2)) {
    return (
      e1.binOp === e2.binOp &&
            exprEquals(e1.expr1, e2.expr1) &&
            exprEquals(e1.expr2, e2.expr2)
    )
  } else if (isNot(e1) && isNot(e2)) {
    return exprEquals(e1.expr, e2.expr)
  } else if (isShift(e1) && isShift(e2)) {
    return (
      e1.dir === e2.dir &&
            e1.shiftVal === e2.shiftVal &&
            exprEquals(e1.expr, e2.expr)
    )
  } else if (isValue(e1) && isValue(e2)) {
    return e1.value === e2.value
  } else {
    return false
  }
}

export function exprScore (e: Expr): number {
  let score = 0

  const traverse = (expr: Expr): void => {
    switch (expr.exprType) {
      case ExprType.BinApp: {
        score += 2 // 2 for using binary operator since we also need operand
        traverse(expr.expr1)
        traverse(expr.expr2)
        break
      }
      case ExprType.Not: {
        score++
        traverse(expr.expr)
        break
      }
      case ExprType.Shift: {
        score++
        traverse(expr.expr)
        break
      }
      case ExprType.Value:
        break
      default:
        throw new Error('Invalid expression type')
    }
  }

  traverse(e)
  return score
}

export function unwindStackToExpr (evaluationFrames: Expr[]): Expr {
  // Deep copy the frames array to avoid mutating argument
  const copiedFrames = JSON.parse(JSON.stringify(evaluationFrames))

  if (copiedFrames.length === 0) return ZERO_EXPR_VAL
  let i = 1 // bottom value is constant value of "inBits" so just start with next interesting frame
  let result = copiedFrames[i]
  while (++i < copiedFrames.length) {
    const currentExpr = copiedFrames[i]
    switch (currentExpr.exprType) {
      case ExprType.BinApp:
        currentExpr.expr1 = result
        break
      case ExprType.Not:
        currentExpr.expr = result
        break
      case ExprType.Shift:
        currentExpr.expr = result
        break
      case ExprType.Value:
      default:
        throw new Error('unwindStackToExpr: Invalid expression type')
    }
    result = currentExpr
  }
  return result
}
