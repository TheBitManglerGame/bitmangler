import styled from 'styled-components'

import { type Expr, exprScore, prettyPrint } from './Expr'
import { Code, CodeContent } from './Code'

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: auto;
  padding: 1rem;
`
const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: auto;
`

const ModalContent = styled.div`
  background-color: #fdfdfd;
  padding: 2rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
  margin: 1rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-top: 5%;
  }
`

const ModalButton = styled.button`
  padding: 10px 20px;
  margin: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

const BitBotImage = styled.img`
  width: 100%;
  max-width: 300px;
  margin: 10px;

  @media (max-width: 768px) {
    max-width: 200px;
  }
`

interface ModalProps {
  onRetryClick: () => void
  onNewGameClick: () => void
  resultExpr: Expr
  bitBotExpr: Expr
}

export const GameSummaryModal: React.FC<ModalProps> = ({ onRetryClick, onNewGameClick, resultExpr, bitBotExpr }) => {
  return (
    <StyledModal>
      <ModalContainer>
        <ModalContent>
          <h2>Congratulations! You have reached the target!</h2>
          <p>Final solution:</p>
          <Code>
            <CodeContent>{prettyPrint(resultExpr)}</CodeContent>
          </Code>
          <p>Score: {exprScore(resultExpr)} </p>
          <BitBotImage src="/mrbitbot.png" alt="mrbitbot" />
          <p>Mr. Bitbot provided this solution:</p>
          <Code>
            <CodeContent>{prettyPrint(bitBotExpr)}</CodeContent>
          </Code>
          <p>Mr. Bitbot Score: {exprScore(bitBotExpr)} </p>
          <div>
              <ModalButton onClick={onRetryClick}>Retry</ModalButton>
              <ModalButton onClick={onNewGameClick}>New game</ModalButton>
          </div>
        </ModalContent>
      </ModalContainer>
    </StyledModal>
  )
}
