import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'

import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Fragment } from 'react'
import { type Expr, prettyPrint, evaluate } from './Expr'
import { print8LSB } from './Common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const FrameDisplay = styled.div<{ borderColor?: string, backgroundColor?: string }>`
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

    @media (max-width: 768px) {
      font-size: 2vw;
    }
`

const StyledEvalStack = styled.div`
`

export const HighlightedFrameDisplay = styled(FrameDisplay)<{ borderColor?: string, backgroundColor?: string }>`
  margin-top: 1.5vw;
  align-self: stretch;
  width: relative;
  bottom: 0;
  border: 3px solid ${({ borderColor }) => borderColor};
  background-color: ${({ backgroundColor }) => backgroundColor};

  @media (max-width: 768px) {
    margin-top: 3em;
    font-size: 2vw;
  }
`
// border: 3px solid #2696fc;
// background-color: #badeff;

const Arrow = styled.div`
    width: 10px;
    height: 10px;
    border-top: 4px solid #32CD32;
    border-right: 4px solid #32CD32;
    transform: rotate(135deg);
    margin: 0.5rem auto;
`

const CloseIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 1;
`

interface EvalStackProps {
  frames: Expr[]
  onDropLast: () => void
  leftSidebarWidth: number
}

export const EvalStack: React.FC<EvalStackProps> = ({ frames, onDropLast, leftSidebarWidth }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  return (
    <StyledEvalStack>
      {frames.map((frame, index) => {
        const evaluationResult = print8LSB(evaluate(frame))
        const averageCharWidth = 40
        const shouldRenderFullContent = evaluationResult.length * averageCharWidth < leftSidebarWidth * 0.8
        const DisplayComponent = index === 0 ? HighlightedFrameDisplay : FrameDisplay

        return (
          <Fragment key={index}>
           <DisplayComponent
            borderColor={'#8B8000'} backgroundColor={'#FFFF8F'}
            >
              {index !== 0 && index === frames.length - 1 && (
                <CloseIcon icon={faTimes} onClick={onDropLast} />
              )}
              <pre>
              {isMobile
                ? evaluationResult
                : index === 0
                  ? 'Input: ' + evaluationResult
                  : shouldRenderFullContent
                    ? `${prettyPrint(frame)} => ${evaluationResult}`
                    : evaluationResult}
              </pre>
            </DisplayComponent>
            {index < frames.length - 1 && <Arrow />}
          </Fragment>
        )
      })}
    </StyledEvalStack>
  )
}
