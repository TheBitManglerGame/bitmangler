import styled, { keyframes } from 'styled-components'

export const SubmitButton = styled.button`
  position: absolute;
  bottom: 2vw;
  left: 50%;
  transform: translateX(-50%);
  margin: 2vw 0;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 2vw;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0069d9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    transform: translateX(-50%) scale(1.05);
  }

  @media (max-width: 768px) {
    font-size: 4vw;
    padding: 8px 16px;
    bottom: 5vw;
  }
`

export const RightSidebar = styled.div`
  width: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh; /* Set height to 100% of viewport height */
`

export const SimpleControl = styled.div`
  height: calc(100% / 6);
  background-color: #f2f2f2;
  border: 1px solid #ddd;
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
  font-size: 2vw;
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
  width: 20%;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh; /* Set height to 100% of viewport height */
  overflow: auto;
  position: relative;
`
