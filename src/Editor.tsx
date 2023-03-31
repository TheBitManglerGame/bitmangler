import React from 'react';
import styled from 'styled-components';

const EditorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const EditorContent = styled.div`
  width: 80%;
`;

const Sidebar = styled.div`
  width: 20%;
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
`;

const Editor: React.FC = () => {
  return (
    <EditorWrapper>
      <EditorContent>
        <h1>Editor</h1>
        <p>This is the editor page.</p>
      </EditorContent>
      <Sidebar>
        <ControlPanel>1/0</ControlPanel>
        <ControlPanel>&gt;&gt;/&lt;&lt;</ControlPanel>
        <ControlPanel>AND (&)</ControlPanel>
        <ControlPanel>OR (|)</ControlPanel>
        <ControlPanel>XOR (^)</ControlPanel>
        <ControlPanel>NOT (~)</ControlPanel>
      </Sidebar>
    </EditorWrapper>
  );
};

export default Editor;
