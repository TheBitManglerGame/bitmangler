import styled from 'styled-components'
import React, { useState } from 'react'

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: auto;
  padding: 1rem;
`
const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: auto;
`

const ModalContent = styled.div`
  background-color: #fdfdfd;
  padding: 2rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
  margin: 1rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-top: 5%;
  }
`

const ModalButton = styled.button`
  padding: 10px 20px;
  margin: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

export function useModal (initialState = false): { isOpen: boolean, openModal: () => void, closeModal: () => void } {
  const [isOpen, setIsOpen] = useState<boolean>(initialState)

  const openModal = (): void => { setIsOpen(true) }
  const closeModal = (): void => { setIsOpen(false) }

  return { isOpen, openModal, closeModal }
}

interface ButtonAction {
  label: string
  action: () => void
}

export interface ModalButtonsProps {
  buttons?: Record<string, ButtonAction>
}

interface ModalProps extends ModalButtonsProps {
  children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ children, buttons }) => {
  return (
    <StyledModal>
      <ModalContainer>
        <ModalContent>
          {children}
          {buttons && (
            <div>
              {Object.keys(buttons).map((key) => (
                <ModalButton key={key} onClick={buttons[key].action}>
                  {buttons[key].label}
                </ModalButton>
              ))}
            </div>
          )}
        </ModalContent>
      </ModalContainer>
    </StyledModal>
  )
}
// A higher order component that takes a component to render inside the Modal.
// The return type is a new component that takes the props for the given component.
export function withModal<T> (Component: React.ComponentType<T>): React.FC<T & { buttons?: Record<string, ButtonAction>, children?: React.ReactNode }> {
  return function WrappedComponent (props: T & { buttons?: Record<string, ButtonAction>, children?: React.ReactNode }) {
    return (
      <Modal {...props}>
        <Component {...props} />
      </Modal>
    )
  }
}
