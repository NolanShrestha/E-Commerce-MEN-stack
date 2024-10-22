const express = require('express');
const { register, login, update
    } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/update', update);

module.exports = router;
