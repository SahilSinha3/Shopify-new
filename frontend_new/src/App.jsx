import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Chatbot from './components/chatbot';
import './index.css'
import ChatbotLauncher from './components/ChatbotLauncher';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
         <Route path="/ChatbotLauncher" element={<ChatbotLauncher />} />
        <Route path="/Chatbot" element={<Chatbot/>}/>
      </Routes>
    </Router>
  );
}
export default App;
