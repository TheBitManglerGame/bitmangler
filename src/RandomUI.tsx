import styled, { keyframes } from 'styled-components'

export const SubmitButton = styled.button`
  margin: 4vw 0;
  padding: 16px 64px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 3vw;
  transition: all 0.3s ease;
  align-self: center;

  &:hover {
    background-color: #0069d9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    margin: 2vw 0 3vw 0;
    font-size: 3vw;
    padding: 16px 32px;
    bottom: 5vw;
  }
`

export const RightSidebar = styled.div`
  width: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100vh;
`

export const SimpleControls = styled.div`
  padding: 2vw;
  display: flex;
  justify-content: space-between;

  &:hover {
    cursor: pointer;
  }
`
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
`

export const ResultArrow = styled.div`
  font-size: 1vw;
  margin: 2vw;
  animation: ${pulseAnimation} 2s infinite ease-in-out;
`

export const SplitControl = styled.div`
  height: calc(100% / 6);
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const LeftSidebar = styled.div`
  width: 15%;
  min-height: 80vh;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: auto;
  position: relative;
  border: 1px solid #ddd;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-top: 5%;

  @media (max-width: 768px) {
    width: 20%;
  }
`
