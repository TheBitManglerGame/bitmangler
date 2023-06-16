import React from 'react'

import { type ModalButtonsProps, withModal } from './Modal'

interface SettingsProps extends ModalButtonsProps {
}

const SettingsModal: React.FC<SettingsProps> = () => {
  return (
    <div>
      <h1>Settings</h1>
      <p>This is Editor settings page</p>
    </div>
  )
}

export const Settings = withModal<SettingsProps>(SettingsModal)
