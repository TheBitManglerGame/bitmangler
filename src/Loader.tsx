import { parsePuzzle, type Database } from './Puzzle'
import db from './db.json'

export function loadDatabase (): Database {
  const database: Database = {
    puzzles: db.puzzles.map(parsePuzzle),
    categories: db.categories
  }
  return database
}
