import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import { OperandState, OpType, ShiftDir } from './Common';
import { ShiftControl } from './Control';
import { evalShift } from './Eval';

const BinaryDigit = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  font-size: 3vw;
  font-weight: bold;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
`;

export const StyledBinaryPanel = styled.div<{fontColor: string}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width 70%;
  margin: 1vw;
  color: ${props => props.fontColor};
`;

interface BinaryPanelProps {
    fontColor?: string;
    operandState: OperandState;
    setOperandState?: React.Dispatch<React.SetStateAction<OperandState>>;
    isConst?: boolean;
}

const useBinaryPanel = ({ operandState, setOperandState }: BinaryPanelProps) => {
    const { shift } = operandState;
    const updateShift = useCallback((direction: number) => {
        if (shift !== null && ((shift === -7 && direction < 0) || (shift === 7 && direction > 0))) return;
        if (setOperandState) setOperandState((prevState: OperandState) => ({
            ...prevState,
            bits: evalShift(operandState.originalBits, shift + direction),
            shift: shift + direction
        }));
    }, [shift, setOperandState, operandState]);

    return {
        updateLeftShift: () => updateShift(-1),
        updateRightShift: () => updateShift(1),
    };
};


export const BinaryPanel: React.FC<BinaryPanelProps> = ({ operandState, setOperandState, fontColor, isConst = false }) => {
    const { bits } = operandState;
    const { updateLeftShift, updateRightShift } = useBinaryPanel({ operandState, setOperandState });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [canDrop, drop] = useDrop(() => ({
        accept: OpType.CONST_OPERATION,
        drop: () => ({}),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));

    return (
        <StyledBinaryPanel ref={isConst ? drop : null} fontColor={fontColor || "black"}>
            {operandState.shift !== null &&
                <ShiftControl direction={ShiftDir.LEFT} shiftAmount={operandState.shift} onClick={updateLeftShift} />}
            {bits.map((bit, index) => (
                <BinaryDigit key={index}>{bit}</BinaryDigit>
            ))}
            {operandState.shift !== null &&
                <ShiftControl direction={ShiftDir.RIGHT} shiftAmount={operandState.shift} onClick={updateRightShift} />}
        </StyledBinaryPanel>
    );
};
