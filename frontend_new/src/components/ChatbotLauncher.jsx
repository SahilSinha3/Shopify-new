import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatbotLauncher = () => {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(true);

  const navigateToChatbot = () => {
    navigate('/chatbot');
  };
  //  const navigateToHome = () => {
  //   navigate('http://localhost:5173/');
  // };

  const openChatAgain = () => {
    setShowChat(true);
  };
  const handleBack = () => {
    navigate('/');
  };
  return (
    <div>
      {!showChat && (
        <div
          className="fixed bottom-4 right-4 bg-black text-white hover:bg-gray-500 px-4 py-2 rounded-md cursor-pointer"
          onClick={openChatAgain}
        >
          Open Chat Again
        </div>
      )}
      {showChat && (
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
                onClick={() => setShowChat(false)}
              >
                <img
                  src="/images/Multiply.png"
                  alt="Exit"
                  style={{ height: '30px', marginRight: '16px' }}
                />
              </button>
            </div>
            <h1 style={{ marginTop: '100px', fontSize: '30px', textAlign: 'left' , fontWeight: 'bold' }}>
              Hi Vivek 👋
            </h1>
            <h3 style={{ marginTop: '5px', fontSize: '25px', color: 'grey', textAlign: 'left' }}>
              How can I help you today?
            </h3>
            <button
  onClick={navigateToChatbot}
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
  <div style={{ textAlign: 'left' }}> {/* Text block wrapper for alignment */}
    <h2
      style={{
        fontSize: '20px',
        color: 'black',
        // fontStyle: 'oblique',
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
          // fontStyle: 'oblique',
          margin: 0, 
        }}
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
            {/* Content */}
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
    <button style={{ background: 'none', border: 'none' }} >
      <img
        src="/images/homebutton.png"
        alt="Home button"
        style={{ height: '40px', marginBottom: '10px' }}  // Added marginBottom for spacing
      />
    </button >
    <img
      src="/images/homeicon.png"  
      alt="Home button"  
      style={{ height: '10px' }}  // Adjust height as neededa
    />
  </div>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <button style={{ background: 'none', border: 'none' }} onClick={navigateToChatbot}>
      <img
        src="/images/Letter.png"
        alt="Message button"
        style={{ height: '37px', marginBottom: '10px' }}  // Added marginBottom for spacing
      />
    </button>
    <img
      src="/images/Message.png"  // Specify the source for the second image
      alt="Description for the second image"  // Provide an appropriate alt text
      style={{ height: '10px' }}  // Adjust height as needed
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
  <img src="/images/aixl.png" alt="Company logo" style={{ height: '12px', marginLeft: '8px', marginRight: '8px' }}/>
</div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotLauncher; 