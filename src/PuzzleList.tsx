import React from 'react'
import { type ModalButtonsProps, withModal } from './Modal'

interface PuzzleListProps extends ModalButtonsProps {
}

const PuzzleListModal: React.FC<PuzzleListProps> = () => {
  return (
    <div>
      <h1>Puzzle List</h1>
      <p>This is puzzle list page</p>
    </div>
  )
}

export const PuzzleList = withModal<PuzzleListProps>(PuzzleListModal)
