/* Various helpers and types used in UI */

import { type FlattenSimpleInterpolation, css, keyframes } from 'styled-components'

export const enum OpType {
  BIN_OPERATION = 'BinaryOperation',
  CONST_OPERATION = 'ConstOperation',
}

export const enum Op {
  OR = 'OR',
  XOR = 'XOR',
  AND = 'AND',
  NOT = 'NOT',
  NOOP = 'NOOP',
}

export const ALL_ALLOWED_OPS: Op[] = [Op.OR, Op.XOR, Op.NOT, Op.AND]

export function parseAllowedOpFromString (value: string): Op {
  switch (value.toUpperCase()) {
    case 'OR':
      return Op.OR
    case 'XOR':
      return Op.XOR
    case 'AND':
      return Op.AND
    case 'NOT':
      return Op.NOT
    default:
      throw new Error('parseAllowedOpFromString: cannot parse allowed ops')
  }
}

export function isBinOp (op: Op): boolean {
  switch (op) {
    case Op.AND:
    case Op.OR:
    case Op.XOR:
      return true
    default:
      return false
  }
}

export enum ShiftDir { LEFT = 'LEFT', RIGHT = 'RIGHT' };

export function renderDirection (dir: ShiftDir): string {
  if (dir === ShiftDir.LEFT) return '<<'
  if (dir === ShiftDir.RIGHT) return '>>'
  throw new Error('renderDirection: unknown direction')
}

export type AllowedOp = 'or' | 'xor' | 'and' | 'not'

export type Digit = 0 | 1

// TODO: try this?
// export type Byte = [Digit, Digit, Digit, Digit, Digit, Digit, Digit, Digit];

export function genRandomTargetDest (): [Digit[], Digit[]] {
  let target: Digit[] = []
  let dest: Digit[] = []

  do {
    target = generateRandomArray()
    dest = generateRandomArray()
  } while (areArraysEqual(target, dest))

  return [target, dest]
}

function generateRandomArray (): Digit[] {
  return Array.from({ length: 8 }, () => (Math.random() > 0.5 ? 1 : 0) as Digit)
}

function areArraysEqual (a: Digit[], b: Digit[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

export function assert (condition: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}

export function intToDigits (num: number): Digit[] {
  return num.toString(2).padStart(8, '0').split('').map(n => parseInt(n) as Digit)
}

export function digitsToInt (inBits: Digit[]): number {
  assert(inBits.length === 8, 'Input array must have exactly 8 elements')
  return Number.parseInt(inBits.join(''), 2)
}

export function digitsFromUrlParam (paramValue: string | null): Digit[] | null {
  if (paramValue === null) return null
  assert(paramValue.length === 8, 'bits input must have exactly 8 elements')
  const res = paramValue.split('').map(x => parseInt(x, 10))
  assert(res.every(n => n === 1 || n === 0))
  return res as Digit[]
}

export function print8LSB (input: number): string {
  return input.toString(2).slice(-8).padStart(8, '0')
}

export const ONE: Digit[] = intToDigits(1)
export const ZERO: Digit[] = intToDigits(0)

export interface OperandState {
  originalBits: Digit[]
  bits: Digit[]
  shift: number
  sliding: number[]
}

export const borderAnimation = keyframes`
  0% {
    border-color: #ddd;
  }
  50% {
    border-color: #aaa;
  }
  100% {
    border-color: #ddd;
  }
`
export const canDropStyles = (canDrop: boolean): FlattenSimpleInterpolation => {
  return canDrop
    ? css`
        background-color: white;
        color: rgba(0, 0, 0, 0.4);
        animation: ${borderAnimation} 2s linear infinite;
        border-color: #ddd;
      `
    : css``
}
