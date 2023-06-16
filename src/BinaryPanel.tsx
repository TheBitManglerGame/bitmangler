import React, { useCallback, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import styled from 'styled-components'
import { type OperandState, OpType, ShiftDir, canDropStyles, type Digit } from './Common'
import { ShiftControl } from './Control'
import { evalShift } from './Eval'
import { useAppState } from './AppState'

const UPD_TIMOUT = 200
const MOBILE_VIEWPORT_WIDTH = 768

interface StyledBinaryDigitProps {
  canDrop: boolean
  fontColor: string
  sliding: number
  scaleFactor: number
  fadeOut: boolean
  isWrong?: boolean
}

const StyledBinaryDigit = styled.div<StyledBinaryDigitProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  color: ${props => props.canDrop ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.7)'};
  font-size: ${props => props.fadeOut ? '2.5vw' : '5vw'};
  font-weight: bold;
  border-radius: 5px;
  transition: ${props => props.sliding !== 0 ? `${UPD_TIMOUT}ms ease-in-out` : 'none'};
  opacity: ${props => (props.fadeOut && props.sliding !== 0 ? 0 : 1)};
  transform: ${props => `translate3d(${props.sliding * 125 * props.scaleFactor}px, 0, 0)`};
  color: ${props => props.canDrop ? 'rgba(0, 0, 0, 0.3)' : props.fontColor};
  width: 4vw;
  box-sizing: border-box;
  border: ${props => props.isWrong ? '1px solid #fcd2d2' : 'none'};
  background-color: ${props => props.isWrong ? 'rgba(247, 208, 208, 0.5)' : 'transparent'};
  animation: ${props => props.isWrong ? 'flicker 2s linear infinite' : 'none'};

  &:hover {
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    font-size: ${props => props.fadeOut ? '2.5vw' : '5vw'};
  }

  ${props => canDropStyles(props.canDrop)}

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`

export const StyledBinaryPanel = styled.div<{ fontColor: string }>`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width 90%;
  margin: 1vw;
  color: ${props => props.fontColor};
`

const BitsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 85%;

  @media (max-width: 768px) {
  }
`

const LeftWrapper = styled.div`
  flex: 1;
  display: flex;
  // justify-content: flex-start;

  @media (max-width: 768px) {
    margin-right: 2vw;
  }
`

const RightWrapper = styled.div`
  flex: 1;
  display: flex;
  // justify-content: flex-end;

  @media (max-width: 768px) {
  }
`

interface BinaryPanelProps {
  fontColor?: string
  operandState: OperandState
  setOperandState?: React.Dispatch<React.SetStateAction<OperandState>>
  isConst?: boolean
  hideShift?: boolean
  targetBits?: Digit[]
}

interface UpdateShiftActions {
  updateLeftShift: () => void
  updateRightShift: () => void
}

const useBinaryPanel = ({ operandState, setOperandState }: BinaryPanelProps): UpdateShiftActions => {
  const { shift } = operandState
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_VIEWPORT_WIDTH)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_VIEWPORT_WIDTH)
    }
    window.addEventListener('resize', checkScreenSize)
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const updateShift = useCallback((direction: number) => {
    if (isMobile) { // TODO: disable animation via settings
      if (shift !== null && ((shift === -7 && direction < 0) || (shift === 7 && direction > 0))) return
      if (setOperandState) {
        setOperandState((prevState: OperandState) => ({
          ...prevState,
          shift: shift + direction,
          bits: evalShift(operandState.originalBits, shift + direction)
        }))
      }
      return
    }

    // If not mobile, proceed with animation
    if (shift !== null && ((shift === -7 && direction < 0) || (shift === 7 && direction > 0))) return
    if (setOperandState) {
      setOperandState((prevState: OperandState) => ({
        ...prevState,
        shift: shift + direction,
        sliding: prevState.sliding.map(() => direction)
      }))
      // Delay the update of bits field
      setTimeout(() => {
        setOperandState((prevState: OperandState) => ({
          ...prevState,
          bits: evalShift(operandState.originalBits, shift + direction)
        }))
      }, UPD_TIMOUT)
      // Reset sliding values after transition is complete
      setTimeout(() => {
        setOperandState((prevState: OperandState) => ({
          ...prevState,
          sliding: prevState.sliding.map(() => 0)
        }))
      }, UPD_TIMOUT)
    }
  }, [shift, setOperandState, operandState, isMobile])

  return {
    updateLeftShift: () => { updateShift(-1) },
    updateRightShift: () => { updateShift(1) }
  }
}

export const BinaryPanel: React.FC<BinaryPanelProps> = ({ operandState, setOperandState, fontColor, hideShift = false, isConst = false, targetBits }) => {
  const { bits } = operandState
  const { updateLeftShift, updateRightShift } = useBinaryPanel({ operandState, setOperandState })
  const [scaleFactor, setScaleFactor] = useState(1)
  const { appState } = useAppState()

  useEffect(() => {
    const updateScaleFactor: () => void = () => {
      const viewportWidth = window.innerWidth
      const newScaleFactor = viewportWidth / 1920
      setScaleFactor(newScaleFactor)
    }

    updateScaleFactor()
    window.addEventListener('resize', updateScaleFactor)

    return () => {
      window.removeEventListener('resize', updateScaleFactor)
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ canDrop }, drop] = useDrop(() => ({
    accept: OpType.CONST_OPERATION,
    drop: () => ({}),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }))

  return (
    <StyledBinaryPanel ref={isConst ? drop : null} fontColor={fontColor || 'black'}>
      {operandState.shift !== null && !hideShift &&
        <LeftWrapper>
          <ShiftControl direction={ShiftDir.LEFT} shiftAmount={operandState.shift} onClick={updateLeftShift} />
        </LeftWrapper>}
      <BitsContainer>
        {bits.map((bit, index) => {
          const isWrong = targetBits && bit !== targetBits[index]
          return (
            <StyledBinaryDigit
              key={index}
              canDrop={isConst ? canDrop : false}
              fontColor={fontColor || 'black'}
              sliding={operandState.sliding[index]}
              scaleFactor={scaleFactor}
              fadeOut={(index === 0 && operandState.sliding[index] === -1) || (index === bits.length - 1 && operandState.sliding[index] === 1)}
              isWrong={appState.bitHighlightAssistant && isWrong}>
              {bit}
            </StyledBinaryDigit>
          )
        })}
      </BitsContainer>
      {operandState.shift !== null && !hideShift &&
      <RightWrapper>
        <ShiftControl direction={ShiftDir.RIGHT} shiftAmount={operandState.shift} onClick={updateRightShift} />
      </RightWrapper>}
    </StyledBinaryPanel>
  )
}
