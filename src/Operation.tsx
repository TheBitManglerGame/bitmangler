import styled from 'styled-components'
import { Op, canDropStyles } from './Common'

const StyledOperation = styled.div<{ canDrop: boolean }>`
  border: 1px dashed #ddd;
  border-radius: 5px;
  margin: 2vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  padding: 2vw;
  font-size: 1.2em;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24);
  }

  ${props => canDropStyles(props.canDrop)}
`

interface OperationProps {
  op: Op
  canDrop: boolean
}

export const Operation: React.FC<OperationProps> = ({ op, canDrop }) => {
  const disp = op === Op.NOOP ? '?' : op
  return (
    <StyledOperation data-testid="Operation" canDrop={canDrop}>
      {canDrop ? 'Insert operation' : disp}
    </StyledOperation>
  )
}
