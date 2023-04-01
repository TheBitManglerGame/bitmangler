import { FC, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd'

import { OpType, Op } from './Common';

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

export interface ControlProps {
  name: string,
  setCurrentOp: Dispatch<SetStateAction<string>>,
  op: Op,
}

interface DropResult {
  name: string
}

export const Control: FC<ControlProps> = function Control({ name, setCurrentOp, op }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: OpType.BIN_OPERATION,
    item: { name, op },
    end: (op, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
      if (op && dropResult) {
        setCurrentOp(op.name);
        console.log(`${op.name} was selected as an operation`)
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
