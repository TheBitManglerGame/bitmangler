import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';

import { OpType, Op } from './Common';

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

interface OperationProps {
    content: Op,
}

export const Operation: React.FC<OperationProps> = ({content}) => {
    const [{ canDrop }, drop] = useDrop(() => ({
        accept: OpType.BIN_OPERATION,
        drop: () => ({}),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))

    const disp = content === Op.NOOP ? "?" : content;
    return (
        <StyledOperation ref={drop}  data-testid="Operation">
            {canDrop ? "Insert operation" : disp}
        </StyledOperation>
    )
}
