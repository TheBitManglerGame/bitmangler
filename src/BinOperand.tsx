import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';

import { BinOps } from './BinOps';

const StyledBinOperand = styled.div`
  height: 3vw;
  width: 3vw;
  border: 1px dashed #ddd;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;

  &:hover {
    cursor: pointer;
  }
`;

export const BinOperand: React.FC = () => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: BinOps.BIN_OPERAND,
        drop: () => ({ name: 'wtfasf' }),
        collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        }),
    }))

    const isActive = canDrop && isOver
    let backgroundColor = '#222'
    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDrop) {
        backgroundColor = 'darkkhaki'
    }

    return (
        <StyledBinOperand ref={drop}  data-testid="binoperand">
        {isActive ? 'Release to drop' : 'Drag operand here'}
        </StyledBinOperand>
    )
}
