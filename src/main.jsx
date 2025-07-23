import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeContextProvider } from './context/ThemeContext'
import { SavedVideosContextProvider } from './context/SavedVideosContext'
import { ActiveMenuContextProvider } from './context/ActiveMenuContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeContextProvider>
      <SavedVideosContextProvider>
        <ActiveMenuContextProvider>
          <BrowserRouter>
    <App />
          </BrowserRouter>
        </ActiveMenuContextProvider>
      </SavedVideosContextProvider>
    </ThemeContextProvider>
  </StrictMode>,
)
