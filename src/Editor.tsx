import { type FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faChessKnight, faQuestion, faCogs, faListUl } from '@fortawesome/free-solid-svg-icons'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React from 'react'

import { BinaryPanel } from './BinaryPanel'
import { Operation } from './Operation'
import { Control, StyledControl } from './Control'
import { type Digit, Op, ONE, type OperandState, digitsToInt, intToDigits, isBinOp, OpType, puzzleKey } from './Common'
import { ConstOperand } from './Const'
import { evalExpr, evalShift } from './Eval'
import { type Expr, ExprType, evaluate, VALUE_EXPR, BIN_APP_EXPR, BinOperation, NOT_EXPR, SHIFT_EXPR, ShiftDirection, unwindStackToExpr, ZERO_EXPR_VAL, exprEquals } from './Expr'
import { useModal } from './Modal'
import { EvalStack, HighlightedFrameDisplay } from './EvalStack'
import { LeftSidebar, SimpleControls, ResultArrow, SubmitButton, RightSidebar, StyledIcon } from './RandomUI'

import { useMeasure } from './useMeasure'
import { Help } from './Help'
import { PuzzleList } from './PuzzleList'
import { Settings } from './Settings'
import { GameSummary } from './GameSummary'
import { useAppState } from './AppState'

const EditorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const StyledEditorContent = styled.div`
  flex: 1;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 4vw;
  position: relative;

  @media (max-width: 768px) {
    margin-top: 0.01vw;
    padding: 32px 64px;
  }
`

interface EditorContentProps {
  children: React.ReactNode
}

const EditorContent: React.FC<EditorContentProps> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ canDrop }, drop] = useDrop(() => ({
    accept: OpType.BIN_OPERATION,
    drop: () => {},
    collect: (monitor) => ({
      canDrop: monitor.canDrop()
    })
  }))

  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { ...child.props, canDrop })
    }
    return child
  })

  return (
    <StyledEditorContent ref={drop}>
      {enhancedChildren}
    </StyledEditorContent>
  )
}

interface EditorProps {
  bits: Digit[]
  targetBits: Digit[]
  allowedOps: Op[]
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

    return { originalBits: bits, bits: evalShift(bits, shift), shift, sliding: Array(8).fill(0) }
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

export const Editor: FC<EditorProps> = ({ bits, targetBits, solverSolution, onNewGame, allowedOps }) => {
  const { appState, setAppState } = useAppState()
  const [inBitsState, setInBitsState] = useState<OperandState>({ originalBits: bits, bits, shift: 0, sliding: Array(8).fill(0) })
  const [constOperandState, setConstOperandState] = useState<OperandState>({ originalBits: ONE, bits: ONE, shift: 0, sliding: Array(8).fill(0) })
  const [binOp, setbinOp] = useState(Op.NOOP)
  const [outBits, setOutBits] = useState<Digit[]>(inBitsState.bits)
  const [evaluationFrames, setEvaluationFrames] = useState<Expr[]>([VALUE_EXPR(digitsToInt(bits))])
  const [targetReached, setTargetReached] = useState<boolean>(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const binOpActive = binOp === Op.AND || binOp === Op.OR || binOp === Op.XOR

  // console.debug('[DEBUG] Editor:render')

  // re-evaluate frame
  useEffect(() => {
    console.debug('[DEBUG]: EVAL_EXPR', inBitsState, binOp, constOperandState)
    setOutBits(evalExpr(inBitsState.bits, constOperandState.bits, binOp))
  }, [inBitsState, binOp, constOperandState])

  useEffect(() => {
    const handleResize: () => void = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const isMobile = windowWidth <= 768

  // submit evaluation step
  const submitTransition = (): void => {
    console.debug('[DEBUG]: SUBMIT_TRANSITION')
    const expr: Expr = UIstateToExpr(binOp, inBitsState, constOperandState)
    setEvaluationFrames(prevFrames => {
      // Do not allow to push eval frame value identical to last one on the stack
      const topFrame = VALUE_EXPR(evaluate(prevFrames[prevFrames.length - 1]))
      const newFrame = VALUE_EXPR(evaluate(expr))
      if (exprEquals(topFrame, newFrame)) {
        return prevFrames
      }
      return [...prevFrames, expr]
    })
    if (evaluate(expr) === digitsToInt(targetBits)) {
      // udpate set of solved puzzles
      const newSet = new Set(appState.session.solvedPuzzles)
      newSet.add(puzzleKey(bits, targetBits))
      setAppState({ ...appState, session: { ...appState.session, solvedPuzzles: newSet } })
      setTargetReached(true)
    } else {
      setInBitsState({ originalBits: outBits, bits: outBits, shift: 0, sliding: Array(8).fill(0) })
      setConstOperandState({ originalBits: ONE, bits: ONE, shift: 0, sliding: Array(8).fill(0) })
      setbinOp(Op.NOOP)
    }
  }

  // in case we want to restart
  const resetEditor = (): void => {
    console.debug('[DEBUG]: RESET_EDITOR')
    setInBitsState({ originalBits: bits, bits, shift: 0, sliding: Array(8).fill(0) })
    setConstOperandState({ originalBits: ONE, bits: ONE, shift: 0, sliding: Array(8).fill(0) })
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
      setConstOperandState({ originalBits: ONE, bits: ONE, shift: 0, sliding: Array(8).fill(0) })
    }
  }

  const [{ ref: leftSidebarRef }, leftSidebarBounds] = useMeasure()

  const helpModal = useModal()
  const settingsModal = useModal()
  const puzzleListModal = useModal()
  const modalConfigs = {
    help: {
      buttons: {
        close: {
          label: 'Close',
          action: helpModal.closeModal
        }
      }
    },
    settings: {
      buttons: {
        close: {
          label: 'Close',
          action: settingsModal.closeModal
        }
      }
    },
    puzzleList: {
      buttons: {
        close: {
          label: 'Close',
          action: puzzleListModal.closeModal
        }
      },
      width: '50vw'
    }
  }

  return (
        <DndProvider backend={HTML5Backend}>
            {targetReached && (
                <GameSummary
                  buttons={{
                    retry: {
                      label: 'Retry',
                      action: resetEditor
                    },
                    newGame: {
                      label: 'New Game',
                      action: onNewGame
                    },
                    openList: {
                      label: 'Puzzle list',
                      action: () => {
                        setTargetReached(false)
                        puzzleListModal.openModal()
                      }
                    }
                  }}
                  resultExpr={unwindStackToExpr(evaluationFrames)}
                  bitBotExpr={solverSolution || ZERO_EXPR_VAL}
                />)}
            {helpModal.isOpen && <Help {...modalConfigs.help} />}
            {puzzleListModal.isOpen && <PuzzleList {...modalConfigs.puzzleList} />}
            {settingsModal.isOpen && <Settings {...modalConfigs.settings} />}
            <EditorWrapper>
            <LeftSidebar ref={leftSidebarRef}>
                <SimpleControls>
                  <StyledIcon onClick={helpModal.openModal} icon={faQuestion} color="grey"/>
                  <StyledIcon onClick={puzzleListModal.openModal} icon={faListUl} color="grey"/>
                  <StyledIcon onClick={settingsModal.openModal} icon={faCogs} color="grey"/>
                </SimpleControls>
                <EvalStack frames={evaluationFrames} onDropLast={dropLastFrame} leftSidebarWidth={leftSidebarBounds.width} />
                <HighlightedFrameDisplay borderColor={'#2696fc'} backgroundColor={'#badeff'}>
                <pre>{`${isMobile ? '' : 'Target: '}${targetBits.map(bit => bit.toString()).join('')}`}</pre>
                </HighlightedFrameDisplay>
            </LeftSidebar>
            <EditorContent>
                <BinaryPanel fontColor="black" operandState={inBitsState} setOperandState={setInBitsState} />
                <Operation op={binOp} canDrop={false} />
                { binOpActive && <ConstOperand operandState={constOperandState} setOperandState={setConstOperandState} /> }
                <ResultArrow> <FontAwesomeIcon icon={faArrowDown} color="#a8a8a8"/> </ResultArrow>
                <BinaryPanel hideShift
                             targetBits={targetBits}
                             fontColor="#e2e0df"
                             operandState={{ originalBits: outBits, bits: outBits, shift: 0, sliding: Array(8).fill(0) }} />
                <SubmitButton onClick={submitTransition}>
                  <FontAwesomeIcon icon={faChessKnight} color="white"/>
                </SubmitButton>
            </EditorContent>
            <RightSidebar>
                <StyledControl>1</StyledControl>
                {allowedOps.includes(Op.AND) && <Control name={'AND (&)'} setbinOp={setbinOp} op={Op.AND} />}
                {allowedOps.includes(Op.OR) && <Control name={'OR  (|)'} setbinOp={setbinOp} op={Op.OR} />}
                {allowedOps.includes(Op.XOR) && <Control name={'XOR (^)'} setbinOp={setbinOp} op={Op.XOR} />}
                {allowedOps.includes(Op.NOT) && <Control name={'NOT (~)'} setbinOp={setbinOp} op={Op.NOT} />}
            </RightSidebar>
            </EditorWrapper>
        </DndProvider>
  )
}

export default Editor
