import { FC, Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { BinaryPanel } from "./BinaryPanel";
import { Operation } from "./Operation";
import { ConstControl, Control } from "./Control";
import { Digit, Op, ONE, ZERO, OperandState, digitsToInt, isBinOp, intToDigits, print8LSB, digitsFromUrlParam } from "./Common";
import { ConstOperand } from "./Const";
import { evalExpr, evalShift } from './Eval';
import { Expr, ExprType, ShiftDirection, BinOperation, ShiftVal, prettyPrint, evaluate, VALUE_EXPR } from './AST';
import { Modal, ModalContent, ModalButton } from './Modal';

const EditorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const EditorContent = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-top: 2.5vw;
  margin-bottom: 20px;
`;

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
`;

const RightSidebar = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh; /* Set height to 100% of viewport height */
`;

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
`;

const ResultArrow = styled.div`
  font-size: 2vw;
  margin: 2vw;
`;

const SplitControl = styled.div`
  height: calc(100% / 6);
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LeftSidebar = styled.div`
  width: 27%;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh; /* Set height to 100% of viewport height */
  overflow: auto;
  position: relative;
`;

const FrameDisplay = styled.div`
    padding: 1rem;
    border: 1px solid #ccc;
    margin: 1rem;
    border-radius: 5px;
    align-selft: flex-start;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: visible;
    position: relative;
`;

const TargetFrameDisplay = styled(FrameDisplay)`
  margin-top: 5em;
  align-self: stretch;
  width: relative;
  bottom: 0;
  border: 3px solid #2696fc;
  background-color: #badeff;
`;

const Arrow = styled.div`
    width: 10px;
    height: 10px;
    border-top: 4px solid #32CD32;
    border-right: 4px solid #32CD32;
    transform: rotate(135deg);
    margin: 0.5rem auto;
`;

const CloseIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 1;
`;


interface EditorProps {
    bits: Digit[],
    targetBits: Digit[],
}

function binOpToOp(binOp: BinOperation): Op {
  switch (binOp) {
      case BinOperation.AND:
          return Op.AND;
      case BinOperation.OR:
          return Op.OR;
      case BinOperation.XOR:
          return Op.XOR;
      default:
          throw new Error('Invalid binary operation');
  }
}

function UIstateToExpr(op: Op, operand1: OperandState, operand2?: OperandState): Expr {
  const applyShift = (operand: OperandState): Expr => {
      const valueExpr: Expr = { exprType: ExprType.Value, value: digitsToInt(operand.originalBits) };
      if (operand.shift === 0) {
          return valueExpr;
      } else if (operand.shift < 0) {
          return { exprType: ExprType.Shift, expr: valueExpr, dir: ShiftDirection.ShiftLeft, shiftVal: -operand.shift as ShiftVal };
      } else {
          return { exprType: ExprType.Shift, expr: valueExpr, dir: ShiftDirection.ShiftRight, shiftVal: operand.shift as ShiftVal };
      }
  };

  const shiftedOperand1 = applyShift(operand1);
  const shiftedOperand2 = operand2 ? applyShift(operand2) : null;

  if (isBinOp(op) && shiftedOperand2) {
    switch (op) {
      case Op.AND:
          return { exprType: ExprType.BinApp, binOp: BinOperation.AND, expr1: shiftedOperand1, expr2: shiftedOperand2 };
      case Op.OR:
          return { exprType: ExprType.BinApp, binOp: BinOperation.OR, expr1: shiftedOperand1, expr2: shiftedOperand2 };
      case Op.XOR:
          return { exprType: ExprType.BinApp, binOp: BinOperation.XOR, expr1: shiftedOperand1, expr2: shiftedOperand2 };
      default:
        throw new Error('Invalid binary operation');
    }
  } else {
    switch (op) {
        case Op.NOOP:
            return shiftedOperand1;
        case Op.NOT:
            return { exprType: ExprType.Not, expr: shiftedOperand1 };
        default:
          throw new Error('Invalid unary operation');
    }
  }
}

function ExprToUIstate(expr: Expr): { op: Op, operand1: OperandState, operand2: OperandState | null } {
  const extractOperandState = (e: Expr): OperandState => {
      let shift = 0;
      let bits: Digit[] = [];

      while (e.exprType === ExprType.Shift) {
          const shiftExpr = e;
          shift += (shiftExpr.dir === ShiftDirection.ShiftLeft ? -1 : 1) * shiftExpr.shiftVal;
          e = shiftExpr.expr;
      }

      if (e.exprType === ExprType.Value) {
          bits = intToDigits(e.value);
      }

      return { originalBits: bits, bits: evalShift(bits, shift), shift };
  };

  if (expr.exprType === ExprType.BinApp) {
      const binAppExpr = expr;
      const op = binOpToOp(binAppExpr.binOp);
      const operand1 = extractOperandState(binAppExpr.expr1);
      const operand2 = extractOperandState(binAppExpr.expr2);

      return { op, operand1, operand2 };
  } else if (expr.exprType === ExprType.Not) {
      const notExpr = expr;
      const op = Op.NOT;
      const operand1 = extractOperandState(notExpr.expr);

      return { op, operand1, operand2: null };
  } else if (expr.exprType === ExprType.Value) {
      const op = Op.NOOP;
      const operand1 = extractOperandState(expr);

      return { op, operand1, operand2: null };
  } else if (expr.exprType === ExprType.Shift) {
      const op = Op.NOOP;
      const operand1 = extractOperandState(expr);

      return { op, operand1, operand2: null };
  } else {
      throw new Error('ExprToUIstate: Invalid expression type');
  }
}

function getBitQueryParams(): {bits: Digit[], targetBits: Digit[] } {
  const searchParams: URLSearchParams = new URLSearchParams(window.location.search);

  if (!searchParams.get("bits")) {
    console.warn("[WARN] 'bits' url parameter is not set");
  }

  if (!searchParams.get("target")) {
    console.warn("[WARN] 'targetBits' url parameter is not set");
  }

  return { bits: digitsFromUrlParam(searchParams.get("bits") || "00000000")
         , targetBits: digitsFromUrlParam(searchParams.get("target") || "00000001")
         };
}

const Editor: FC<EditorProps> = ({bits, targetBits}) => {
    const { bits: initialBits, targetBits: initialTargetBits } = getBitQueryParams();
    bits = initialBits || bits;
    targetBits = initialTargetBits || targetBits;

    const [inBitsState, setInBitsState] = useState<OperandState>({originalBits: initialBits, bits: initialBits, shift: 0});
    const [constOperandState, setConstOperandState] = useState<OperandState>({originalBits: ONE, bits: ONE, shift: 0});
    const [binOp, setbinOp] = useState(Op.NOOP);
    const [outBits, setOutBits] = useState<Digit[]>(inBitsState.bits);
    const [evaluationFrames, setEvaluationFrames] = useState<Array<Expr>>([VALUE_EXPR(digitsToInt(bits))]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
    const [targetReached, setTargetReached] = useState<boolean>(false);

    const binOpActive = binOp === Op.AND || binOp === Op.OR || binOp === Op.XOR;

    // console.log("[DEBUG] ===== CURRENT STATE =====");
    // console.log("[DEBUG] current inBits:", inBitsState);
    // console.log("[DEBUG] current binary operation:", binOp);
    // console.log("[DEBUG] current operand:", constOperandState);
    // console.log("[DEBUG] current outBits:", outBits);

    // re-evaluate frame
    useEffect(() => {
        console.debug("[DEBUG]: useEffect: EVAL_EXPR", inBitsState, binOp, constOperandState);
        setOutBits(evalExpr(inBitsState.bits, constOperandState.bits, binOp));
    }, [inBitsState, binOp, constOperandState]);

    // submit evaluation step
    const submitTransition = () => {
        console.debug("[DEBUG]: SUBMIT_TRANSITION");
        if (outBits.join('') === targetBits.join('')) {
            setTargetReached(true);
        }
        const expr: Expr = UIstateToExpr(binOp, inBitsState, constOperandState);
        setEvaluationFrames([...evaluationFrames, expr]);
        setCurrentFrameIndex(currentFrameIndex+1);
        setInBitsState({originalBits: outBits, bits: outBits, shift: 0});
        setConstOperandState({originalBits: ONE, bits: ONE, shift: 0});
        setbinOp(Op.NOOP);
    };

    // in case we want to restart
    const resetEditor = () => {
      console.debug("[DEBUG]: RESET_EDITOR");
        setInBitsState({ originalBits: bits, bits, shift: 0 });
        setConstOperandState({ originalBits: ONE, bits: ONE, shift: 0 });
        setbinOp(Op.NOOP);
        setOutBits(bits);
        setEvaluationFrames([VALUE_EXPR(digitsToInt(bits))]);
        setCurrentFrameIndex(0);
        setTargetReached(false);
    };

    const dropLastFrame = () => {
      console.debug("[DEBUG]: DROP_LAST_FRAME");
        let index = evaluationFrames.length - 1;
        const updatedFrames = evaluationFrames.slice(0, index);
        setEvaluationFrames(updatedFrames);
        setCurrentFrameIndex(currentFrameIndex - 1);

        // Restore the UI state from the previous frame
        const prevExpr = updatedFrames[index - 1];
        const prevState = ExprToUIstate(prevExpr);
        setInBitsState(prevState.operand1);
        setbinOp(prevState.op);
        setOutBits(intToDigits(evaluate(prevExpr)));

        if (prevState.operand2) {
          setConstOperandState(prevState.operand2);
        } else {
          setConstOperandState({ originalBits: ONE, bits: ONE, shift: 0 });
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            {targetReached && (
                <Modal>
                    <ModalContent>
                        <h2>Congratulations! You reached the target!</h2>
                        <div>
                            <ModalButton onClick={resetEditor}>Retry</ModalButton>
                            <ModalButton onClick={() => {/* Next logic */}}>Next</ModalButton>
                        </div>
                    </ModalContent>
                </Modal>
            )}
            <EditorWrapper>
            <LeftSidebar>
                <SimpleControl>HELP</SimpleControl>
                {evaluationFrames.map((frame, index) => (
                    <Fragment key={index}>
                        <FrameDisplay>
                            {index !== 0 && index === evaluationFrames.length - 1 && (
                              <CloseIcon icon={faTimes} onClick={dropLastFrame} />
                            )}
                            <pre>{`${prettyPrint(frame)} ${index === 0 ? "" : "=> " + print8LSB(evaluate(frame))}`}</pre>
                        </FrameDisplay>
                        {index < evaluationFrames.length - 1 && <Arrow />}
                    </Fragment>
                ))}
                <TargetFrameDisplay>
                    <pre>{`Target: ${targetBits.map(bit => bit.toString()).join("")}`}</pre>
                </TargetFrameDisplay>
            </LeftSidebar>
            <EditorContent>
                <BinaryPanel fontColor="black" operandState={inBitsState} setOperandState={setInBitsState} />
                <Operation content={binOp} />
                { binOpActive && <ConstOperand  operandState={constOperandState} setOperandState={setConstOperandState} /> }
                <ResultArrow> <FontAwesomeIcon icon={faArrowDown} color="#e2e0df"/> </ResultArrow>
                <BinaryPanel fontColor="#e2e0df" operandState={{originalBits: outBits, bits: outBits, shift: 0}} />
                <SubmitButton onClick={submitTransition}>Submit transition</SubmitButton>
            </EditorContent>
            <RightSidebar>
                <SplitControl>
                    <ConstControl name={"1"} setOperandState={setConstOperandState} operand={ONE} /> OR
                    <ConstControl name={"0"} setOperandState={setConstOperandState} operand={ZERO} />
                </SplitControl>
                <Control name={"AND (&)"} setbinOp={setbinOp} op={Op.AND} />
                <Control name={"OR  (|)"} setbinOp={setbinOp} op={Op.OR} />
                <Control name={"XOR (^)"} setbinOp={setbinOp} op={Op.XOR} />
                <Control name={"NOT (~)"} setbinOp={setbinOp} op={Op.NOT} />
            </RightSidebar>
            </EditorWrapper>
        </DndProvider>
    );
};

export default Editor;
