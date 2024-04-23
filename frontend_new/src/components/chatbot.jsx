import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Chatbot() {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:5000');

    webSocket.onopen = () => {
      console.log("WebSocket connection established");
    };
    webSocket.onmessage = (event) => {
      console.log("Message received from server:", event.data);
      try {
        const data = JSON.parse(event.data);
        console.log("Parsed message:", data);
        const newMessage = {
          role: 'assistant',
          text_response: data.text_response,
          audio_data: data.audio_data
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        if (data.audio_data) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audio_data}`);
          audio.play();
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };
    setWs(webSocket);
    return () => webSocket.close();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (messageText) => {
    if (!messageText.trim()) return;
    const userMessage = {
      role: "user",
      text_response: messageText.trim()
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ content: messageText.trim() }));
    } else {
      console.error("WebSocket is not open. Message not sent.");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(newMessage);
    setNewMessage('');
  };

  const startListening = () => {
    setIsListening(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
  };

  const handleGoBack = () => {
    navigate('/ChatbotLauncher');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!showChat && (
        <button
          className="fixed right-4 bottom-4 bg-black text-white hover:bg-gray-500 px-4 py-2 rounded-md"
          onClick={() => setShowChat(true)}
        >
          Open Chat Again
        </button>
      )}
      {showChat && (
        <div
          className="fixed top-1/2 right-[46px] transform -translate-y-1/2 h-[785px] w-[443px] bg-white border rounded-lg shadow-lg overflow-hidden bg-opacity-50 backdrop-filter backdrop-blur-lg"
          style={{
            borderRadius: '24px'
          }}
        >
          <div className="bg-gray-800 flex justify-between p-4 text-white font-bold paddingBottom '10px">
            <button onClick={handleGoBack}>
              <img
                src="/images/leftArrow.png"
                alt="Backbutton"
                style={{ height: '30px', marginRight: '16px' }}
              />
            </button>
            <img
              src="/images/companyLogo.png"
              alt="Logo"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '30px',
              }}
            />
            <button
              className="text-white"
              onClick={() => setShowChat(false)}
            >
              <img
                src="/images/Multiply.png"
                alt="Company Logo"
                style={{ height: '30px', marginRight: '16px' }}
              />
            </button>
          </div>
          <div
            className="max-w-screen-lg mx-auto overflow-y-auto"
            style={{
              height: 'calc(100% - 128px)',
              paddingBottom: '2rem',
              paddingTop: '2rem',
              paddingRight: '1rem',
              textAlign: 'right',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <img src="/images/Letter.png" alt="Message icon"
                style={{ height: '30px', alignContent: 'center'}}/>
                <h1 className="text-2xl font-bold mb-4">No messages</h1>
                <p className="text-gray-500">Message from the team will be shown here.</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`message rounded-lg p-2 mb-2 ${message.role === 'assistant'
                    ? 'bg-black text-white self-start'
                    : 'bg-black text-white self-end'
                    }`}
                  style={{ wordBreak: 'break-word', maxWidth: '80%' }}
                >
                  <span>{message.text_response}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="absolute bottom-0 w-full bg-white border-grey-600">
            <form
              className="p-4 flex items-center"
              onSubmit={handleSendMessage}
            >
              <input
                id="message"
                type="text"
                autoComplete="off"
                className="border-2 border-white rounded-md p-2 w-full focus:outline-none focus:border-transparent"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask a question..."
              />
              <button
                type="submit"
                className={`ml-2 bg-black ${newMessage.trim() !== '' || isListening
                    ? 'hover:bg-blue-600'
                    : 'hidden'
                  } text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                Send
              </button>
              <button
                type="button"
                onClick={startListening}
                className="ml-2 text-blue-500 hover:text-blue-600 px-4 py-2 rounded-md flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <img
                  src={
                    isListening
                      ? '/images/microphone.png'
                      : '/images/voice.png'
                  }
                  alt="Speak"
                  style={{ width: '30px', height: '30px' }}
                />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}