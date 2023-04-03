import React from 'react';
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
    fontColor: string;
    operandState: OperandState;
    setOperandState?: React.Dispatch<React.SetStateAction<OperandState>>;
};

export const BinaryPanel: React.FC<BinaryPanelProps> = ({ operandState, setOperandState, fontColor }) => {
    const { bits, shift } = operandState;
    let updateLeftShift = () => {
        if (shift !== null && shift === -7) return;
        if (setOperandState) setOperandState((prevState: OperandState) => ({
            ...prevState,
            bits: evalShift(operandState.originalBits, shift - 1),
            shift: shift - 1
        }));
    }
    let updateRightShift = () => {
        if (shift !== null && shift === 7) return;
        if (setOperandState) setOperandState((prevState: OperandState) => ({
            ...prevState,
            bits: evalShift(operandState.originalBits, shift + 1),
            shift: shift + 1
        }));
    }
    return (
        <StyledBinaryPanel fontColor={fontColor}>
        {shift !== null &&
            <ShiftControl direction={ShiftDir.LEFT} shiftAmount={shift} onClick={updateLeftShift} />}
        {bits.map((bit, index) => (
            <BinaryDigit key={index}>{bit}</BinaryDigit>
        ))}
        {shift !== null &&
            <ShiftControl direction={ShiftDir.RIGHT} shiftAmount={shift} onClick={updateRightShift} />}
        </StyledBinaryPanel>
    );
};

export const ConstBinaryPanel: React.FC<BinaryPanelProps> = ({ operandState, setOperandState, fontColor }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [canDrop, drop] = useDrop(() => ({
        accept: OpType.CONST_OPERATION,
        drop: () => ({}),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))

    const { bits, shift } = operandState;
    let updateLeftShift = () => {
        if (shift !== null && shift === -7) return;
        if (setOperandState) setOperandState((prevState: OperandState) => ({
            ...prevState,
            bits: evalShift(operandState.originalBits, shift - 1),
            shift: shift - 1
        }));
    }
    let updateRightShift = () => {
        if (shift !== null && shift === 7) return;
        if (setOperandState) setOperandState((prevState: OperandState) => ({
            ...prevState,
            bits: evalShift(operandState.originalBits, shift + 1),
            shift: shift + 1
        }));
    }

    return (
        <StyledBinaryPanel ref={drop} fontColor={fontColor}>
        {shift !== null &&
            <ShiftControl direction={ShiftDir.LEFT} shiftAmount={shift} onClick={updateLeftShift} />}
        {bits.map((bit, index) => (
            <BinaryDigit key={index}>{bit}</BinaryDigit>
        ))}
        {shift !== null &&
            <ShiftControl direction={ShiftDir.RIGHT} shiftAmount={shift} onClick={updateRightShift} />}
        </StyledBinaryPanel>
    );
};
