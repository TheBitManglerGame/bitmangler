import { type FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateLeft, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { BinaryPanel } from './BinaryPanel'
import { Operation } from './Operation'
import { ConstControl, Control } from './Control'
import { type Digit, Op, ONE, ZERO } from './Common'
import { ConstOperand } from './Const'
import { evalExpr } from './Eval'

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

const SidebarLeft = styled.div`
  width: 20%;
  background-color: #f2f2f2;
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

interface EditorProps {
  bits: Digit[]
}

const Editor: FC<EditorProps> = ({ bits }) => {
  const inBits: Digit[] = bits
  const [binOp, setbinOp] = useState(Op.NOOP)
  const [constOperand, setConstOperand] = useState<Digit[] | null>(null)
  const [outBits, setOutBits] = useState(inBits)

  console.log('[DEBUG] current inBits:', outBits)
  console.log('[DEBUG] current binary operation:', binOp)
  console.log('[DEBUG] current operand:', constOperand)
  console.log('[DEBUG] current outBits:', outBits)

  // re-compute the output of the computational frame
  useEffect(() => {
    console.debug('[DEBUG]: useEffect: EVAL_EXPR', inBits, binOp, constOperand)
    setOutBits(evalExpr(inBits, constOperand, binOp))
  }, [inBits, binOp, constOperand])

  const binOpActive = binOp === Op.AND ||
                    binOp === Op.OR ||
                    binOp === Op.XOR ||
                    binOp === Op.SHIFTR ||
                    binOp === Op.SHIFTL

  return (
        <DndProvider backend={HTML5Backend}>
            <EditorWrapper>
            <SidebarLeft>
                <SimpleControl>HELP</SimpleControl>
                <SimpleControl><FontAwesomeIcon icon={faRotateLeft} /></SimpleControl>
            </SidebarLeft>
            <EditorContent>
                <BinaryPanel bits={inBits} fontColor="black" />
                <Operation content={binOp} />
                { binOpActive && <ConstOperand constOperand={constOperand} /> }
                <ResultArrow> <FontAwesomeIcon icon={faArrowDown} color="#e2e0df"/> </ResultArrow>
                <BinaryPanel bits={outBits} fontColor="#e2e0df" />
                <SubmitButton>Submit transition</SubmitButton>
            </EditorContent>
            <RightSidebar>
                <SplitControl>
                    <ConstControl name={'1'} setConstOperand={setConstOperand} operand={ONE} /> OR
                    <ConstControl name={'0'} setConstOperand={setConstOperand} operand={ZERO} />
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
