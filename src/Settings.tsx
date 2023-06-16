import React, { useCallback } from 'react'
import styled from 'styled-components'
import Switch from 'react-switch'

import { withModal, type ModalButtonsProps } from './Modal'
import { useAppState } from './AppState'

interface SettingsProps extends ModalButtonsProps {}

const SettingsWrapper = styled.div`
  width: 90%;
  margin: auto;
  padding: 20px;
  margin-bottom: 1vw;
`

const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
`

const Label = styled.label`
  font-size: 1em;
  margin-right: 10px;
`

interface SettingsProps extends ModalButtonsProps {
}

const SettingsModal: React.FC<SettingsProps> = () => {
  const { appState, setAppState } = useAppState()

  const handleSwitchChange = useCallback((checked: boolean) => {
    setAppState({ ...appState, bitHighlightAssistant: checked })
  }, [])

  return (
    <SettingsWrapper>
      <h1>Settings</h1>
      <SwitchWrapper>
        <Label>Bit Highlight Assistant:</Label>
        <Switch
          checked={appState.bitHighlightAssistant}
          onChange={handleSwitchChange}
        />
      </SwitchWrapper>
    </SettingsWrapper>
  )
}

export const Settings = withModal<SettingsProps>(SettingsModal)
