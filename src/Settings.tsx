import React from 'react'

import { type ModalButtonsProps, withModal } from './Modal'
import { useAppState } from './AppState'

interface SettingsProps extends ModalButtonsProps {
}

const SettingsModal: React.FC<SettingsProps> = () => {
  const { appState, setAppState } = useAppState()

  const handleToggleEnv = (): void => {
    const newEnv = appState.env === 'dev' ? 'prod' : 'dev'
    setAppState({ ...appState, env: newEnv })
    console.log('appState:', appState)
  }

  return (
    <div>
      <h1>Settings</h1>
      <p>This is Editor settings page</p>
      <button onClick={handleToggleEnv}>Toggle Environment</button>
    </div>
  )
}

export const Settings = withModal<SettingsProps>(SettingsModal)
