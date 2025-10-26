import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@livekit/components-styles';
import App from './App.tsx'
import SocketProvider from './components/SocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </StrictMode>,
)
