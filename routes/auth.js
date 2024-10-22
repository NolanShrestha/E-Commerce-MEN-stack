const express = require('express');
const { register, login, update, addProduct, payment, review
    } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/update', update);
router.post('/addProduct', addProduct);
router.post("/payment", payment);
router.post("/review", review);

module.exports = router;
