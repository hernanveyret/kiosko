import { useState } from 'react'
import Home from './Components/Home'
import Login from './Components/Login'
import './App.css'

function App() {
  const [ isHome, setIsHome ] = useState(false);
  const [ isLogin, setIsLogin ] = useState(true)
  
  return (
    <>
      {
        isLogin &&
          <Login 
          setIsHome={setIsHome}
          setIsLogin={setIsLogin}
          />
      }
      {
        isHome &&
          <Home />
      }
    </>
  )
}

export default App
