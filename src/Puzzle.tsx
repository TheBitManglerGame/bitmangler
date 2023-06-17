import { type Digit, assert } from './Common'

export interface Puzzle {
  puzzleId?: number
  displayName?: string
  bits: Digit[]
  targetBits: Digit[]
  comments: string
  hints?: string[]
  category?: Category
  pointsThresh?: number
}

export type Category = 'INTRO' | 'NOT' | 'AND' | 'OR' | 'XOR' | 'SHIFT' | 'TECHNIQUES'
export type CategoryDisplay = string

export interface Database {
  puzzles: Puzzle[]
  categories: Record<Category, CategoryDisplay>
}

export function parsePuzzle (puzzle: any): Puzzle {
  const bits = puzzle.bits.split('').map((x: string) => +x)
  const targetBits = puzzle.targetBits.split('').map((x: string) => +x)
  assert(bits.length === 8)
  assert(targetBits.length === 8)
  return {
    ...puzzle,
    category: puzzle.category as Category,
    bits,
    targetBits
  }
}
