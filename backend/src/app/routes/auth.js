const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/usuario/register', register);
router.post('/usuario/login', login);

module.exports = router;
