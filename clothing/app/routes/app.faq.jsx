// import React, { useState } from 'react';
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = 'https://byeuljedurwmythjmuam.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZXVsamVkdXJ3bXl0aGptdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0MTMyMDAsImV4cCI6MjAyNTk4OTIwMH0.hAOgtLSPqB8QVnOXGTj5sX-s3QFPYVsiL07liiqwX3o';
// const supabase = createClient(supabaseUrl, supabaseKey);

// const FAQPage = () => {
//   const [question, setQuestion] = useState('');

//   const handleInputChange = (event) => {
//     setQuestion(event.target.value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     // Submit the question to the "faq" table in Supabase
//     const { data, error } = await supabase
//       .from('faq') // Change this to your table name
//       .insert([{ question: question }]);
//     if (error) {
//       console.error(error);
//     } else {
//       console.log('Question submitted:', data);
//       setQuestion(''); // Clear the input field after submission
//     }
//   };

//   return (
//     <div>
//       <div style={{ backgroundColor: 'black', color: 'white', width: '70vw', height: '90vw', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' }} className="faq-container">
//         <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '-100px' }} className="faq-left">
//           <h1 style={{ fontSize: '2rem', textAlign: 'left', marginBottom: '20px', lineHeight: '2.5rem' }} className="faq-heading">Frequently Asked Questions</h1>
//           <p>Have other questions? <span style={{ color: 'green' }}>Contact us</span> so we can help</p>
//           <img style={{ maxWidth: '100%', height: 'auto', marginTop: '20px' }} src="/faq.png" alt="FAQ" />
//         </div>
//         <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '220px' }} className="faq-right">
//           <div style={{ backgroundColor: 'white', color: 'black', padding: '15px', margin: '10px 0', width: '80%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer', borderRadius: '10px' }} className="faq">
//             <h2 style={{ position: 'relative', paddingRight: '30px' }}>What are the benefits of using a chatbot?</h2>
//             <p>Chatbots can provide quick responses, improve customer engagement, and reduce operational costs.</p>
//           </div>
//           <div style={{ backgroundColor: 'white', color: 'black', padding: '15px', margin: '10px 0', width: '80%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer', borderRadius: '10px' }} className="faq">
//             <h2 style={{ position: 'relative', paddingRight: '30px' }}>Can chatbots understand multiple languages?</h2>
//             <p>Yes, many chatbots are designed to understand and respond in multiple languages.</p>
//           </div>
//           <div style={{ backgroundColor: 'white', color: 'black', padding: '15px', margin: '10px 0', width: '80%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer', borderRadius: '10px' }} className="faq">
//             <h2 style={{ position: 'relative', paddingRight: '30px' }}>How do I create a chatbot?</h2>
//             <p>You can create a chatbot using various platforms and tools that offer chatbot development features.</p>
//           </div>
//           <div style={{ backgroundColor: 'white', color: 'black', padding: '15px', margin: '10px 0', width: '80%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer', borderRadius: '10px' }} className="faq">
//             <h2 style={{ position: 'relative', paddingRight: '30px' }}>Are chatbots secure?</h2>
//             <p>Chatbots can be secure if they are designed with security measures in place to protect user data.</p>
//           </div>
//           <div style={{ backgroundColor: 'white', color: 'black', padding: '15px', margin: '10px 0', width: '80%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer', borderRadius: '10px' }} className="faq">
//             <h2 style={{ position: 'relative', paddingRight: '30px' }}>Can chatbots replace human customer service?</h2>
//             <p>Chatbots can handle routine queries, but human intervention may still be needed for complex issues.</p>
//           </div>
//           <div style={{ backgroundColor: 'white', color: 'black', padding: '15px', margin: '10px 0', width: '80%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer', borderRadius: '10px' }} className="faq">
//             <h2 style={{ position: 'relative', paddingRight: '30px' }}>Can chatbots make phone calls?</h2>
//             <p>Some advanced chatbots are capable of making phone calls and conducting voice conversations.</p>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               style={{ width: '100%', padding: '15px', marginTop: '20px', border: '1px solid #ccc', borderRadius: '4px' }}
//               className="question-input"
//               placeholder="Write us your questions..."
//               value={question}
//               onChange={handleInputChange}
//             />
//             <button style={{ width: '100%', padding: '10px', backgroundColor: '#008060', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }} className="ask-question-button" type="submit">
//               Submit
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FAQPage;



// import React, { useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = 'https://byeuljedurwmythjmuam.supabase.co';
// // const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZXVsamVkdXJ3bXl0aGptdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0MTMyMDAsImV4cCI6MjAyNTk4OTIwMH0.hAOgtLSPqB8QVnOXGTj5sX-s3QFPYVsiL07liiqwX3o';
// const supabase = createClient(supabaseUrl, supabaseKey);

// const FAQPage = () => {
//   const [question, setQuestion] = useState('');
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [pdfText, setPdfText] = useState('');

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   const handleInputChange = (event) => {
//     setQuestion(event.target.value);
//   };

//   const handleSubmit = async (event) => {

//     const file = event.target.files[0];
//     if (file) {
//       const fileReader = new FileReader();
//       fileReader.onload = async (e) => {
//         const typedArray = new Uint8Array(e.target.result);
//         const pdf = await pdfjsLib.getDocument(typedArray).promise;
//         const page = await pdf.getPage(1);
//         const textContent = await page.getTextContent();
//         const text = textContent.items.map((item) => item.str).join(' ');
//         setPdfText(text);
//       };
//       fileReader.readAsArrayBuffer(file);
//     }
//     console.log("File pased")
//     // event.preventDefault();
//     // const { data, error } = await supabase
//     //   .from('faq')
//     //   .insert([{ question: question }]);
//     // if (error) {
//     //   console.error(error);
//     // } else {
//     //   console.log('Question submitted:', data);
//     //   setQuestion('');
//     // }
//   };
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://byeuljedurwmythjmuam.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZXVsamVkdXJ3bXl0aGptdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0MTMyMDAsImV4cCI6MjAyNTk4OTIwMH0.hAOgtLSPqB8QVnOXGTj5sX-s3QFPYVsiL07liiqwX3o';
const supabase = createClient(supabaseUrl, supabaseKey);

const FAQPage = () => {
  const [question, setQuestion] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [pdfText, setPdfText] = useState('');

  useEffect(() => {
    // Check if window is defined
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener('resize', handleResize);
      // Set the initial value
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        const text = textContent.items.map((item) => item.str).join(' ');
        setPdfText(text);
      };
      fileReader.readAsArrayBuffer(file);
    }
    console.log("File parsed");
  };

  return (
    <div>
      <div style={{
        backgroundColor: 'black',
        color: 'white',
        width: isMobile ? '90vw' : '70vw',
        height: isMobile ? 'auto' : '90vw',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        flexDirection: isMobile ? 'column' : 'row'
      }} className="faq-container">
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginTop: isMobile ? '0' : '-100px'
        }} className="faq-left">
          <h1 style={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            textAlign: 'left',
            marginBottom: '20px',
            lineHeight: isMobile ? '2rem' : '2.5rem'
          }} className="faq-heading">Frequently Asked Questions</h1>
          <p>Have other questions? <span style={{ color: 'green' }}>Contact us</span> so we can help</p>
          <img style={{ maxWidth: '100%', height: 'auto', marginTop: '20px' }} src="/shopify.png" alt="FAQ" />
        </div>
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: isMobile ? '20px' : '220px'
        }} className="faq-right">
          <div style={{
            backgroundColor: 'white',
            color: 'black',
            padding: '15px',
            margin: '10px 0',
            width: isMobile ? '90%' : '80%',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            borderRadius: '10px'
          }} className="faq">
            <h2 style={{ position: 'relative', paddingRight: '30px' }}>What are the benefits of using a chatbot?</h2>
            <p>Chatbots can provide quick responses, improve customer engagement, and reduce operational costs.</p>
          </div>
          {/* Add more FAQ items here */}
          <div style={{ backgroundColor: 'white', color: 'black', padding: '15px', margin: '10px 0', width: '80%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer', borderRadius: '10px' }} className="faq">
            <h2 style={{ position: 'relative', paddingRight: '30px' }}>Can chatbots understand multiple languages?</h2>
            <p>Yes, many chatbots are designed to understand and respond in multiple languages.</p>
          </div>
          <div style={{ backgroundColor: 'white', color: 'black', padding: '15px', margin: '10px 0', width: '80%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer', borderRadius: '10px' }} className="faq">
            <h2 style={{ position: 'relative', paddingRight: '30px' }}>How do I create a chatbot?</h2>
            <p>You can create a chatbot using various platforms and tools that offer chatbot development features.</p>
          </div>
          <div style={{ backgroundColor: 'white', color: 'black', padding: '15px', margin: '10px 0', width: '80%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer', borderRadius: '10px' }} className="faq">
            <h2 style={{ position: 'relative', paddingRight: '30px' }}>Are chatbots secure?</h2>
            <p>Chatbots can be secure if they are designed with security measures in place to protect user data.</p>
          </div>
          <div style={{ backgroundColor: 'white', color: 'black', padding: '15px', margin: '10px 0', width: '80%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer', borderRadius: '10px' }} className="faq">
            <h2 style={{ position: 'relative', paddingRight: '30px' }}>Can chatbots replace human customer service?</h2>
            <p>Chatbots can handle routine queries, but human intervention may still be needed for complex issues.</p>
          </div>
          <div style={{ backgroundColor: 'white', color: 'black', padding: '15px', margin: '10px 0', width: '80%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer', borderRadius: '10px' }} className="faq">
            <h2 style={{ position: 'relative', paddingRight: '30px' }}>Can chatbots make phone calls?</h2>
            <p>Some advanced chatbots are capable of making phone calls and conducting voice conversations.</p>
          </div>
          <form onSubmit={handleSubmit}>
          <label>Upload PDF or TXT files</label>
            <input
              type="file"
              accept=".pdf, .txt"
              style={{
                width: '100%',
                padding: '15px',
                marginTop: '20px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              className="question-input"
              placeholder="Write us your questions..."
              value={question}
              onChange={handleInputChange}
            />
            <button style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#008060',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '20px'
            }} className="ask-question-button" type="submit">
              Submit
            </button>
            <div>{pdfText}</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;