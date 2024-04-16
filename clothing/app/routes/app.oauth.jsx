import React from 'react';
const ShopifyOAuthRedirect = () => {
  const shopName = 'zookie-cloth';
  const apiKey = 'a939965f28661e5a4203a4724789938';
  const scopes = 'read_products,write_orders';
  const redirectUri = 'http://localhost:8081/auth/callback';
  const state = 'some-random-secure-string';
  const redirectToShopify = () => {
    // const authUrl = `https://${shopName}.myshopify.com/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;
    const authUrl = 'https://shopify.digitalversions.in/chatbot'
    window.location.href = authUrl;
  };
  return (
    <div
      style={{
        maxWidth: '400px',
        margin: 'auto',
        padding: '20px',
        textAlign: 'center',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#F9F9F9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <img
        src="/shopify1.png"
        alt="Shopify"
        style={{
          maxWidth: '100px',
          marginBottom: '50px',
          marginLeft: '110px',
        }}
      />
      <h1>Welcome to Our App</h1>
      <p>This app needs to:</p>
      <ul
        style={{
          textAlign: 'left',
          marginBottom: '20px',
        }}
      >
        <li>Access store information</li>
        <li>Edit store information</li>
        <li>Manage orders</li>
        <li>View customer details</li>
        {/* Add more consent points as needed */}
      </ul>
      <button
        onClick={redirectToShopify}
        style={{
          backgroundColor: '#008060',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          marginBottom: '10px',
        }}
      >
        Connect to Shopify
      </button>
      <p
        style={{
          marginTop: '16px',
        }}
      >
        You are agreeing to share personal information with this app.
      </p>
      <p
        style={{
          marginTop: '16px',
        }}
      >
        Deleting this app will remove its access, but customer personal information may not be erased. Contact the developer to request the removal of customer and other stored information.
      </p>
    </div>
  );
};
export default ShopifyOAuthRedirect;













// import React from 'react';
// import './ShopifyOAuthRedirect.css';
// const ShopifyOAuthRedirect = () => {
//   const shopName = 'zookie-cloth';
//   const apiKey = 'a939965f28661e5a4203a4724789938';
//   const scopes = 'read_products,write_orders';
//   const redirectUri = 'http://localhost:8081/auth/callback';
//   const state = 'some-random-secure-string';
//   const redirectToShopify = () => {
//     const authUrl = `https://${shopName}.myshopify.com/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;
//     window.location.href = authUrl;
//   };
//   return (
//     <div className="oauth-container">
//       <img src="/shopify1.png" alt="Shopify" className="shopify-logo" />
//       <h1>Welcome to Our App</h1>
//       <p>This app needs to:</p>
//       <ul>
//         <li>Access store information</li>
//         <li>Edit store information</li>
//         <li>Manage orders</li>
//         <li>View customer details</li>
//         {/* Add more consent points as needed */}
//       </ul>
//       <button onClick={redirectToShopify}>Connect to Shopify</button>
//       <p className="info-paragraph">you are agreeing to share personal information with this app</p>
//       <p className="info-paragraph">Deleting this app will remove its access,buy customer personal information may not be erased.Contact the developer to request the removal of customer and other stored information. </p>
//     </div>
//   );
// };
// export default ShopifyOAuthRedirect;