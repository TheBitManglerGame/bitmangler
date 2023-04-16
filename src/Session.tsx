import { type FC, useState } from 'react'

import Editor from './Editor'
import { type Digit, digitsFromUrlParam, genRandomTargetDest } from './Common'
import { solve } from './Solver'
import { useNavigate } from 'react-router-dom'
import { type Expr } from './AST'

function getBitQueryParams (): { bits: Digit[] | null, targetBits: Digit[] | null } {
  const searchParams: URLSearchParams = new URLSearchParams(window.location.search)

  if (!searchParams.get('bits')) {
    console.warn("[WARN] 'bits' url parameter is not set")
  }

  if (!searchParams.get('targetBits')) {
    console.warn("[WARN] 'targetBits' url parameter is not set")
  }

  return {
    bits: digitsFromUrlParam(searchParams.get('bits')),
    targetBits: digitsFromUrlParam(searchParams.get('targetBits'))
  }
}

const PuzzleSession: FC = () => {
  const navigate = useNavigate()

  const [bitsGen, targetBitsGen] = genRandomTargetDest()
  const { bits: bitsFromUrlParam, targetBits: targetBitsFromUrlParam } = getBitQueryParams()
  const [bits, setBits] = useState<Digit[]>(bitsFromUrlParam || bitsGen)
  const [targetBits, setTargetBits] = useState<Digit[]>(targetBitsFromUrlParam || targetBitsGen)
  const [solution, setSolution] = useState<Expr | null>(solve(bits, targetBits))
  const [gameKey, setGameKey] = useState(0)

  const onNewGame = (): void => {
    const [bits, targetBits] = genRandomTargetDest()
    const bitsStr = bits.join('')
    const targetBitsStr = targetBits.join('')
    navigate(`/puzzle?bits=${bitsStr}&targetBits=${targetBitsStr}`)
    console.debug(`http://localhost:3001/puzzle?bits=${bits.join('')}&targetBits=${targetBits.join('')}`)
    setBits(bits)
    setTargetBits(targetBits)
    setSolution(solve(bits, targetBits))
    setGameKey(gameKey + 1)
  }

  return (<Editor key={gameKey} bits={bits} targetBits={targetBits} solverSolution={solution} onNewGame={onNewGame}/>)
}

export default PuzzleSession
