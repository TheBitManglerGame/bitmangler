import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';

const EditorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const BinaryPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width 70%;
`;

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

const EditorContent = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-top: 2.5vw;
  margin-bottom: 20px;
`;

const SubmitButton = styled.button`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  margin: 20px 0;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const RightSidebar = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh; /* Set height to 100% of viewport height */
`;

const SidebarLeft = styled.div`
  width: 20%;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh; /* Set height to 100% of viewport height */
`;

const ControlPanel = styled.div`
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

const Editor: React.FC = () => {
  return (
    <EditorWrapper>
      <SidebarLeft>
        <ControlPanel>HELP</ControlPanel>
        <ControlPanel><FontAwesomeIcon icon={faRotateLeft} /></ControlPanel>
      </SidebarLeft>
      <EditorContent>
        <BinaryPanel>
          <BinaryDigit>0</BinaryDigit>
          <BinaryDigit>1</BinaryDigit>
          <BinaryDigit>0</BinaryDigit>
          <BinaryDigit>1</BinaryDigit>
          <BinaryDigit>0</BinaryDigit>
          <BinaryDigit>1</BinaryDigit>
          <BinaryDigit>0</BinaryDigit>
          <BinaryDigit>1</BinaryDigit>
        </BinaryPanel>
        <SubmitButton>Submit transition</SubmitButton>
      </EditorContent>
      <RightSidebar>
        <ControlPanel>1/0</ControlPanel>
        <ControlPanel>&gt;&gt;/&lt;&lt;</ControlPanel>
        <ControlPanel>AND (&)</ControlPanel>
        <ControlPanel>OR (|)</ControlPanel>
        <ControlPanel>XOR (^)</ControlPanel>
        <ControlPanel>NOT (~)</ControlPanel>
      </RightSidebar>
    </EditorWrapper>
  );
};

export default Editor;
