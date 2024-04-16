// import React from 'react';
// import { AppProvider, Page, Card, Button, TextContainer, Stack } from '@shopify/polaris';
// import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';

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
//     <AppProvider i18n={{}}>
//       <AppBridgeProvider config={{ apiKey, shopOrigin: `${shopName}.myshopify.com` }}>
//         <Page>
//           <Card sectioned>
//             <Stack vertical>
//               <img src="/shopify.png" alt="Shopify" style={{ maxWidth: '100px', marginBottom: '20px' }} />
//               <TextContainer>
//                 <h1>Welcome to Our App</h1>
//                 <p>This app needs to:</p>
//                 <ul>
//                   <li>Access store information</li>
//                   <li>Edit store information</li>
//                   <li>Manage orders</li>
//                   <li>View customer details</li>
//                   {/* Add more consent points as needed */}
//                 </ul>
//               </TextContainer>
//               <Button onClick={redirectToShopify}>Connect to Shopify</Button>
//               <TextContainer>
//                 <p>You are agreeing to share personal information with this app.</p>
//                 <p>Deleting this app will remove its access, but customer personal information may not be erased. Contact the developer to request the removal of customer and other stored information.</p>
//               </TextContainer>
//             </Stack>
//           </Card>
//         </Page>
//       </AppBridgeProvider>
//     </AppProvider>
//   );
// };

// export default ShopifyOAuthRedirect;









import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};
