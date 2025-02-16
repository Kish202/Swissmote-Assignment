const router = require('express').Router();
const {  createEvent, getAllEvents, getMyEvents, editEvent} = require( '../controllers/authController');
const { checkEventOwnership } = require('../middleware/checkEventOwnership');


const protect = require('../middleware/errorHandler'); // Your JWT verification middleware

router.post('/create-event', protect, createEvent);
router.get('/get-all-events',getAllEvents);
router.get('/get-my-events', protect, getMyEvents);
router.post('/my-events/edit-event/:id',protect, editEvent);
router.get('/my-events/:id',protect,get)
module.exports = router;


