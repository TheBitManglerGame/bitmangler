import React, { useCallback, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import styled from 'styled-components'
import { type OperandState, OpType, ShiftDir, canDropStyles } from './Common'
import { ShiftControl } from './Control'
import { evalShift } from './Eval'

const UPD_TIMOUT = 200

const StyledBinaryDigit = styled.div<{ canDrop: boolean, fontColor: string, sliding: number, scaleFactor: number, fadeOut: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  color: ${props => props.canDrop ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.7)'};
  font-size: ${props => props.fadeOut ? '1.5vw' : '3vw'};
  font-weight: bold;
  border-radius: 5px;
  transition: ${props => props.sliding !== 0 ? `${UPD_TIMOUT}ms ease-in-out` : 'none'};
  opacity: ${props => (props.fadeOut && props.sliding !== 0 ? 0 : 1)};
  transform: ${props => `translate3d(${props.sliding * 125 * props.scaleFactor}px, 0, 0)`};
  color: ${props => props.canDrop ? 'rgba(0, 0, 0, 0.3)' : props.fontColor};

  &:hover {
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }

  ${props => canDropStyles(props.canDrop)}
`

export const StyledBinaryPanel = styled.div<{ fontColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width 90%;
  margin: 1vw;
  color: ${props => props.fontColor};
`

const BitsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
`

const LeftWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
`

const RightWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`

interface BinaryPanelProps {
  fontColor?: string
  operandState: OperandState
  setOperandState?: React.Dispatch<React.SetStateAction<OperandState>>
  isConst?: boolean
  hideShift?: boolean
}

interface UpdateShiftActions {
  updateLeftShift: () => void
  updateRightShift: () => void
}

const useBinaryPanel = ({ operandState, setOperandState }: BinaryPanelProps): UpdateShiftActions => {
  const { shift } = operandState
  const updateShift = useCallback((direction: number) => {
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
  }, [shift, setOperandState, operandState])

  return {
    updateLeftShift: () => { updateShift(-1) },
    updateRightShift: () => { updateShift(1) }
  }
}

export const BinaryPanel: React.FC<BinaryPanelProps> = ({ operandState, setOperandState, fontColor, hideShift = false, isConst = false }) => {
  const { bits } = operandState
  const { updateLeftShift, updateRightShift } = useBinaryPanel({ operandState, setOperandState })
  const [scaleFactor, setScaleFactor] = useState(1)

  useEffect(() => {
    const updateScaleFactor: () => void = () => {
      const viewportWidth = window.innerWidth
      const newScaleFactor = viewportWidth / 1920
      console.log('newScaleFactor', newScaleFactor)
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
        {bits.map((bit, index) => (
          <StyledBinaryDigit
            key={index}
            canDrop={isConst ? canDrop : false}
            fontColor={fontColor || 'black'}
            sliding={operandState.sliding[index]}
            scaleFactor={scaleFactor}
            fadeOut={(index === 0 && operandState.sliding[index] === -1) || (index === bits.length - 1 && operandState.sliding[index] === 1)}
          >
            {bit}
          </StyledBinaryDigit>
        ))}
        </BitsContainer>
        {operandState.shift !== null && !hideShift &&
        <RightWrapper>
            <ShiftControl direction={ShiftDir.RIGHT} shiftAmount={operandState.shift} onClick={updateRightShift} />
        </RightWrapper>}
    </StyledBinaryPanel>
  )
}
