import './App.css'
import Experience from './components/Experience'
import SocketProvider from './components/SocketContext'

function App() {
  return (
    <>
      <SocketProvider>
        <Experience />
      </SocketProvider>
    </>
  )
}

export default App
