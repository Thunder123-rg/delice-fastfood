const express = require('express');
const stripe = require('stripe')('ta_clé_secrète_stripe');
const app = express();

app.use(express.json());

app.post('/charge', async (req, res) => {
    try {
        const { token, amount, name, email, address } = req.body;

        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'eur',
            source: token,
            description: 'Commande sur mon site',
            receipt_email: email,
        });

        res.json({ success: true, charge });
    } catch (error) {
        console.error('Erreur Stripe:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});
