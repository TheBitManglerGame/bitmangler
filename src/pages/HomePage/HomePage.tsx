import React from 'react';
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const navigateToAbout = () => {
    navigate("/about");
  }
  const navigateToEditor = () => {
    navigate("/editor");
  }
  return (
    <div>
      <h1>Home Page</h1>
      <p>This is going to be the landing page</p>
      <button role="button" onClick={navigateToAbout} type="button"> About </button>
      <br/>
      <button role="button" onClick={navigateToEditor} type="button"> Editor </button>
    </div>
  );
};

export default HomePage;
