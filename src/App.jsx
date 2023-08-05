import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'
import ChatProvider from './Context/ChatProvider'
import './App.css'
function App() {
  return (
    <div className="App">
      <Router>
        <ChatProvider>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/chats' element={<ChatPage/>}/>
        </Routes>
        </ChatProvider>
      </Router>
    </div>
  )
}

export default App
