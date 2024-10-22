const express = require('express');
const { register, login, update, addProduct, addToCart, removeFromCart, payment, review
    } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/update', update);
router.post('/addProduct', addProduct);
router.post("/addToCart", addToCart);
router.post("/removeFromCart", removeFromCart);
router.post("/payment", payment);
router.post("/review", review);

module.exports = router;
