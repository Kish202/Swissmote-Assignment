const router = require('express').Router();
const {  createEvent, getAllEvents, getMyEvents, updateEvent, getEventForEdit} = require( '../controllers/authController');


const protect = require('../middleware/errorHandler'); // Your JWT verification middleware

router.post('/create-event', protect, createEvent);
router.get('/get-all-events',getAllEvents);
router.get('/my-events',protect, getMyEvents);


const { validateEventUpdate } = require('../middleware/eventValidation');


// Get specific event for editing (Protected route)
router.get('/my-events/:eventId', protect, getEventForEdit);

// Update event (Protected route)
router.put('/my-events/:eventId', protect, chec,validateEventUpdate, updateEvent);
module.exports = router;