import { type FC } from 'react'
import styled from 'styled-components'
import { useDrag } from 'react-dnd'

import { OpType, type Op, type Digit, digitsToInt, ShiftDir, renderDirection, type OperandState } from './Common'
import { evalShift } from './Eval'

const StyledControl = styled.div`
  height: calc(100% / 4.8);
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    cursor: pointer;
    background-color: #e0e0e0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 2vw;
    padding: 8px 16px;
    height: calc(100% / 3);
  }
`

const StyledSplitControl = styled.div`
  padding: 1vw;
  margin: 1vw;
  border: 2px dotted #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% / 2);
  height: calc(100% / 2);
  transition: all 0.3s ease;

  &:hover {
    cursor: pointer;
    border: 2px solid #aaa;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 2vw;
    padding: 8px 8px;
    height: calc(100% / 3);
    margin: 8px 0;
    border-width: 0px; // Reduce border width on mobile screens
  }
`

export interface ControlProps {
  name: string
  setbinOp: (op: Op) => void
  op: Op
}

interface DropResult {
  name: string
}

export const Control: FC<ControlProps> = function Control ({ name, setbinOp, op }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: OpType.BIN_OPERATION,
    item: { name, op },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
      if (item.op && dropResult) {
        setbinOp(op)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId()
    })
  }))

  const opacity = isDragging ? 0.4 : 1
  return (
    <StyledControl ref={drag} style={{ opacity }} data-testid={'Control'}>
      {name}
    </StyledControl>
  )
}

export interface ConstControlProps {
  name: string
  setOperandState: React.Dispatch<React.SetStateAction<OperandState>>
  operand: Digit[]
}

export const ConstControl: FC<ConstControlProps> = function ConstControl ({ name, setOperandState, operand }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: OpType.CONST_OPERATION,
    item: { name, operand },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
      if ((digitsToInt(item.operand) === 1 ||
          digitsToInt(item.operand) === 0) && dropResult) {
        console.log('dropped', item.operand)
        setOperandState((prevState: OperandState) => ({
          ...prevState,
          originalBits: item.operand,
          bits: evalShift(item.operand, prevState.shift)
        }))
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId()
    })
  }))

  const opacity = isDragging ? 0.4 : 1
  return (
    <StyledSplitControl ref={drag} style={{ opacity }} data-testid={'StyledSplitControl'}>
      {name}
    </StyledSplitControl>
  )
}

const StyledShiftControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5vw;
  color: #a8a8a8;
  background-color: #f0f0f0;
  border-radius: 3px;
  padding: 5px 10px;
  opacity: 0.8;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    cursor: pointer;
    opacity: 1;
    background-color: #e0e0e0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    transform: scale(1.1);
  }
`

interface ShiftControlProps {
  direction: ShiftDir
  shiftAmount: number
  onClick: (e: any) => void
}

export const ShiftControl: FC<ShiftControlProps> = function ShiftControl ({ direction, shiftAmount, onClick }) {
  return (
    <StyledShiftControl onClick={onClick}>
      {direction === ShiftDir.LEFT && shiftAmount < 0 && (
        <span style={{ marginRight: '4px', fontSize: '1vw', opacity: 0.6 }}>{Math.abs(shiftAmount)}</span>
      )}
      {renderDirection(direction)}
      {direction === ShiftDir.RIGHT && shiftAmount > 0 && (
        <span style={{ marginLeft: '4px', fontSize: '1vw', opacity: 0.6 }}>{shiftAmount}</span>
      )}
    </StyledShiftControl>
  )
}
