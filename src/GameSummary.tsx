import React from 'react'
import styled from 'styled-components'

import { type ModalButtonsProps, withModal } from './Modal'
import { Code, CodeContent } from './Code'
import { type Expr, prettyPrint, exprScore } from './Expr'

const BitBotImage = styled.img`
  width: 100%;
  max-width: 300px;
  margin: 10px;

  @media (max-width: 768px) {
    max-width: 200px;
  }
`

interface GameSummaryModalProps extends ModalButtonsProps {
  resultExpr: Expr
  bitBotExpr: Expr
}

const GameSummaryModal: React.FC<GameSummaryModalProps> = ({ resultExpr, bitBotExpr }) => {
  return (
        <>
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
        </>
  )
}

export const GameSummary = withModal<GameSummaryModalProps>(GameSummaryModal)
