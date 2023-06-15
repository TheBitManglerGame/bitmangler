import React from 'react'
import { type ModalButtonsProps, withModal } from './Modal'

interface HelpProps extends ModalButtonsProps {
}

const HelpModal: React.FC<HelpProps> = () => {
  return (
    <div>
      <h1>Help</h1>
      <p>This is Editor help page</p>
    </div>
  )
}

export const Help = withModal<HelpProps>(HelpModal)
