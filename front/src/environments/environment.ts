export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  stripe: {
    // You need to get the publishable key from your Stripe dashboard that corresponds to your secret key
    // It should start with pk_test_51Rwhs9FH... to match your sk_test_51Rwhs9FH... secret key
    publishableKey: 'pk_test_51Rwhs9FHify35ozwY1Hu4gyZe4uiMeyq7RHpm9UJjN5XHoMbFgCeF1lLHnoMhHqyo8yasd3zK8CO2cQ16sYvrqX400mhmikhpy'
  }
};
