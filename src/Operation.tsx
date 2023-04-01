import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';

import { BinOps } from './BinOps';

const StyledOperation = styled.div`
  border: 1px dashed #ddd;
  margin: 2vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  padding: 2vw;

  &:hover {
    cursor: pointer;
  }
`;

export const Operation: React.FC = () => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: BinOps.BIN_OPERATION,
        drop: () => ({ name: 'wtfasf' }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))

    const isActive = canDrop && isOver
    // let backgroundColor = '#222'
    // if (isActive) {
    //     backgroundColor = 'darkgreen'
    // } else if (canDrop) {
    //     backgroundColor = 'darkkhaki'
    // }

    return (
        <StyledOperation ref={drop}  data-testid="Operation">
        {isActive ? 'Release to drop' : 'Drag operand here'}
        </StyledOperation>
    )
}
