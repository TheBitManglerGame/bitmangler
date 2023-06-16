
export interface Puzzle {
  bits: string
  targetBits: string
  comments: string
  hints: [string]
  category?: string
  pointsThresh?: number
}
