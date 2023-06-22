import React, { type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { type ModalButtonsProps, withModal } from './Modal'
import { useAppState } from './AppState'
import { type Category, type Puzzle } from './Puzzle'
import { areArraysEqual, digitsToInt, puzzleKey } from './Common'

interface PuzzleListProps extends ModalButtonsProps {}

const StyledPuzzleList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
`

const PuzzleProgressContainer = styled.div`
display: flex;
align-items: center;
margin-right: 10px;
`

const PuzzleProgressMarker = styled.div<{ completed: boolean }>`
  margin-left: 5px;
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid ${({ completed }) => (completed ? '#00cc00' : '#D3D3D3')};
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

const StyledCatHeading = styled.h4`
  padding-left: 15px;
  `

const StyledCatContainer = styled.div`
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  margin-bottom: 20px;
  `

const StyledPuzzleRow = styled.div<{ active?: boolean }>`
    display: flex;
    align-items: center;
    position: relative;
    cursor: ${({ active }) => (!active ? 'pointer' : 'default')};
    border-radius: 5px;
    padding: 10px;
    border-top: ${({ active }) => (active ? '1px solid #e6e6e6' : 'none')};
    background-color: ${({ active }) => (active ? '#f0f0f0' : 'none')};

    &:hover {
      background-color: ${({ active }) => (!active ? '#f0f0f0' : 'none')};
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

  const renderPuzzle = (puzzle: Puzzle): ReactElement => {
    const isActive = areArraysEqual(appState.session.bits, puzzle.bits) && areArraysEqual(appState.session.targetBits, puzzle.targetBits)
    return (
    <StyledPuzzleRow key={`${digitsToInt(puzzle.bits)}${digitsToInt(puzzle.targetBits)}`} onClick={() => { !isActive && startPuzzle(puzzle) }} active={isActive}>
      <PuzzleProgressContainer>
        <PuzzleProgressMarker completed={isSolved(puzzle)} />
      </PuzzleProgressContainer>
      {puzzle.displayName} - {puzzle.comments}
    </StyledPuzzleRow>)
  }

  const renderCategory = (category: Category, puzzles: Puzzle[]): ReactElement => (
    <StyledCatContainer key={category}>
      <StyledCatHeading>{appState.db.categories[category]}</StyledCatHeading>
      {puzzles.map(renderPuzzle)}
    </StyledCatContainer>
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
