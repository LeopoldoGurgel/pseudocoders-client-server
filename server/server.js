const express = require('express');
require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


const startApolloServer = async () => {
    await server.start();
    
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    
    app.use('/graphql', expressMiddleware(server, {
      context: authMiddleware
    }));
  
    // if we're in production, serve client/dist as static assets
  
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));
  
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }
  
     /*
     this block of code is for payment path using stripe method. 
     I intend to add a donation option in the future.

    app.post('/payment', async (req, res) => {
      try {
        const { items, currency } = req.body;
      // Create a Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateTotalAmount(items),
        currency: 'cad',
        source: token.id
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Could not create payment intent' });
    }
    });
    */
    
    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      });
    });
  };
  
  startApolloServer();
  