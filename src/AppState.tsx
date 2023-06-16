import React, { type ReactNode, createContext, useContext, useState } from 'react'

interface AppState {
  env: 'dev' | 'prod'
}

interface AppStateCtx {
  appState: AppState
  setAppState: (appState: AppState) => void
}

function appStateDefault (): AppState {
  return {
    env: 'dev'
  }
}

// Create a context
const AppStateContext = createContext<AppStateCtx>({
  appState: appStateDefault(),
  setAppState: () => {}
})

// Create a provider which will hold the state
export const AppStateProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [appState, setAppState] = useState(appStateDefault())

  return (
    <AppStateContext.Provider value={{ appState, setAppState }}>
      {children}
    </AppStateContext.Provider>
  )
}

// Create a custom hook for convenience, so you can get the config easily from any component
export const useAppState = (): AppStateCtx => {
  return useContext(AppStateContext)
}
