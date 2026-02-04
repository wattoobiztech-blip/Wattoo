const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/auth.middleware');
const Helpers = require('../utils/helpers');

// Placeholder routes - will be implemented with full controllers
router.get('/plans', async (req, res) => {
  try {
    const plans = {
      golden: {
        name: 'Golden',
        price: 29.99,
        duration: 30,
        features: ['50 profile views', '10 interests per day', 'Advanced search', 'Profile boost']
      },
      diamond: {
        name: 'Diamond',
        price: 59.99,
        duration: 30,
        features: ['100 profile views', '25 interests per day', 'Advanced search', 'Priority support', 'Profile boost']
      },
      elite: {
        name: 'Elite',
        price: 99.99,
        duration: 30,
        features: ['Unlimited profile views', 'Unlimited interests', 'Advanced search', 'Priority support', 'Profile boost']
      }
    };

    res.json(
      Helpers.formatResponse(
        true,
        'Subscription plans retrieved successfully',
        { plans }
      )
    );
  } catch (error) {
    res.status(500).json(
      Helpers.formatError('Subscription route error', 500)
    );
  }
});

module.exports = router;