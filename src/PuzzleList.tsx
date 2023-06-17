import React, { type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { type ModalButtonsProps, withModal } from './Modal'
import { useAppState } from './AppState'
import { type Category, type Puzzle } from './Puzzle'
import { digitsToInt, puzzleKey } from './Common'

interface PuzzleListProps extends ModalButtonsProps {}

const StyledPuzzleList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  overflow: auto;
  margin-bottom: 2vw;
  height: inherit;
`

const StyledPuzzleRow = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  position: relative;
  cursor: pointer;
  border-radius: 5px;
  padding: 3px;

  &:hover {
    background-color: #f0f0f0;
  }
`

const PuzzleProgressContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`

const PuzzleProgressMarker = styled.div<{ completed: boolean }>`
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ completed }) => (completed ? '#transparent' : '#transparent')};
  border: 3px solid ${({ completed }) => (completed ? '#00cc00' : '#D3D3D3')};
  transition: 0.4s ease;

  ::after {
    content: ${({ completed }) => (completed ? "'✔'" : "''")};
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    color: ${({ completed }) => (completed ? '#00cc00' : '#D3D3D3')};
  }
`

const PuzzleListModal: React.FC<PuzzleListProps> = () => {
  const { appState } = useAppState()
  const navigate = useNavigate()
  const initialPuzzlesByCategory: Record<Category, Puzzle[]> = {
    INTRO: [],
    NOT: [],
    AND: [],
    OR: [],
    XOR: [],
    SHIFT: [],
    TECHNIQUES: []
  }
  const startPuzzle = (puzzle: Puzzle): void => {
    const bitsStr = puzzle.bits.join('')
    const targetBitsStr = puzzle.targetBits.join('')
    navigate(`/puzzle?bits=${bitsStr}&targetBits=${targetBitsStr}`)
    console.debug(`http://localhost:3001/puzzle?bits=${bitsStr}&targetBits=${targetBitsStr}`)
  }

  const isSolved = (puzzle: Puzzle): boolean => {
    const key = puzzleKey(puzzle.bits, puzzle.targetBits)
    return appState.session.solvedPuzzles.has(key)
  }

  const renderPuzzle = (puzzle: Puzzle): ReactElement => (
    <StyledPuzzleRow key={`${digitsToInt(puzzle.bits)}${digitsToInt(puzzle.targetBits)}`} onClick={() => { startPuzzle(puzzle) }}>
      <PuzzleProgressContainer>
        <PuzzleProgressMarker completed={isSolved(puzzle)} />
      </PuzzleProgressContainer>
      {puzzle.displayName} - {puzzle.pointsThresh} points
    </StyledPuzzleRow>
  )

  const renderCategory = (category: Category, puzzles: Puzzle[]): ReactElement => (
    <div key={category}>
      <h4>{appState.db.categories[category]}</h4>
      {puzzles.map(renderPuzzle)}
    </div>
  )

  const puzzlesByCategory: Record<Category, Puzzle[]> = appState.db.puzzles.reduce<Record<Category, Puzzle[]>>((acc, puzzle) => {
    if (puzzle.category) {
      acc[puzzle.category] = acc[puzzle.category] ?? []
      acc[puzzle.category].push(puzzle)
    }
    return acc
  }, initialPuzzlesByCategory)

  return (
    <StyledPuzzleList>
      {Object.entries(puzzlesByCategory).map(([category, puzzles]) =>
        renderCategory(category as Category, puzzles))
      }
    </StyledPuzzleList>
  )
}

export const PuzzleList = withModal<PuzzleListProps>(PuzzleListModal)
