const router = require('express').Router();
const { register, login, verifyToken, createEvent, getAllEvents} = require( '../controllers/authController');
const loginLimiter =  require('../middleware/rateLimiter');
const validateLoginInput =require('../middleware/validateLoginInput');
const protect = require('../middleware/errorHandler'); // Your JWT verification middleware

router.post('/register', register);
router.post('/login', validateLoginInput, login);

router.get('/verify', protect, verifyToken);



module.exports = router;