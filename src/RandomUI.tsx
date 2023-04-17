import styled from 'styled-components'

export const SubmitButton = styled.button`
  position: fixed;
  bottom: 0;
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
`

export const RightSidebar = styled.div`
  width: 20%;
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

export const ResultArrow = styled.div`
  font-size: 2vw;
  margin: 2vw;
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
  width: 27%;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh; /* Set height to 100% of viewport height */
  overflow: auto;
  position: relative;
`
