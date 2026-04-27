const express = require('express');
const path = require('path');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const catalogue = {
   coca: { priceId: 'price_1THsd52L2bSCgLcUoW1C6UM3' },
  oasis: { priceId: 'price_1TQnhd2L2bSCgLcUEm7xtLvb' },
  mars: { name: 'Mars', price: 130 },
  snickers: { name: 'Snickers', price: 120 }
};

app.post('/create-checkout-session', async (req, res) => {
  try {
    const panier = req.body.panier || [];

    const line_items = panier.map(item => {
      const produit = catalogue[item.id];
      return {
        price_data: {
          currency: 'eur',
          product_data: { name: produit.name },
          unit_amount: produit.price
        },
        quantity: item.quantity
      };
    }).filter(Boolean);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${process.env.DOMAIN}/success.html`,
      cancel_url: `${process.env.DOMAIN}/index.html`
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('Serveur lancé sur http://localhost:3000'));