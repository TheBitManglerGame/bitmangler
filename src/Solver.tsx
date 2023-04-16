import { BIN_APP_EXPR, BinOperation, type Expr, ExprType, NOT_EXPR, ONE_EXPR_VAL, SHIFT_EXPR, VALUE_EXPR, ZERO_EXPR_VAL, evaluate, prettyPrint } from './AST'
import { type Digit, digitsToInt, intToDigits, assert } from './Common'

const TICK_LIMIT: number = 5000

function isOperationResultKnown (binOp: BinOperation, shiftedExpr: Expr, shiftedOperandExpr: Expr): boolean {
  const e1 = evaluate(shiftedExpr)
  const e2 = evaluate(shiftedOperandExpr)

  switch (binOp) {
    case BinOperation.AND:
      return e1 === 0 || e2 === 0
    case BinOperation.OR:
      return e1 === 1 || e2 === 1
    case BinOperation.XOR:
      return false
    default:
      return false
  }
}

function _solve (from: Digit[], to: Digit[], maxDepth: number = 10): Expr | null {
  let tick = 0

  if (digitsToInt(from) === digitsToInt(to)) {
    return VALUE_EXPR(digitsToInt(to))
  }

  const targetValue = digitsToInt(to)
  const queue: Expr[] = [VALUE_EXPR(digitsToInt(from))]

  // Check if the target value can be built just using shifts
  for (let i = -7; i <= 7; i++) {
    if (i === 0) continue
    const shiftedExpr = SHIFT_EXPR(i, VALUE_EXPR(digitsToInt(from)))
    if (evaluate(shiftedExpr) === targetValue) {
      return shiftedExpr
    }
  }

  while (queue.length) {
    tick++
    const expr = queue.shift()
    if (expr) {
      const exprEval = evaluate(expr)

      // console.debug("[DEBUG] expr:", prettyPrint(expr));
      if (exprEval === targetValue) {
        console.debug('[DEBUG] Solver ticks:', tick)
        assert(evaluate(expr) === targetValue)
        return expr
      }

      const heuristicExpr = buildExprForSimilarBits(expr, to, 2)
      if (heuristicExpr) {
        console.debug('[DEBUG] Solver ticks:', tick)
        assert(evaluate(heuristicExpr) === targetValue)
        return heuristicExpr
      }

      if (tick > TICK_LIMIT) {
        console.warn('[WARN] Solver tick limit reached')
        return null
      }

      if (depth(expr) > maxDepth) {
        continue
      }

      const isShiftExpr = expr.exprType === ExprType.Shift
      const exprValue = evaluate(expr)
      const startShift = (isShiftExpr || exprValue === 0) ? 0 : -7
      const endShift = (isShiftExpr || exprValue === 0) ? 0 : 7

      for (let i = startShift; i <= endShift; i++) {
        const shiftedExpr = i === 0 ? expr : SHIFT_EXPR(i, expr)

        queue.push(shiftedExpr)

        const notExpr = NOT_EXPR(shiftedExpr)
        queue.push(notExpr)

        if (exprValue !== 0) {
          for (const binOp of [BinOperation.AND, BinOperation.OR, BinOperation.XOR]) {
            for (const operand of [ONE_EXPR_VAL, ZERO_EXPR_VAL]) {
              const isZeroOperand = operand === ZERO_EXPR_VAL

              if (isZeroOperand && (binOp === BinOperation.OR || binOp === BinOperation.XOR)) continue

              const startOperandShift = isZeroOperand ? 0 : -7
              const endOperandShift = isZeroOperand ? 0 : 7

              for (let j = startOperandShift; j <= endOperandShift; j++) {
                const shiftedOperandExpr = j === 0 ? operand : SHIFT_EXPR(j, operand)
                if (!isOperationResultKnown(binOp, shiftedExpr, shiftedOperandExpr)) {
                  const binAppExpr = BIN_APP_EXPR(binOp, shiftedExpr, shiftedOperandExpr)
                  queue.push(binAppExpr)
                }
              }
            }
          }
        }
      }
    }
  }
  console.debug('[DEBUG] Solver ticks:', tick)
  return null
}

function depth (expr: Expr): number {
  switch (expr.exprType) {
    case ExprType.Value:
      return 0
    case ExprType.Not:
      return 1 + depth(expr.expr)
    case ExprType.Shift:
      return 1 + depth(expr.expr)
    case ExprType.BinApp:
      return 1 + Math.max(depth(expr.expr1), depth(expr.expr2))
    default:
      throw new Error('Unknown expression type')
  }
}

function buildExprForSimilarBits (expr: Expr, to: Digit[], maxDifferingBits: number): Expr | null {
  const from = intToDigits(evaluate(expr))
  let differingBits = 0
  const differingBitsPositions: number[] = []

  for (let i = 0; i < from.length; i++) {
    if (from[i] !== to[i]) {
      differingBits++
      differingBitsPositions.push(i)
    }
  }

  if (differingBits <= maxDifferingBits) {
    let currentExpr: Expr = expr
    for (let i = 0; i < differingBits; i++) {
      const position = differingBitsPositions[i]
      const shift = position - (from.length - 1)
      const shiftedOperand = SHIFT_EXPR(shift, ONE_EXPR_VAL)
      const updatedExpr = BIN_APP_EXPR(BinOperation.XOR, currentExpr, shiftedOperand) // Use currentExpr instead of expr
      currentExpr = updatedExpr
    }
    return currentExpr
  }

  return null
}

export function solve (dest: Digit[], target: Digit[]): Expr | null {
  const startTime = performance.now()
  const result = _solve(dest, target)
  const endTime = performance.now()
  const executionTime = endTime - startTime

  console.debug(`[DEBUG] Solver execution time: ${executionTime.toFixed(2)} milliseconds`)
  if (result) console.debug('[DEBUG] Solver result:', prettyPrint(result))
  else console.warn('[WARN] No solution found (which is unexpected)')
  return result
}
