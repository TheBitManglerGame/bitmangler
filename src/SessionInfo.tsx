import { type Digit, ZERO } from './Common'

type PuzzleKey = string

export interface SessionInfo {
  solvedPuzzles: Set<PuzzleKey>
  bits: Digit[]
  targetBits: Digit[]
}

export function newSessioninfo (): SessionInfo {
  return {
    solvedPuzzles: new Set<PuzzleKey>(),
    bits: ZERO,
    targetBits: ZERO
  }
}
