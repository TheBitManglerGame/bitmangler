import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const navigateToAbout = (): void => {
    navigate('/about')
  }
  const navigateToEditor = (): void => {
    navigate('/editor')
  }
  return (
    <div>
      <h1>Home Page</h1>
      <p>This is going to be the landing page</p>
      <button onClick={navigateToAbout} type="button"> About </button>
      <br/>
      <button onClick={navigateToEditor} type="button"> Editor </button>
    </div>
  )
}

export default HomePage
