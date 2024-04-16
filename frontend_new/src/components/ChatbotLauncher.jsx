import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatbotLauncher = () => {
  const navigate = useNavigate();

  const navigateToChatbot = () => {
    navigate('/chatbot');
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '2%',
      transform: 'translateY(-50%)',
      backgroundColor: 'white',
      borderRadius: '24px',
      width: '400px',
      height : '600px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif'
    }}>
      
   <div style={{
    backgroundColor: 'black',
    color: 'white',
    padding: '20px 20px 50px 20px', // Adjust the padding-top and padding-bottom
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
}}>
  
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <img src="/images/companyLogo.png" alt="Company Logo" style={{ height: '30px', marginLeft: '20px' }} />
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
            <img src="/images/Multiply.png" alt="Company Logo" style={{ height: '30px', marginRight: '16px' }} />
        </button>
    </div>
    <h1 style={{ marginTop: '100px', fontSize: '32px', textAlign: 'left' }}>Hi Vivek 👋</h1>
    <p style={{ marginTop: '5px', fontSize: '16px', color: 'grey' }}>How can I help you today?</p>
</div>
      <div style={{ padding: '20px', textAlign: 'center', paddingBottom: '120px' }}>
        
       <button onClick={navigateToChatbot} style={{
  backgroundColor: 'white',
  border: '1px solid black',
  boxShadow: '0 0 0 1px lightgrey, 0 10px 8px rgba(0,0,0,0.1)',
  borderRadius: '20px',
  paddingLeft: '10px',
  paddingRight: '100px',
  paddingTop: '10px',
  paddingBottom: '10px',
  cursor: 'pointer',
  fontSize: '16px',
  margin: '10px auto',
  display: 'block'
        }}>
          
        {/* <img src="/path/to/logo.png" alt="Logo" style={{ height: '30px', marginRight: '2px' }} /> */}
            <h2 style={{  fontSize: '20px', textAlign: 'left', fontStyle:'oblique', fontWeight: 'bold' }}>Ask a Question</h2>

          
              <p style={{ marginTop: '5px', fontSize: '16px', color: 'grey' }}>Our Bot and Team will help you </p>

</button>
          
      </div>
          
       <hr style={{ color: '#ccc', borderTop: '1px solid', width: '110%' }} />

      <div style={{
        borderTop: '1px solid #eee',
        padding: '15px 0px 0px 0px',
        display: 'flex',
        justifyContent: 'space-around',
        backgroundColor: '#f9f9f9'
      }}>
        <button style={{ background: 'none', border: 'none' }}>
            <img src="/images/home.png" alt="Home button" style={{ height: '30px', marginRight: '16px' }} />

        </button>
       <button style={{ background: 'none', border: 'none' }} onClick={navigateToChatbot}>
  <img src="/images/message.jpg" alt="Message button" style={{ height: '30px', marginRight: '16px' }} />
</button>
      </div>
      <div style={{ textAlign: 'center', color: 'grey', fontSize: '12px', padding: '10px' }}>
        Powered by ↑ AIXL
      </div>
    </div>
  );
};

export default ChatbotLauncher;