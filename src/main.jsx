import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { GameStateProvider } from './context/GameStateContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameStateProvider>
      <App />
    </GameStateProvider>
  </StrictMode>,
)
