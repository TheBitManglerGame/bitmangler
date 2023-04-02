import { FC } from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';

import { ConstBinaryPanel } from './BinaryPanel';
import { OpType, Digit, digitsToInt } from './Common';

const StyledConst = styled.div<{color?: string}>`
  margin: 1vw;
  width: 70%;
  height: 4vw;
  background-color: #f2f2f2;
  border: 1px dotted #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1vw;
  color: ${props => props.color || "grey"};
  opacity: 60%;

  &:hover {
    cursor: pointer;
  }
`;

interface ConstOPerandProps {
    constOperand: Digit[] | null,
}

export const ConstOperand: FC<ConstOPerandProps> = ({constOperand}) => {
    const [{ canDrop }, drop] = useDrop(() => ({
        accept: OpType.CONST_OPERATION,
        drop: () => ({}),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))

    if (constOperand !== null
        && (digitsToInt(constOperand) === 0 || digitsToInt(constOperand) === 1)) {
        return (<ConstBinaryPanel bits={constOperand} fontColor={canDrop ? "black" : "grey"} />)
    } else {
        return (<StyledConst ref={drop}  data-testid="ConstOperandMsg" color={canDrop ? "black" : "grey"}>
                {"Insert constant (0 or 1)"}
                </StyledConst>);
    }
}
