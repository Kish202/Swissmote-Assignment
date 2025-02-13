const router = require('express').Router();
const {  createEvent, getAllEvents} = require( '../controllers/authController');


const protect = require('../middleware/errorHandler'); // Your JWT verification middleware


router.post('/create-event', protect, createEvent);
router.get('/get-all-events',getAllEvents);
module.exports = router;