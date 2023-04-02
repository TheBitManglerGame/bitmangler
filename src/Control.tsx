import { FC } from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd'

import { OpType, Op, Digit } from './Common';

const StyledControl = styled.div`
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

const StyledSplitControl = styled.div`
  padding: 1vw;
  margin: 1vw;
  border: 2px dotted #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% / 2);
  height: calc(100% / 2);

  &:hover {
    cursor: pointer;
  }
`;

export interface ControlProps {
  name: string,
  setCurrentOp: (op: Op) => void,
  op: Op,
}

interface DropResult {
  name: string
}

export const Control: FC<ControlProps> = function Control({ name, setCurrentOp, op }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: OpType.BIN_OPERATION,
    item: { name, op },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
      if (item.op && dropResult) {
        setCurrentOp(op);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  const opacity = isDragging ? 0.4 : 1
  return (
    <StyledControl ref={drag} style={{ opacity }} data-testid={`box`}>
      {name}
    </StyledControl>
  )
}

export interface ConstControlProps {
  name: string,
  setConstOperand: (operand: Digit) => void,
  operand: Digit,
}

export const ConstControl: FC<ConstControlProps> = function ConstControl({ name, setConstOperand, operand }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: OpType.CONST_OPERATION,
    item: { name, operand },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
      if ((item.operand === 1
         || item.operand === 0) && dropResult) {
        console.log("dropped", item.operand)
        setConstOperand(item.operand);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  const opacity = isDragging ? 0.4 : 1
  return (
    <StyledSplitControl ref={drag} style={{ opacity }} data-testid={`StyledSplitControl`}>
      {name}
    </StyledSplitControl>
  )
}
