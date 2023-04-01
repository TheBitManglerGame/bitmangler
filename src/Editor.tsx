import { FC, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { BinaryPanel } from "./BinaryPanel";
import { Operation } from "./Operation";
import { Control } from "./Control";
import { Op } from "./Common";

const EditorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
  margin: 2vw 0;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 2vw;
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

const SimpleControl = styled.div`
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

const Editor: FC = () => {
    const [bits, setBits] = useState([0,0,0,0,0,0,0,0]);
    const [currentOp, setCurrentOp] = useState("Insert operation");
    console.log("current op", currentOp)

    return (
        <DndProvider backend={HTML5Backend}>
            <EditorWrapper>
            <SidebarLeft>
                <SimpleControl>HELP</SimpleControl>
                <SimpleControl><FontAwesomeIcon icon={faRotateLeft} /></SimpleControl>
            </SidebarLeft>
            <EditorContent>
                <BinaryPanel bits={bits} />
                <Operation content={currentOp} />
                <SubmitButton>Submit transition</SubmitButton>
            </EditorContent>
            <RightSidebar>
                <SimpleControl>1/0</SimpleControl>
                <Control name={">>/<<"} setCurrentOp={setCurrentOp} op={Op.SHIFT} />
                <Control name={"AND (&)"} setCurrentOp={setCurrentOp} op={Op.AND} />
                <Control name={"OR  (|)"} setCurrentOp={setCurrentOp} op={Op.OR} />
                <Control name={"XOR (^)"} setCurrentOp={setCurrentOp} op={Op.XOR} />
                <Control name={"NOT (~)"} setCurrentOp={setCurrentOp} op={Op.NOT} />
            </RightSidebar>
            </EditorWrapper>
        </DndProvider>
    );
};

export default Editor;
