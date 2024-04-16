// import React from 'react';

// function ChatbotContainer() {
//   return (
//     <div>
//       <h1>Chatbot Integration</h1>
//           {/* <iframe src="/frontend/dist/index.html" width="100%" height="500px" /> */}
//           <iframe 
//   src="/frontend/src/main.jsx"
//   width="100%" 
//   height="500px" 
//   sandbox="allow-scripts allow-popups allow-forms allow-top-navigation allow-modals allow-orientation-lock allow-pointer-lock">
// </iframe>

//     </div>
//   );
// }


// export default ChatbotContainer;


import React from 'react';

function ChatbotContainer() {
  return (
    <div>
      <h1>Chatbot</h1>
      {/* Removing the anchor tag that points to a local file, which isn't practical in production */}
      {/* <a href="/frontend/src/main.jsx" target="_blank" rel="noopener noreferrer">
        Open Chatbot
      </a> */}
      {/* Adding the iframe for chatbot integration */}

      
      <iframe 
        // src="http://localhost:8080" 
        src="http://localhost:5173" 
        width="100%" 
        height="700" 
        frameborder="1"
        title="Chatbot Frame"
        allow="microphone">
      </iframe>
    </div>
  );
}

export default ChatbotContainer;

