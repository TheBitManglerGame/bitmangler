import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd'

import { BinOps } from './BinOps';

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
  name: string
}

interface DropResult {
  name: string
}

export const Control: React.FC<ControlProps> = function Control({ name }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: BinOps.BIN_OPERAND,
    item: { name },
    end: (op, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
      if (op && dropResult) {
        alert(`You dropped ${op.name} into ${dropResult.name}!`)
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
