import styled from "styled-components";

import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { Fragment } from "react"
import { Expr, prettyPrint, evaluate } from "./AST"
import { print8LSB } from "./Common"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FrameDisplay = styled.div`
    padding: 1rem;
    border: 1px solid #ccc;
    margin: 1rem;
    border-radius: 5px;
    align-selft: flex-start;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: visible;
    position: relative;
`;

const StyledEvalStack = styled.div`
`;

export const TargetDisplay = styled(FrameDisplay)`
  margin-top: 5em;
  align-self: stretch;
  width: relative;
  bottom: 0;
  border: 3px solid #2696fc;
  background-color: #badeff;
`;

const Arrow = styled.div`
    width: 10px;
    height: 10px;
    border-top: 4px solid #32CD32;
    border-right: 4px solid #32CD32;
    transform: rotate(135deg);
    margin: 0.5rem auto;
`;

const CloseIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 1;
`;

interface EvalStackProps {
    frames: Expr[];
    onDropLast: () => void;
}

export const EvalStack: React.FC<EvalStackProps> = ({frames, onDropLast}) => {
    return (
        <StyledEvalStack>
            {frames.map((frame, index) => (
                <Fragment key={index}>
                    <FrameDisplay>
                        {index !== 0 && index === frames.length - 1 && (
                        <CloseIcon icon={faTimes} onClick={onDropLast} />
                        )}
                        <pre>{`${prettyPrint(frame)} ${index === 0 ? "" : "=> " + print8LSB(evaluate(frame))}`}</pre>
                    </FrameDisplay>
                    {index < frames.length - 1 && <Arrow />}
                </Fragment>
            ))}
        </StyledEvalStack>
    );
}
