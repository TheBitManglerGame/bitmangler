import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

/**
 * @jest-environment jsdom
 */

import About from '../About'

describe('About page', () => {
  it('has description', () => {
    render(<About/>)

    const aboutTitle = screen.getByText('About')
    expect(aboutTitle).toBeInTheDocument()

    const aboutDescriptopn = screen.getByText(/this is the about page./i)
    expect(aboutDescriptopn).toBeInTheDocument()
  })
})
