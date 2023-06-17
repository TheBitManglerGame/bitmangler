type PuzzleKey = string

export interface SessionInfo {
  solvedPuzzles: Set<PuzzleKey>
}

export function newSessioninfo (): SessionInfo {
  return {
    solvedPuzzles: new Set<PuzzleKey>()
  }
}
