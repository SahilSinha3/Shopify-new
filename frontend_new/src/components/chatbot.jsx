// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function Chatbot() {
//   const navigate = useNavigate();
//   const [newMessage, setNewMessage] = useState('');
//   const [showChat, setShowChat] = useState(true);
//   const [messages, setMessages] = useState([]);
//   const [ws, setWs] = useState(null);
//   const [isListening, setIsListening] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const webSocket = new WebSocket('ws://localhost:3000');

//     webSocket.onopen = () => {
//       console.log("WebSocket connection established");
//     };
//     webSocket.onmessage = (event) => {
//       console.log("Message received from server:", event.data);
//       try {
//         const data = JSON.parse(event.data);
//         console.log("Parsed message:", data);
//         const newMessage = {
//           role: 'assistant',
//           text_response: data.text_response,
//           audio_data: data.audio_data
//         };
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//         if (data.audio_data) {
//           const audio = new Audio(`data:audio/mp3;base64,${data.audio_data}`);
//           audio.play();
//         }
//       } catch (error) {
//         console.error("Error parsing message:", error);
//       }
//     };
//     setWs(webSocket);
//     return () => webSocket.close();
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = (messageText) => {
//     if (!messageText.trim()) return;
//     const userMessage = {
//       role: "user",
//       text_response: messageText.trim()
//     };
//     const updatedMessages = [...messages, userMessage];
//     setMessages(updatedMessages);
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify({ content: messageText.trim() }));
//     } else {
//       console.error("WebSocket is not open. Message not sent.");
//     }
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     sendMessage(newMessage);
//     setNewMessage('');
//   };

//   const startListening = () => {
//     setIsListening(true);
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.continuous = false;
//     recognition.interimResults = false;
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       sendMessage(transcript);
//     };
//     recognition.onend = () => {
//       setIsListening(false);
//     };
//     recognition.start();
//   };

//   const handleGoBack = () => {
//     navigate('/ChatbotLauncher');
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {!showChat && (
//         <button
//           className="fixed right-4 bottom-4 bg-black text-white hover:bg-gray-500 px-4 py-2 rounded-md"
//           onClick={() => setShowChat(true)}
//         >
//           Open Chat Again
//         </button>
//       )}
//       {showChat && (
//           <div
//             className="fixed top-1/2 right-[46px] transform -translate-y-1/2 h-[785px] w-[443px] bg-white border rounded-lg shadow-lg overflow-hidden bg-opacity-50 backdrop-filter backdrop-blur-lg"
//             style={{
//               borderRadius: '24px'
//             }}
//           >
//             <div className="bg-gray-800 flex justify-between p-4 text-white font-bold paddingBottom '10px">
//               <button onClick={handleGoBack}>
//                 <img
//                   src="/images/leftArrow.png"
//                   alt="Backbutton"
//                   style={{ height: '30px', marginRight: '16px' }}
//                 />
//               </button>
//               <img
//                 src="/images/companyLogo.png"
//                 alt="Logo"
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   height: '30px',
//                 }}
//               />
//               <button
//                 className="text-white"
//                 onClick={() => setShowChat(false)}
//               >
//                 <img
//                   src="/images/Multiply.png"
//                   alt="Company Logo"
//                   style={{ height: '30px', marginRight: '16px' }}
//                 />
//               </button>
//             </div>
//             <div
//               className="max-w-screen-lg mx-auto overflow-y-auto"
//               style={{
//                 height: 'calc(100% - 128px)',
//                 paddingBottom: '2rem',
//                 paddingTop: '2rem',
//                 paddingRight: '1rem',
//                 textAlign: 'right',
//                 display: 'flex',
//                 flexDirection: 'column',
//               }}
//             >
//               {messages.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full">
//                   <img src="/images/Letter.png" alt="Message icon"
//                   style={{ height: '30px', alignContent: 'center'}}/>
//                   <h1 className="text-2xl font-bold mb-4">No messages</h1>
//                   <p className="text-gray-500">Message from the team will be shown here.</p>
//                 </div>
//               ) : (
//                 messages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={`message rounded-lg ${message.role === 'assistant'
//                       ? 'bg-blue-100 self-start'
//                       : 'bg-black self-end text-white'
//                       }`}
//                     style={{ padding: '0.5rem 1rem', marginBottom: '0.5rem' }}
//                   >
//                     <span>{message.text_response}</span>
//                   </div>
//                 ))
//               )}
//               <div ref={messagesEndRef} />
//             </div>
//             <div className="absolute bottom-0 w-full bg-white border-grey-600">
//               <form
//                 className="p-4 flex items-center"
//                 onSubmit={handleSendMessage}
//               >
//                 <input
//                   id="message"
//                   type="text"
//                   autoComplete="off"
//                   className="border-2 border-white rounded-md p-2 w-full focus:outline-none focus:border-transparent"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder="Ask a question..."
//                 />
//                 <button
//                   type="submit"
//                   className={`ml-2 bg-black ${newMessage.trim() !== '' || isListening
//                       ? 'hover:bg-blue-600'
//                       : 'hidden'
//                     } text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
//                 >
//                   Send
//                 </button>
//                 <button
//                   type="button"
//                   onClick={startListening}
//                   className="ml-2 text-blue-500 hover:text-blue-600 px-4 py-2 rounded-md flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 >
//                   <img
//                     src={
//                       isListening
//                         ? '/images/microphone.png'
//                         : '/images/voice.png'
//                     }
//                     alt="Speak"
//                     style={{ width: '30px', height: '30px' }}
//                   />
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//     </div>
//   )
// }



// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function Chatbot() {
//   const navigate = useNavigate();
//   const [newMessage, setNewMessage] = useState('');
//   const [showChat, setShowChat] = useState(false); // Initialize showChat to false
//   const [messages, setMessages] = useState([]);
//   const [ws, setWs] = useState(null);
//   const [isListening, setIsListening] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const webSocket = new WebSocket('ws://localhost:5000');
//     webSocket.onopen = () => {
//       console.log("WebSocket connection established");
//     };
//     webSocket.onmessage = (event) => {
//       console.log("Message received from server:", event.data);
//       try {
//         const data = JSON.parse(event.data);
//         const newMessage = {
//           role: 'assistant',
//           text_response: data.text_response,
//           audio_data: data.audio_data
//         };
//         setMessages(prevMessages => [...prevMessages, newMessage]);
//         if (data.audio_data) {
//           const audio = new Audio(`data:audio/mp3;base64,${data.audio_data}`);
//           audio.play();
//         }
//       } catch (error) {
//         console.error("Error parsing message:", error);
//       }
//     };
//     setWs(webSocket);
//     return () => webSocket.close();
//   }, []);
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setMessages([
//         {
//           role: 'assistant',
//           text_response: 'Please enter your shop URL! ',
//         },
//       ]);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);
  
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = (messageText) => {
//     if (!messageText.trim()) return;
//     const userMessage = {
//       role: "user",
//       text_response: messageText.trim()
//     };
//     setMessages(prevMessages => [...prevMessages, userMessage]);
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify({ content: messageText.trim() }));
//     } else {
//       console.error("WebSocket is not open. Message not sent.");
//     }
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     sendMessage(newMessage);
//     setNewMessage('');
//   };

//   const startListening = () => {
//     setIsListening(true);
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.continuous = false;
//     recognition.interimResults = false;
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       sendMessage(transcript);
//     };
//     recognition.onend = () => {
//       setIsListening(false);
//     };
//     recognition.start();
//   };

//   const handleAskQuestion = () => {
//     setShowChat(true);
//   };

//   const handleCloseChat = () => {
//     setShowChat(false);
//   };
  
//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {!showChat && (
//         <div
//           style={{
//             position: 'fixed',
//             top: '50%',
//             right: '2%',
//             transform: 'translateY(-50%)',
//             backgroundColor: 'white',
//             borderRadius: '24px',
//             width: '443px',
//             height: '785px',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//             overflow: 'hidden',
//             fontFamily: 'Arial, sans-serif',
//             display: 'flex',
//             flexDirection: 'column',
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: 'black',
//               color: 'white',
//               padding: '20px 20px 0px 20px',
//               textAlign: 'center',
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}
//           >
//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 width: '100%',
//               }}
//             >
//               <img
//                 src="/images/companyLogo.png"
//                 alt="Company Logo"
//                 style={{ height: '30px', marginLeft: '20px' }}
//               />
//               <button
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   cursor: 'pointer',
//                   color: 'white',
//                 }}
//                 onClick={() => setShowChat(false)}
//               >
//                 <img
//                   src="/images/Multiply.png"
//                   alt="Exit"
//                   style={{ height: '30px', marginRight: '16px' }}
//                 />
//               </button>
//             </div>
//             <h1 style={{ marginTop: '100px', fontSize: '30px', textAlign: 'left', fontWeight: 'bold' }}>
//               Hi Vivek 👋
//             </h1>
//             <h3 style={{ marginTop: '5px', fontSize: '25px', color: 'grey', textAlign: 'left' }}>
//               How can I help you today?
//             </h3>
//             <button
//               onClick={handleAskQuestion}
//               style={{
//                 backgroundColor: 'white',
//                 boxShadow: '0 0 0 1px lightgrey, 0 10px 8px rgba(0,0,0,0.1)',
//                 borderRadius: '20px',
//                 padding: '20px 30px',
//                 cursor: 'pointer',
//                 fontSize: '16px',
//                 margin: '10px auto',
//                 width: 'auto',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 position: 'relative',
//                 bottom: '-30px',
//               }}
//             >
//               <div style={{ textAlign: 'left' }}>
//                 <h2
//                   style={{
//                     fontSize: '20px',
//                     color: 'black',
//                     fontWeight: 'bold',
//                     margin: 0,
//                   }}
//                 >
//                   Ask a Question
//                   <br />
//                   <p
//                     style={{
//                       fontSize: '16px',
//                       color: 'grey',
//                       margin: 0,
//                     }}
//                   >
//                     Our Bot and team will help you
//                   </p>
//                 </h2>
//               </div>
//               <img
//                 src="/images/Help.png"
//                 alt="Help"
//                 style={{
//                   height: '34px',
//                   paddingLeft: '35px',
//                 }}
//               />
//             </button>
           
//          </div>
//          <div
//            style={{
//              flex: 1,
//              display: 'flex',
//              flexDirection: 'column',
//              justifyContent: 'center',
//              paddingBottom: '120px',
//            }}
//          >
           
//          </div>
//          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
//            <hr
//              style={{
//                color: '#ccc',
//                borderTop: '1px solid',
//                width: '110%',
//              }}
//            />
//            <div
//              style={{
//                borderTop: '1px solid #eee',
//                padding: '15px 0px 0px 0px',
//                display: 'flex',
//                justifyContent: 'space-around',
//                backgroundColor: 'white',
//              }}
//            >
//              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                <button style={{ background: 'none', border: 'none' }}>
//                  <img
//                    src="/images/homebutton.png"
//                    alt="Home button"
//                    style={{ height: '40px', marginBottom: '10px' }}
//                  />
//                </button>
//                <img
//                  src="/images/homeicon.png"
//                  alt="Home button"
//                  style={{ height: '10px' }}
//                />
//              </div>
//              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                <button style={{ background: 'none', border: 'none' }} onClick={handleAskQuestion}>
//                  <img
//                    src="/images/Letter.png"
//                    alt="Message button"
//                    style={{ height: '37px', marginBottom: '10px' }}
//                  />
//                </button>
//                <img
//                  src="/images/Message.png"
//                  alt="Description for the second image"
//                  style={{ height: '10px' }}
//                />
//              </div>
//            </div>
//            <div
//              style={{
//                display: 'flex',
//                alignItems: 'center',
//                justifyContent: 'center',
//                color: 'grey',
//                fontSize: '12px',
//                padding: '10px',
//              }}
//            >
//              Powered by
//              <img src="/images/aixl.png" alt="Company logo" style={{ height: '12px', marginLeft: '8px', marginRight: '8px' }} />
//            </div>
//          </div>
//        </div>
//      )}
    
       

// {showChat && (
//   <div
//     className="fixed top-1/2 right-[46px] transform -translate-y-1/2 h-[785px] w-[443px] bg-white border rounded-lg shadow-lg overflow-hidden bg-opacity-50 backdrop-filter backdrop-blur-lg"
//     style={{
//       borderRadius: '24px'
//     }}
//   >
//     <div className="bg-gray-800 flex justify-between p-4 text-white font-bold paddingBottom '10px">
//       <button onClick={() => setShowChat(false)}>
//         <img
//           src="/images/leftArrow.png"
//           alt="Backbutton"
//           style={{ height: '30px', marginRight: '16px' }}
//         />
//       </button>
//       <img
//         src="/images/companyLogo.png"
//         alt="Logo"
//         style={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '30px',
//         }}
//       />
//       <button
//         className="text-white"
//         onClick={() => setShowChat(false)}
//       >
//         <img
//           src="/images/Multiply.png"
//           alt="Company Logo"
//           style={{ height: '30px', marginRight: '16px' }}
//         />
//       </button>
//     </div>
//     <div
//       className="max-w-screen-lg mx-auto overflow-y-auto"
//       style={{
//         height: 'calc(100% - 128px)',
//         paddingBottom: '2rem',
//         paddingTop: '2rem',
//         paddingRight: '1rem',
//         textAlign: 'right',
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       {messages.length === 0 ? (
//         <div className="flex flex-col items-center justify-center h-full">
//           <img src="/images/Letter.png" alt="Message icon"
//           style={{ height: '30px', alignContent: 'center'}}/>
//           <h1 className="text-2xl font-bold mb-4">No messages</h1>
//           <p className="text-gray-500">Message from the team will be shown here.</p>
//         </div>
//       ) : (
//         messages.map((message, index) => (
//           <div
//             key={index}
//             className={`message rounded-lg ${message.role === 'assistant'
//               ? 'bg-black self-start  text-white '
//               : 'bg-black self-end text-white'
//               }`}
//             style={{ padding: '0.5rem 1rem', marginBottom: '0.5rem' }}
//           >
//             <span>{message.text_response}</span>
//           </div>
//         ))
//       )}
//       <div ref={messagesEndRef} />
//     </div>
//     <div className="absolute bottom-0 w-full bg-white border-grey-600">
//       <form
//         className="p-4 flex items-center"
//         onSubmit={handleSendMessage}
//       >
//         <input
//           id="message"
//           type="text"
//           autoComplete="off"
//           className="border-2 border-white rounded-md p-2 w-full focus:outline-none focus:border-transparent"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Ask a question..."
//         />
//         <button
//           type="submit"
//           className={`ml-2 bg-black ${newMessage.trim() !== '' || isListening
//               ? 'hover:bg-blue-600'
//               : 'hidden'
//             } text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>
//          Send
//        </button>
//        <button
//          type="button"
//          onClick={startListening}
//          className="ml-2 text-blue-500 hover:text-blue-600 px-4 py-2 rounded-md flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//        >
//          <img
//            src={
//              isListening
//                ? '/images/microphone.png'
//                : '/images/voice.png'
//            }
//            alt="Speak"
//            style={{ width: '30px', height: '30px' }}
//          />
//        </button>
//      </form>
//    </div>
//  </div>
//      )}
//    </div>
//  )
// }




// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function Chatbot() {
//   const navigate = useNavigate();
//   const [newMessage, setNewMessage] = useState('');
//   const [showChat, setShowChat] = useState(false); // Initialize showChat to false
//   const [messages, setMessages] = useState([]);
//   const [ws, setWs] = useState(null);
//   const [isListening, setIsListening] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const webSocket = new WebSocket('ws://localhost:5000');
//     webSocket.onopen = () => {
//       console.log("WebSocket connection established");
//     };
//     webSocket.onmessage = (event) => {
//       console.log("Message received from server:", event.data);
//       try {
//         const data = JSON.parse(event.data);
//         const newMessage = {
//           role: 'assistant',
//           text_response: data.text_response,
//           audio_data: data.audio_data
//         };
//         setMessages(prevMessages => [...prevMessages, newMessage]);
//         if (data.audio_data) {
//           const audio = new Audio(`data:audio/mp3;base64,${data.audio_data}`);
//           audio.play();
//         }
//       } catch (error) {
//         console.error("Error parsing message:", error);
//       }
//     };
//     setWs(webSocket);  /// here is thee channnnnnnnnnnnnnnnnnnnnnnnnngeeeeeeeeeeeeeeeeee
//     return () => webSocket.close();
//   }, []);
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setMessages([
//         {
//           role: 'assistant',
//           text_response: 'Hi, message here  ',
//         },
//       ]);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);
  
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = (messageText) => {
//     if (!messageText.trim()) return;
//     const userMessage = {
//       role: "user",
//       text_response: messageText.trim()
//     };
//     setMessages(prevMessages => [...prevMessages, userMessage]);
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify({ content: messageText.trim() }));
//     } else {
//       console.error("WebSocket is not open. Message not sent.");
//     }
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     sendMessage(newMessage);
//     setNewMessage('');
//   };

//   const startListening = () => {
//     setIsListening(true);
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.continuous = false;
//     recognition.interimResults = false;
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       sendMessage(transcript);
//     };
//     recognition.onend = () => {
//       setIsListening(false);
//     };
//     recognition.start();
//   };

//   const handleAskQuestion = () => {
//     setShowChat(true);
//   };

//   const handleCloseChat = () => {
//     setShowChat(false);
//   };
  
//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {!showChat && (
//         <div
//           style={{
//             position: 'fixed',
//             top: '50%',
//             right: '2%',
//             transform: 'translateY(-50%)',
//             backgroundColor: 'white',
//             borderRadius: '24px',
//             width: '443px',
//             height: '785px',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//             overflow: 'hidden',
//             fontFamily: 'Arial, sans-serif',
//             display: 'flex',
//             flexDirection: 'column',
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: 'black',
//               color: 'white',
//               padding: '20px 20px 0px 20px',
//               textAlign: 'center',
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}
//           >
//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 width: '100%',
//               }}
//             >
//               <img
//                 src="/images/companyLogo.png"
//                 alt="Company Logo"
//                 style={{ height: '30px', marginLeft: '20px' }}
//               />
//               <button
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   cursor: 'pointer',
//                   color: 'white',
//                 }}
//                 onClick={() => setShowChat(false)}
//               >
//                 <img
//                   src="/images/Multiply.png"
//                   alt="Exit"
//                   style={{ height: '30px', marginRight: '16px' }}
//                 />
//               </button>
//             </div>
//             <h1 style={{ marginTop: '100px', fontSize: '30px', textAlign: 'left', fontWeight: 'bold' }}>
//               Hi Vivek 👋
//             </h1>
//             <h3 style={{ marginTop: '5px', fontSize: '25px', color: 'grey', textAlign: 'left' }}>
//               How can I help you today?
//             </h3>
//             <button
//               onClick={handleAskQuestion}
//               style={{
//                 backgroundColor: 'white',
//                 boxShadow: '0 0 0 1px lightgrey, 0 10px 8px rgba(0,0,0,0.1)',
//                 borderRadius: '20px',
//                 padding: '20px 30px',
//                 cursor: 'pointer',
//                 fontSize: '16px',
//                 margin: '10px auto',
//                 width: 'auto',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 position: 'relative',
//                 bottom: '-30px',
//               }}
//             >
//               <div style={{ textAlign: 'left' }}>
//                 <h2
//                   style={{
//                     fontSize: '20px',
//                     color: 'black',
//                     fontWeight: 'bold',
//                     margin: 0,
//                   }}
//                 >
//                   Ask a Question
//                   <br />
//                   <p
//                     style={{
//                       fontSize: '16px',
//                       color: 'grey',
//                       margin: 0,
//                     }}
//                   >
//                     Our Bot and team will help you
//                   </p>
//                 </h2>
//               </div>
//               <img
//                 src="/images/Help.png"
//                 alt="Help"
//                 style={{
//                   height: '34px',
//                   paddingLeft: '35px',
//                 }}
//               />
//             </button>
           
//          </div>
//          <div
//            style={{
//              flex: 1,
//              display: 'flex',
//              flexDirection: 'column',
//              justifyContent: 'center',
//              paddingBottom: '120px',
//            }}
//          >
           
//          </div>
//          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
//            <hr
//              style={{
//                color: '#ccc',
//                borderTop: '1px solid',
//                width: '110%',
//              }}
//            />
//            <div
//              style={{
//                borderTop: '1px solid #eee',
//                padding: '15px 0px 0px 0px',
//                display: 'flex',
//                justifyContent: 'space-around',
//                backgroundColor: 'white',
//              }}
//            >
//              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                <button style={{ background: 'none', border: 'none' }}>
//                  <img
//                    src="/images/homebutton.png"
//                    alt="Home button"
//                    style={{ height: '40px', marginBottom: '10px' }}
//                  />
//                </button>
//                <img
//                  src="/images/homeicon.png"
//                  alt="Home button"
//                  style={{ height: '10px' }}
//                />
//              </div>
//              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                <button style={{ background: 'none', border: 'none' }} onClick={handleAskQuestion}>
//                  <img
//                    src="/images/Letter.png"
//                    alt="Message button"
//                    style={{ height: '37px', marginBottom: '10px' }}
//                  />
//                </button>
//                <img
//                  src="/images/Message.png"
//                  alt="Description for the second image"
//                  style={{ height: '10px' }}
//                />
//              </div>
//            </div>
//            <div
//              style={{
//                display: 'flex',
//                alignItems: 'center',
//                justifyContent: 'center',
//                color: 'grey',
//                fontSize: '12px',
//                padding: '10px',
//              }}
//            >
//              Powered by
//              <img src="/images/aixl.png" alt="Company logo" style={{ height: '12px', marginLeft: '8px', marginRight: '8px' }} />
//            </div>
//          </div>
//        </div>
//      )}
    
       

// {showChat && (
//   <div
//     className="fixed top-1/2 right-[46px] transform -translate-y-1/2 h-[785px] w-[443px] bg-white border rounded-lg shadow-lg overflow-hidden bg-opacity-50 backdrop-filter backdrop-blur-lg"
//     style={{
//       borderRadius: '24px'
//     }}
//   >
//     <div className="bg-gray-800 flex justify-between p-4 text-white font-bold paddingBottom '10px">
//       <button onClick={() => setShowChat(false)}>
//         <img
//           src="/images/leftArrow.png"
//           alt="Backbutton"
//           style={{ height: '30px', marginRight: '16px' }}
//         />
//       </button>
//       <img
//         src="/images/companyLogo.png"
//         alt="Logo"
//         style={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '30px',
//         }}
//       />
//       <button
//         className="text-white"
//         onClick={() => setShowChat(false)}
//       >
//         <img
//           src="/images/Multiply.png"
//           alt="Company Logo"
//           style={{ height: '30px', marginRight: '16px' }}
//         />
//       </button>
//     </div>
//     <div
//       className="max-w-screen-lg mx-auto overflow-y-auto"
//       style={{
//         height: 'calc(100% - 128px)',
//         paddingBottom: '2rem',
//         paddingTop: '2rem',
//         paddingRight: '1rem',
//         textAlign: 'right',
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       {messages.length === 0 ? (
//         <div className="flex flex-col items-center justify-center h-full">
//           <img src="/images/Letter.png" alt="Message icon"
//           style={{ height: '30px', alignContent: 'center'}}/>
//           <h1 className="text-2xl font-bold mb-4">No messages</h1>
//           <p className="text-gray-500">Message from the team will be shown here.</p>
//         </div>
//       ) : (
//         messages.map((message, index) => (
//           <div
//             key={index}
//             className={`message rounded-lg ${message.role === 'assistant'
//               ? 'bg-black self-start  text-white '
//               : 'bg-black self-end text-white'
//               }`}
//               style={{ 
//       padding: '0.5rem 1rem', 
//       marginBottom: '0.5rem',
//       marginLeft: message.role === 'assistant' ? '1rem' : '0' // Add margin for assistant messages
//     }}          >
//             <span>{message.text_response}</span>
//           </div>
//         ))
//       )}
//       <div ref={messagesEndRef} />
//     </div>
//     <div className="absolute bottom-0 w-full bg-white border-grey-600">
//       <form
//         className="p-4 flex items-center"
//         onSubmit={handleSendMessage}
//       >
//         <input
//           id="message"
//           type="text"
//           autoComplete="off"
//           className="border-2 border-white rounded-md p-2 w-full focus:outline-none focus:border-transparent"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Ask a question..."
//         />
//         <button
//           type="submit"
//           className={`ml-2 bg-black ${newMessage.trim() !== '' || isListening
//               ? 'hover:bg-blue-600'
//               : 'hidden'
//             } text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>
//          Send
//        </button>
//        <button
//          type="button"
//          onClick={startListening}
//          className="ml-2 text-blue-500 hover:text-blue-600 px-4 py-2 rounded-md flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//        >
//          <img
//            src={
//              isListening
//                ? '/images/microphone.png'
//                : '/images/voice.png'
//            }
//            alt="Speak"
//            style={{ width: '30px', height: '30px' }}
//          />
//        </button>
//      </form>
//    </div>
//  </div>
//      )}
//    </div>
//  )
// }

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Chatbot() {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false); // Initialize showChat to false
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const [isChatClosed, setIsChatClosed] = useState(false); // New state variable to track if the chat is closed

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:5000');
    webSocket.onopen = () => {
      console.log("WebSocket connection established");
    };
    webSocket.onmessage = (event) => {
      console.log("Message received from server:", event.data);
      try {
        const data = JSON.parse(event.data);
        const newMessage = {
          role: 'assistant',
          text_response: data.text_response,
          audio_data: data.audio_data
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
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
    const timer = setTimeout(() => {
      setMessages([
        {
          role: 'assistant',
          text_response: 'Hi, Shopisy here. Ask any question about your store!  ',
        },
      ]);
    }, 2000);

    return () => clearTimeout(timer);
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
    setMessages(prevMessages => [...prevMessages, userMessage]);
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

  const handleAskQuestion = () => {
    setShowChat(true);
    setIsChatClosed(false); // Reset isChatClosed to false when opening the chat
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setIsChatClosed(true); // Set isChatClosed to true when closing the chat
  };

  const openChatAgain = () => {
    setShowChat(true);
    setIsChatClosed(false); // Reset isChatClosed to false when opening the chat
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {isChatClosed ? ( // Render the "Open Chat" button when isChatClosed is true
        <button
          onClick={openChatAgain}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Open Chat
        </button>
      ) : (
        <>
          {!showChat && (
            <div
              style={{
                position: 'fixed',
                top: '50%',
                right: '2%',
                transform: 'translateY(-50%)',
                backgroundColor: 'white',
                borderRadius: '24px',
                width: '443px',
                height: '785px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                fontFamily: 'Arial, sans-serif',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  padding: '20px 20px 0px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <img
                    src="/images/companyLogo.png"
                    alt="Company Logo"
                    style={{ height: '30px', marginLeft: '20px' }}
                  />
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'white',
                    }}
                    onClick={handleCloseChat}
                  >
                    <img
                      src="/images/Multiply.png"
                      alt="Exit"
                      style={{ height: '30px', marginRight: '16px' }}
                    />
                  </button>
                </div>
                <h1 style={{ marginTop: '100px', fontSize: '30px', textAlign: 'left', fontWeight: 'bold' }}>
                  Hi Vivek 👋
                </h1>
                <h3 style={{ marginTop: '5px', fontSize: '25px', color: 'grey', textAlign: 'left' }}>
                  How can I help you today?
                </h3>
                <button
                  onClick={handleAskQuestion}
                  style={{
                    backgroundColor: 'white',
                    boxShadow: '0 0 0 1px lightgrey, 0 10px 8px rgba(0,0,0,0.1)',
                    borderRadius: '20px',
                    padding: '20px 30px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    margin: '10px auto',
                    width: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    bottom: '-30px',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <h2
                      style={{
                        fontSize: '20px',
                        color: 'black',
                        fontWeight: 'bold',
                        margin: 0,
                      }}
                    >
                      Ask a Question
                      <br />
                      <p
                        style={{
                          fontSize: '16px',
                          color: 'grey',
                          margin: 0,}}
                     >
                       Our Bot and team will help you
                     </p>
                   </h2>
                 </div>
                 <img
                   src="/images/Help.png"
                   alt="Help"
                   style={{
                     height: '34px',
                     paddingLeft: '35px',
                   }}
                 />
               </button>
             </div>
             <div
               style={{
                 flex: 1,
                 display: 'flex',
                 flexDirection: 'column',
                 justifyContent: 'center',
                 paddingBottom: '120px',
               }}
             >
             </div>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
               <hr
                 style={{
                   color: '#ccc',
                   borderTop: '1px solid',
                   width: '110%',
                 }}
               />
               <div
                 style={{
                   borderTop: '1px solid #eee',
                   padding: '15px 0px 0px 0px',
                   display: 'flex',
                   justifyContent: 'space-around',
                   backgroundColor: 'white',
                 }}
               >
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <button style={{ background: 'none', border: 'none' }}>
                     <img
                       src="/images/homebutton.png"
                       alt="Home button"
                       style={{ height: '40px', marginBottom: '10px' }}
                     />
                   </button>
                   <img
                     src="/images/homeicon.png"
                     alt="Home button"
                     style={{ height: '10px' }}
                   />
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <button style={{ background: 'none', border: 'none' }} onClick={handleAskQuestion}>
                     <img
                       src="/images/Letter.png"
                       alt="Message button"
                       style={{ height: '37px', marginBottom: '10px' }}
                     />
                   </button>
                   <img
                     src="/images/Message.png"
                     alt="Description for the second image"
                     style={{ height: '10px' }}
                   />
                 </div>
               </div>
               <div
                 style={{
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   color: 'grey',
                   fontSize: '12px',
                   padding: '10px',
                 }}
               >
                 Powered by
                 <img src="/images/aixl.png" alt="Company logo" style={{ height: '12px', marginLeft: '8px', marginRight: '8px' }} />
               </div>
             </div>
           </div>
         )}

         {showChat && (
           <div
             className="fixed top-1/2 right-[46px] transform -translate-y-1/2 h-[785px] w-[443px] bg-white border rounded-lg shadow-lg overflow-hidden bg-opacity-50 backdrop-filter backdrop-blur-lg"
             style={{
               borderRadius: '24px'
             }}
           >
             <div className="bg-gray-800 flex justify-between p-4 text-white font-bold paddingBottom '10px">
               <button onClick={() => setShowChat(false)}>
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
                 onClick={handleCloseChat}
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
                     className={`message rounded-lg ${message.role === 'assistant'
                       ? 'bg-black self-start  text-white '
                       : 'bg-black self-end text-white'
                       }`}
                     style={{ 
                       padding: '0.5rem 1rem', 
                       marginBottom: '0.5rem',
                       marginLeft: message.role === 'assistant' ? '1rem' : '0' // Add margin for assistant messages
                     }}          
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
       </>
     )}
   </div>
 );
}