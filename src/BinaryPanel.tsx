import React from 'react'
import { useDrop } from 'react-dnd'
import styled from 'styled-components'
import { OpType } from './Common'

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
`

export const StyledBinaryPanel = styled.div<{ fontColor: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width 70%;
  margin: 1vw;
  color: ${props => props.fontColor};
`

interface BinaryPanelProps {
  bits: number[] // array of 0s and 1s
  fontColor: string
};

export const BinaryPanel: React.FC<BinaryPanelProps> = ({ bits, fontColor }) => {
  return (
        <StyledBinaryPanel fontColor={fontColor}>
        {bits.map((bit, index) => (
            <BinaryDigit key={index}>{bit}</BinaryDigit>
        ))}
        </StyledBinaryPanel>
  )
}

export const ConstBinaryPanel: React.FC<BinaryPanelProps> = ({ bits, fontColor }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [canDrop, drop] = useDrop(() => ({
    accept: OpType.CONST_OPERATION,
    drop: () => ({}),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }))
  return (
        <StyledBinaryPanel ref={drop} fontColor={fontColor}>
        {bits.map((bit, index) => (
            <BinaryDigit key={index}>{bit}</BinaryDigit>
        ))}
        </StyledBinaryPanel>
  )
}
