import { type FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { BinaryPanel } from './BinaryPanel'
import { Operation } from './Operation'
import { ConstControl, Control } from './Control'
import { type Digit, Op, ONE, ZERO, type OperandState, digitsToInt, intToDigits, isBinOp } from './Common'
import { ConstOperand } from './Const'
import { evalExpr, evalShift } from './Eval'
import { type Expr, ExprType, evaluate, VALUE_EXPR, BIN_APP_EXPR, BinOperation, NOT_EXPR, SHIFT_EXPR, ShiftDirection, unwindStackToExpr, ZERO_EXPR_VAL } from './Expr'
import { GameSummaryModal } from './Modal'
import { EvalStack, TargetDisplay } from './EvalStack'

const EditorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const EditorContent = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-top: 2.5vw;
  margin-bottom: 20px;
`

const SubmitButton = styled.button`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  margin: 2vw 0;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 2vw;
`

const RightSidebar = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh; /* Set height to 100% of viewport height */
`

const SimpleControl = styled.div`
  height: calc(100% / 6);
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`

const ResultArrow = styled.div`
  font-size: 2vw;
  margin: 2vw;
`

const SplitControl = styled.div`
  height: calc(100% / 6);
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LeftSidebar = styled.div`
  width: 27%;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh; /* Set height to 100% of viewport height */
  overflow: auto;
  position: relative;
`

interface EditorProps {
  bits: Digit[]
  targetBits: Digit[]
  solverSolution: Expr | null
  onNewGame: () => void
}

function binOpToOp (binOp: BinOperation): Op {
  switch (binOp) {
    case BinOperation.AND:
      return Op.AND
    case BinOperation.OR:
      return Op.OR
    case BinOperation.XOR:
      return Op.XOR
    default:
      throw new Error('Invalid binary operation')
  }
}

function UIstateToExpr (op: Op, operand1: OperandState, operand2?: OperandState): Expr {
  const applyShift = (operand: OperandState): Expr => {
    const valueExpr: Expr = VALUE_EXPR(digitsToInt(operand.originalBits))
    const shiftedExpr = SHIFT_EXPR(operand.shift, valueExpr)
    return shiftedExpr
  }

  const shiftedOperand1 = applyShift(operand1)
  const shiftedOperand2 = operand2 ? applyShift(operand2) : null

  if (isBinOp(op) && shiftedOperand2) {
    switch (op) {
      case Op.AND:
        return BIN_APP_EXPR(BinOperation.AND, shiftedOperand1, shiftedOperand2)
      case Op.OR:
        return BIN_APP_EXPR(BinOperation.OR, shiftedOperand1, shiftedOperand2)
      case Op.XOR:
        return BIN_APP_EXPR(BinOperation.XOR, shiftedOperand1, shiftedOperand2)
      default:
        throw new Error('Invalid binary operation')
    }
  } else {
    switch (op) {
      case Op.NOOP:
        return shiftedOperand1
      case Op.NOT:
        return NOT_EXPR(shiftedOperand1)
      default:
        throw new Error('Invalid unary operation')
    }
  }
}

export function ExprToUIstate (expr: Expr): { op: Op, operand1: OperandState, operand2: OperandState | null } {
  const extractOperandState = (e: Expr): OperandState => {
    let shift = 0
    let bits: Digit[] = []

    while (e.exprType === ExprType.Shift) {
      const shiftExpr = e
      shift += (shiftExpr.dir === ShiftDirection.ShiftLeft ? -1 : 1) * shiftExpr.shiftVal
      e = shiftExpr.expr
    }

    if (e.exprType === ExprType.Value) {
      bits = intToDigits(e.value)
    }

    return { originalBits: bits, bits: evalShift(bits, shift), shift }
  }

  if (expr.exprType === ExprType.BinApp) {
    const binAppExpr = expr
    const op = binOpToOp(binAppExpr.binOp)
    const operand1 = extractOperandState(binAppExpr.expr1)
    const operand2 = extractOperandState(binAppExpr.expr2)

    return { op, operand1, operand2 }
  } else if (expr.exprType === ExprType.Not) {
    const notExpr = expr
    const op = Op.NOT
    const operand1 = extractOperandState(notExpr.expr)

    return { op, operand1, operand2: null }
  } else if (expr.exprType === ExprType.Value) {
    const op = Op.NOOP
    const operand1 = extractOperandState(expr)

    return { op, operand1, operand2: null }
  } else if (expr.exprType === ExprType.Shift) {
    const op = Op.NOOP
    const operand1 = extractOperandState(expr)

    return { op, operand1, operand2: null }
  } else {
    throw new Error('ExprToUIstate: Invalid expression type')
  }
}

export const Editor: FC<EditorProps> = ({ bits, targetBits, solverSolution, onNewGame }) => {
  const [inBitsState, setInBitsState] = useState<OperandState>({ originalBits: bits, bits, shift: 0 })
  const [constOperandState, setConstOperandState] = useState<OperandState>({ originalBits: ONE, bits: ONE, shift: 0 })
  const [binOp, setbinOp] = useState(Op.NOOP)
  const [outBits, setOutBits] = useState<Digit[]>(inBitsState.bits)
  const [evaluationFrames, setEvaluationFrames] = useState<Expr[]>([VALUE_EXPR(digitsToInt(bits))])
  const [targetReached, setTargetReached] = useState<boolean>(false)
  const binOpActive = binOp === Op.AND || binOp === Op.OR || binOp === Op.XOR

  // console.debug('[DEBUG] Editor:render')

  // re-evaluate frame
  useEffect(() => {
    console.debug('[DEBUG]: EVAL_EXPR', inBitsState, binOp, constOperandState)
    setOutBits(evalExpr(inBitsState.bits, constOperandState.bits, binOp))
  }, [inBitsState, binOp, constOperandState])

  // submit evaluation step
  const submitTransition = (): void => {
    console.debug('[DEBUG]: SUBMIT_TRANSITION')
    const expr: Expr = UIstateToExpr(binOp, inBitsState, constOperandState)
    setEvaluationFrames(prevFrames => [...prevFrames, expr])
    if (evaluate(expr) === digitsToInt(targetBits)) {
      setTargetReached(true)
    } else {
      setInBitsState({ originalBits: outBits, bits: outBits, shift: 0 })
      setConstOperandState({ originalBits: ONE, bits: ONE, shift: 0 })
      setbinOp(Op.NOOP)
    }
  }

  // in case we want to restart
  const resetEditor = (): void => {
    console.debug('[DEBUG]: RESET_EDITOR')
    setInBitsState({ originalBits: bits, bits, shift: 0 })
    setConstOperandState({ originalBits: ONE, bits: ONE, shift: 0 })
    setbinOp(Op.NOOP)
    setOutBits(bits)
    setEvaluationFrames([VALUE_EXPR(digitsToInt(bits))])
    setTargetReached(false)
  }

  const dropLastFrame = (): void => {
    console.debug('[DEBUG]: DROP_LAST_FRAME')
    const index = evaluationFrames.length - 1
    const updatedFrames = evaluationFrames.slice(0, index)
    setEvaluationFrames(updatedFrames)

    // Restore the UI state from the previous frame
    const prevExpr = updatedFrames[index - 1]
    const prevState = ExprToUIstate(prevExpr)
    setInBitsState(prevState.operand1)
    setbinOp(prevState.op)
    setOutBits(intToDigits(evaluate(prevExpr)))

    if (prevState.operand2) {
      setConstOperandState(prevState.operand2)
    } else {
      setConstOperandState({ originalBits: ONE, bits: ONE, shift: 0 })
    }
  }

  return (
        <DndProvider backend={HTML5Backend}>
            {targetReached && (
                <GameSummaryModal
                  onRetryClick={resetEditor}
                  onNewGameClick={onNewGame}
                  resultExpr={unwindStackToExpr(evaluationFrames)}
                  bitBotExpr={solverSolution || ZERO_EXPR_VAL}
                />)}
            <EditorWrapper>
            <LeftSidebar>
                <SimpleControl>HELP</SimpleControl>
                <EvalStack frames={evaluationFrames} onDropLast={dropLastFrame} />
                <TargetDisplay>
                    <pre>{`Target: ${targetBits.map(bit => bit.toString()).join('')}`}</pre>
                </TargetDisplay>
            </LeftSidebar>
            <EditorContent>
                <BinaryPanel fontColor="black" operandState={inBitsState} setOperandState={setInBitsState} />
                <Operation content={binOp} />
                { binOpActive && <ConstOperand operandState={constOperandState} setOperandState={setConstOperandState} /> }
                <ResultArrow> <FontAwesomeIcon icon={faArrowDown} color="#e2e0df"/> </ResultArrow>
                <BinaryPanel fontColor="#e2e0df" operandState={{ originalBits: outBits, bits: outBits, shift: 0 }} />
                <SubmitButton onClick={submitTransition}>Submit transition</SubmitButton>
            </EditorContent>
            <RightSidebar>
                <SplitControl>
                    <ConstControl name={'1'} setOperandState={setConstOperandState} operand={ONE} /> OR
                    <ConstControl name={'0'} setOperandState={setConstOperandState} operand={ZERO} />
                </SplitControl>
                <Control name={'AND (&)'} setbinOp={setbinOp} op={Op.AND} />
                <Control name={'OR  (|)'} setbinOp={setbinOp} op={Op.OR} />
                <Control name={'XOR (^)'} setbinOp={setbinOp} op={Op.XOR} />
                <Control name={'NOT (~)'} setbinOp={setbinOp} op={Op.NOT} />
            </RightSidebar>
            </EditorWrapper>
        </DndProvider>
  )
}

export default Editor
