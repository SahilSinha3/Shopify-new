import express from 'express';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
const supabaseUrl = 'https://snnbayevmgzqejabjycv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNubmJheWV2bWd6cWVqYWJqeWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE3MTI3MDMsImV4cCI6MjAyNzI4ODcwM30.U6Fcp9cWH6h46SD5hD_7MExrzbqJPnaCAXEFu5YxHv4';
const supabase = createClient(supabaseUrl, supabaseKey);
const stripeInstance = Stripe('sk_test_51OyYvjSIEkriKAmTPPslzHZmj4Wi8FeKtY1nJEtdhH076Odvi7b3deW1yrFn4KQcQ5AtBfbaVj6ZithVnS6sHssY00V6p7yx8S');

app.use(express.json()); // Parse JSON bodies

app.post('/create-checkout-session', async (req, res) => {
  const { plan, username } = req.body;

  let priceId;
  if (plan === "Trial Plan") {
    priceId = 'price_1OzFfsSIEkriKAmTGJJAKF5R'; // Replace 'price_xxx' with the actual price ID for the Trial Plan
  } else if (plan === "Monthly Plan") {
    priceId = 'price_1OzFkqSIEkriKAmT2KvwIOfR'; // Replace 'price_yyy' with the actual price ID for the Monthly Plan
  }

  const session = await stripeInstance.checkout.sessions.create({
    billing_address_collection: 'auto',
    payment_method_types: ['card'],
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    mode: 'subscription',
    metadata: { username },
    success_url: "http://localhost:3000?success=true&session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000?canceled=true",
  });

  res.json({ url: session.url });
});

app.post('/create-portal-session', async (req, res) => {
  const { session_id } = req.body;
  const checkoutSession = await stripeInstance.checkout.sessions.retrieve(session_id);

  // const returnUrl = "https://shopify.digitalversions.in/chatbot";
  const returnUrl = "http://localhost:3000";

  const portalSession = await stripeInstance.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
});

app.post('/webhook', async (req, res) => {
  console.log("triggered webhook");

  const payload = req.body;
  const sigHeader = req.headers['stripe-signature'];

  try {
    const event = stripeInstance.webhooks.constructEvent(payload, sigHeader, 'whsec_DStUbUag4uJrbTFR34OQ0YzD0whue08C');

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log("completed triggered");
      const apiKey = session.metadata.api_key;

      if (apiKey) {
        const { data, error } = await supabase.from('apikeys').insert([{ apikey: apiKey, credits: 100 }]);
        if (error) {
          console.error('Error inserting into Supabase:', error.message);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
      }
    }

    res.json({ status: 'success' });
  } catch (err) {
    res.status(400).send('Invalid payload');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});


















// import stripe from 'stripe';
// import express from 'express';
// const app = express();
// app.use(express.static('public'));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// const stripeInstance = stripe('sk_test_51OyYvjSIEkriKAmTPPslzHZmj4Wi8FeKtY1nJEtdhH076Odvi7b3deW1yrFn4KQcQ5AtBfbaVj6ZithVnS6sHssY00V6p7yx8S');
// const YOUR_DOMAIN = 'http://localhost:4242';

// app.post('/create-checkout-session', async (req, res) => {
//   const prices = await stripeInstance.prices.list({
//     lookup_keys: [req.body.lookup_key],
//     expand: ['data.product'],
//   });
//   const session = await stripeInstance.checkout.sessions.create({
//     billing_address_collection: 'auto',
//     line_items: [
//       {
//         price: prices.data[0].id,
//         quantity: 1,
//       },
//     ],
//     mode: 'subscription',
//     success_url: `${YOUR_DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${YOUR_DOMAIN}?canceled=true`,
//   });

//   res.redirect(303, session.url);
// });

// app.post('/create-portal-session', async (req, res) => {
//   const { session_id } = req.body;
//   const checkoutSession = await stripeInstance.checkout.sessions.retrieve(session_id);

//   const returnUrl = YOUR_DOMAIN;

//   const portalSession = await stripeInstance.billingPortal.sessions.create({
//     customer: checkoutSession.customer,
//     return_url: returnUrl,
//   });

//   res.redirect(303, portalSession.url);
// });

// // This is your Stripe CLI webhook secret for testing your endpoint locally.
// const endpointSecret = "whsec_9a01738aa96ad89d06150320e3ae372df1604af7e18d40abea375fe968dd5000";

// app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//   const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripeInstance.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntentSucceeded = event.data.object;
//       // Then define and call a function to handle the event payment_intent.succeeded
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });

// app.listen(4242, () => console.log('Running on port 4242'));



















// import express from 'express';
// import bodyParser from 'body-parser';
// import { shopifyApp, BillingInterval } from '@shopify/shopify-app-remix/server';
// import path from 'path';
// import Shopify from '@shopify/shopify-api';


// const app = express();

// // Use body-parser middleware
// app.use(bodyParser.json());
// // const { Shopify } = require('@shopify/shopify-api');

// // Define your billing plans
// const MONTHLY_PLAN = 'Monthly subscription';
// const ANNUAL_PLAN = 'Annual subscription';
// const ONE_TIME_CHARGE = 'One Time Charge';
// const sessions = {};
// const sessionStorage = {
//   async storeSession(session) {
//     sessions[session.id] = session;
//     return true;
//   },
//   async loadSession(id) {
//     return sessions[id];
//   },
//   async deleteSession(id) {
//     delete sessions[id];
//     return true;
//   },
// };

// const shopify = shopifyApp({
//   appUrl: 'https://zookie-cloth.myshopify.com',
//   apiKey: 'da939965f28661e5a4203a4724789938',
//   apiSecretKey: '6f10d3d7b4db73efc83a0a8093d6afeb',
//   redirect_uri: 'http://localhost:8081/auth/callback',
//   scopes: ['read_products', 'write_products'],
//   sessionStorage: sessionStorage,
//   apiFeatures: {
//     'v3_authenticatePublic': true,
//     'v3_lineItemBilling': true,
//     'v3_webhookAdminContext': true,
//     'unstable_newEmbeddedAuthStrategy': true,
//     'unstable_newFeature': true,
//   },
//   billing: {
//     [MONTHLY_PLAN]: {
//       amount: 5,
//       currencyCode: 'USD',
//       interval: BillingInterval.Every30Days,
//     },
//     [ANNUAL_PLAN]: {
//       amount: 50,
//       currencyCode: 'USD',
//       interval: BillingInterval.Annual,
//     },
//     [ONE_TIME_CHARGE]: {
//       amount: 30,
//       currencyCode: 'USD',
//       interval: BillingInterval.OneTime,
//     },
//     future: {
     
//       v3_lineItemBilling: true,
//        // Enable the v3_lineItemBilling flag
//     },
//   },
// });

// app.get('/payment', (req, res) => {
//   res.sendFile(path.join(__dirname, 'C:\Users\LENOVO\clothing\app\routes\app.payment.jsx'));
// });
// app.get('/auth', (req, res) => {
//   const authURL = shopify.buildAuthURL();
//   res.redirect(authURL);
// });

// app.get('/auth/callback', (req, res) => {
//   const { code } = req.query;
//   shopify.exchange_temporary_token(req.query, (err, data) => {
//     // data contains your access token
//     res.send(data);
//   });
// });

// // Requesting billing right away
// app.get('/request-billing', async (req, res) => {
//   const { billing } = await shopify.authenticate.admin(req);
//   await billing.require({
//     plans: [MONTHLY_PLAN],
//     isTest: true,
//     onFailure: async () => billing.request({ plan: MONTHLY_PLAN }),
//   });
//   // App logic
//   res.send('Billing requested');
// });

// // Add a route to handle payment submission
// app.post('/submit-payment', async (req, res) => {
//   const { paymentDetails, selectedPlan } = req.body;
//   console.log('Received payment details:', paymentDetails);
//   console.log('Selected plan:', selectedPlan);

//   // Handle the payment processing and subscription logic here
//   // For demonstration purposes, we're just logging the details and sending a success response
//   res.json({ message: 'Payment submitted successfully', plan: selectedPlan });
// });

// // Checking active payments
// app.get('/check-billing', async (req, res) => {
//   const { billing } = await shopify.authenticate.admin(req);
//   const { hasActivePayment, appSubscriptions } = await billing.check({
//     plans: [MONTHLY_PLAN],
//     isTest: false,
//   });
//   res.json({ hasActivePayment, appSubscriptions });
// });

// // Requesting payment with a custom return URL
// app.get('/request-payment', async (req, res) => {
//   const { billing } = await shopify.authenticate.admin(req);
//   await billing.require({
//     plans: [MONTHLY_PLAN],
//     onFailure: async () => billing.request({
//       plan: MONTHLY_PLAN,
//       isTest: true,
//       returnUrl: 'https://admin.shopify.com/store/zookie-cloth/apps/clothing-12/app/payment',
//     }),
//   });
//   // App logic
//   res.send('Payment requested');
// });

// // Cancelling a subscription
// app.get('/cancel-subscription', async (req, res) => {
//   const { billing } = await shopify.authenticate.admin(req);
//   const billingCheck = await billing.require({
//     plans: [MONTHLY_PLAN],
//     onFailure: async () => billing.request({ plan: MONTHLY_PLAN }),
//   });

//   const subscription = billingCheck.appSubscriptions[0];
//   const cancelledSubscription = await billing.cancel({
//     subscriptionId: subscription.id,
//     isTest: true,
//     prorate: true,
//   });

//   // App logic
//   res.send('Subscription cancelled');
// });

// app.listen(process.env.PORT || 8081, () => {
//   console.log(`Server running on port ${process.env.PORT || 8081}`);
//   console.log('Access the server locally at http://localhost:8081');
// });















// import express from 'express';
// import bodyParser from 'body-parser';
// import { shopifyApp } from '@shopify/shopify-app-remix/server';
// import path from 'path';

// const app = express();

// app.use(bodyParser.json());

// const sessions = {};
// const sessionStorage = {
//   async storeSession(session) {
//     sessions[session.id] = session;
//     return true;
//   },
//   async loadSession(id) {
//     return sessions[id];
//   },
//   async deleteSession(id) {
//     delete sessions[id];
//     return true;
//   },
// };

// const shopify = shopifyApp({
//   appUrl: 'zookie-cloth.myshopify.com',
//   apiKey: 'da939965f28661e5a4203a4724789938',
//   apiSecretKey: '6f10d3d7b4db73efc83a0a8093d6afeb',
//   scopes: ['read_products', 'write_products'],
//   sessionStorage: sessionStorage,
// });

// app.post('/submit-payment', (req, res) => {
//   const { paymentDetails, selectedPlan } = req.body;
//   console.log('Received payment details:', paymentDetails);
//   console.log('Selected plan:', selectedPlan);

//   res.json({ message: 'Payment submitted successfully', plan: selectedPlan });
// });

// app.listen(process.env.PORT || 3000, () => {
//   console.log(`Server running on port ${process.env.PORT || 3000}`);
// });


















// import express from 'express';
// import bodyParser from 'body-parser';
// import { shopifyApp, BillingInterval } from '@shopify/shopify-app-remix/server';
// import path from 'path';
// import { action as submitPaymentAction } from './submit-payment';
// const app = express();

// // Use body-parser middleware
// app.use(bodyParser.json());

// // Define your billing plans
// const MONTHLY_PLAN = 'Monthly subscription';
// const ANNUAL_PLAN = 'Annual subscription';
// const ONE_TIME_CHARGE = 'One Time Charge';
// const sessions = {};
// const sessionStorage = {
//   async storeSession(session) {
//     sessions[session.id] = session;
//     return true;
//   },
//   async loadSession(id) {
//     return sessions[id];
//   },
//   async deleteSession(id) {
//     delete sessions[id];
//     return true;
//   },
// };

// const shopify = shopifyApp({
//   appUrl: 'zookie-cloth.myshopify.com',
//   apiKey: 'da939965f28661e5a4203a4724789938',
//   apiSecretKey: '6f10d3d7b4db73efc83a0a8093d6afeb',
//   scopes: ['read_products', 'write_products'],
//   sessionStorage: sessionStorage,
//   billing: {
//     [MONTHLY_PLAN]: {
//       amount: 5,
//       currencyCode: 'USD',
//       interval: BillingInterval.Every30Days,
//     },
//     [ANNUAL_PLAN]: {
//       amount: 50,
//       currencyCode: 'USD',
//       interval: BillingInterval.Annual,
//     },
//     [ONE_TIME_CHARGE]: {
//       amount: 30,
//       currencyCode: 'USD',
//       interval: BillingInterval.OneTime,
//     },
//     future: {
//       v3_lineItemBilling: true, // Enable the v3_lineItemBilling flag
//     },
//   },
// });

// app.get('/payment', (req, res) => {
//   res.sendFile(path.join(__dirname, 'C:\Users\LENOVO\clothing\app\routes\app.payment.jsx'));
// });

// // Requesting billing right away
// // app.get('/request-billing', async (req, res) => {
// //   const { billing } = await shopify.authenticate.admin(req);
// //   await billing.require({
// //     plans: [MONTHLY_PLAN],
// //     isTest: true,
// //     onFailure: async () => billing.request({ plan: MONTHLY_PLAN }),
// //   });
// //   // App logic
// //   res.send('Billing requested');
// // });

// // Add a route to handle payment submission
// app.post('/submit-payment', async (req, res) => {
//   const result = await submitPaymentAction({ request: req });
//   res.json(result);
// });

// // Checking active payments
// // app.get('/check-billing', async (req, res) => {
// //   const { billing } = await shopify.authenticate.admin(req);
// //   const { hasActivePayment, appSubscriptions } = await billing.check({
// //     plans: [MONTHLY_PLAN],
// //     isTest: false,
// //   });
// //   res.json({ hasActivePayment, appSubscriptions });
// // });

// // // Requesting payment with a custom return URL
// // app.get('/request-payment', async (req, res) => {
// //   const { billing } = await shopify.authenticate.admin(req);
// //   await billing.require({
// //     plans: [MONTHLY_PLAN],
// //     onFailure: async () => billing.request({
// //       plan: MONTHLY_PLAN,
// //       isTest: true,
// //       returnUrl: 'https://zookie-cloth.myshopify.com',
// //     }),
// //   });
// //   // App logic
// //   res.send('Payment requested');
// // });

// // // Cancelling a subscription
// // app.get('/cancel-subscription', async (req, res) => {
// //   const { billing } = await shopify.authenticate.admin(req);
// //   const billingCheck = await billing.require({
// //     plans: [MONTHLY_PLAN],
// //     onFailure: async () => billing.request({ plan: MONTHLY_PLAN }),
// //   });

// //   const subscription = billingCheck.appSubscriptions[0];
// //   const cancelledSubscription = await billing.cancel({
// //     subscriptionId: subscription.id,
// //     isTest: true,
// //     prorate: true,
// //   });

// //   // App logic
// //   res.send('Subscription cancelled');
// // });

// app.listen(process.env.PORT || 3000, () => {
//   console.log(`Server running on port ${process.env.PORT || 3000}`);
//   console.log('Access the server locally at http://localhost:3000');
// });
















































// import express from 'express';
// import bodyParser from 'body-parser';
// import { shopifyApp, BillingInterval } from '@shopify/shopify-app-remix/server';
// import path from 'path';

// const app = express();

// app.use(bodyParser.json());

// const MONTHLY_PLAN = 'Monthly subscription';
// const ANNUAL_PLAN = 'Annual subscription';
// const ONE_TIME_CHARGE = 'One Time Charge';
// const sessions = {};

// const sessionStorage = {
//   async storeSession(session) {
//     sessions[session.id] = session;
//     return true;
//   },
//   async loadSession(id) {
//     return sessions[id];
//   },
//   async deleteSession(id) {
//     delete sessions[id];
//     return true;
//   },
// };

// const shopify = shopifyApp({
//   appUrl: 'zookie-cloth.myshopify.com',
//   apiKey: 'da939965f28661e5a4203a4724789938',
//   apiSecretKey: '6f10d3d7b4db73efc83a0a8093d6afeb',
//   scopes: ['read_products', 'write_products'],
//   sessionStorage: sessionStorage,
//   billing: {
//     [MONTHLY_PLAN]: {
//       amount: 5,
//       currencyCode: 'USD',
//       interval: BillingInterval.Every30Days,
//     },
//     [ANNUAL_PLAN]: {
//       amount: 50,
//       currencyCode: 'USD',
//       interval: BillingInterval.Annual,
//     },
//     [ONE_TIME_CHARGE]: {
//       amount: 30,
//       currencyCode: 'USD',
//       interval: BillingInterval.OneTime,
//     },
//     future: {
//       v3_lineItemBilling: true,
//     },
//   },
// });

// app.post('/submit-payment', (req, res) => {
//   const { paymentDetails, selectedPlan } = req.body;
//   console.log('Received payment details:', paymentDetails);
//   console.log('Selected plan:', selectedPlan);

//   res.json({ message: 'Payment submitted successfully', plan: selectedPlan });
// });

// app.listen(process.env.PORT || 3000, () => {
//   console.log(`Server running on port ${process.env.PORT || 3000}`);
// });



































// const returnUrl = 'https://admin.shopify.com/store/zookie-clothing/apps/zookie1/payment';
// open(returnUrl);

// const shopify = new Shopify({
//   //   shopName: 'Zookie-Clothing',
//   //   apiKey: '6c72c2039498765d5af6c48fd7b1d8a5',
//   //   password: 'chearo',
//   //   apiVersion: '2021-07' // or any supported API version
//   // });

