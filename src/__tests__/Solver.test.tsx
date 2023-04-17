import { solve } from '../Solver'
import { evaluate } from '../Expr'
import { genRandomTargetDest, intToDigits } from '../Common'

describe('Solver', () => {
  let debugSpy: any

  beforeAll(() => {
    debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {})
    debugSpy.mockRestore()
  })

  afterAll(() => {
    debugSpy.mockRestore()
  })

  for (let i = 0; i < 200; i++) {
    const [to, from] = genRandomTargetDest()

    test.concurrent(`returns correct solution for ${to.join('')} => ${from.join('')}`, async () => {
      const expr = solve(from, to)
      if (expr) {
        const result = intToDigits(evaluate(expr))
        expect(result).toEqual(to)
      } else {
        console.error('failed to solve', to.join(''), from.join(''))
      }
    })
  }
})
