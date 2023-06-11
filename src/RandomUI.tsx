import styled, { keyframes } from 'styled-components'

export const SubmitButton = styled.button`
  position: absolute;
  bottom: 12vw;
  left: 50%;
  transform: translateX(-50%);
  margin: 4vw 0;
  padding: 16px 64px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 3vw;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0069d9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    transform: translateX(-50%) scale(1.05);
  }

  @media (max-width: 768px) {
    margin: 2vw 0 3vw 0;
    font-size: 4vw;
    padding: 16px 32px;
    bottom: 7vw;
  }
`

export const RightSidebar = styled.div`
  width: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100vh;
`

export const SimpleControl = styled.div`
  background-color: #f2f2f2;
  padding: 2vw;
  display: flex;
  justify-content: center;
  align-items: center;

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
