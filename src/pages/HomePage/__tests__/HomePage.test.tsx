import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

/**
 * @jest-environment jsdom
 */

import HomePage from '../HomePage'

// mock router
const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}))

describe('HomePage page', () => {
  it('has description', () => {
    render(<HomePage/>)

    const aboutTitle = screen.getByText('Home Page')
    expect(aboutTitle).toBeInTheDocument()

    const aboutDescriptopn = screen.getByText(/This is going to be the landing page/i)
    expect(aboutDescriptopn).toBeInTheDocument()

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(2)
  })
})
