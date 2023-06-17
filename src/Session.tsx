import { type FC, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Editor from './Editor'
import { type Digit, digitsFromUrlParam, genRandomTargetDest, type Op, parseAllowedOpFromString, ALL_ALLOWED_OPS } from './Common'
import { solve } from './Solver'
import { type Expr } from './Expr'

interface BitQueryParams {
  bits: Digit[] | null
  targetBits: Digit[] | null
  allowedOps: Op[]
}

function getBitQueryParams (): BitQueryParams {
  const searchParams: URLSearchParams = new URLSearchParams(window.location.search)

  if (!searchParams.get('bits')) {
    console.warn("[WARN] 'bits' url parameter is not set")
  }

  if (!searchParams.get('targetBits')) {
    console.warn("[WARN] 'targetBits' url parameter is not set")
  }

  let allowedOps: Op[]
  const allowedOpsParamsString = searchParams.get('allowedOps')
  if (!allowedOpsParamsString) {
    allowedOps = ALL_ALLOWED_OPS
  } else {
    allowedOps = allowedOpsParamsString.split(',').map(parseAllowedOpFromString)
  }
  console.log('allowedOps:', allowedOps)
  return {
    bits: digitsFromUrlParam(searchParams.get('bits')),
    targetBits: digitsFromUrlParam(searchParams.get('targetBits')),
    allowedOps
  }
}

const PuzzleSession: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Use a useEffect hook to respond to changes in the URL parameters.
  useEffect(() => {
    const { bits: bitsFromUrlParam, targetBits: targetBitsFromUrlParam } = getBitQueryParams()

    // Only update state if the URL parameters are not null.
    if (bitsFromUrlParam && targetBitsFromUrlParam) {
      setBits(bitsFromUrlParam)
      setTargetBits(targetBitsFromUrlParam)
      setSolution(solve(bitsFromUrlParam, targetBitsFromUrlParam))
      setGameKey(gameKey + 1) // Increment gameKey to trigger a re-render.
    }
  }, [location.search]) // The useEffect hook will run again if the search part of the location (i.e., the URL parameters) changes.

  const [bitsGen, targetBitsGen] = genRandomTargetDest()
  const { bits: bitsFromUrlParam, targetBits: targetBitsFromUrlParam, allowedOps: allowedOpsURLParam } = getBitQueryParams()
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

  return (<Editor key={gameKey} bits={bits} targetBits={targetBits} allowedOps={allowedOpsURLParam} solverSolution={solution} onNewGame={onNewGame}/>)
}

export default PuzzleSession
