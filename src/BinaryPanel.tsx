import React from 'react';
import styled from 'styled-components'

const BinaryDigit = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  font-size: 3vw;
  font-weight: bold;
  background-color: #f2f2f2;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
`;

export const StyledBinaryPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width 70%;
`;

type BinaryPanelProps = {
    bits: number[]; // array of 0s and 1s
  };

export const BinaryPanel: React.FC<BinaryPanelProps> = ({ bits }) => {
    return (
        <StyledBinaryPanel>
        {bits.map((bit, index) => (
            <BinaryDigit key={index}>{bit}</BinaryDigit>
        ))}
        </StyledBinaryPanel>
    );
};
