const router = require('express').Router();
const {  createEvent, getAllEvents, getMyEvents, editEvent, getEventById, attendEvent, attendeeList, attendeeStatus} = require( '../controllers/authController');
const { checkEventOwnership } = require('../middleware/checkEventOwnership');


const protect = require('../middleware/errorHandler'); // Your JWT verification middleware

router.post('/create-event', protect, createEvent);
router.get('/get-all-events',getAllEvents);
router.get('/get-my-events', protect, getMyEvents);
router.post('/my-events/edit-event/:id',protect, editEvent);
router.get('/my-events/:id',protect,getEventById)

router.get('/:eventId/attendees', protect, attendeeList);
router.get('/:eventId/status/:userId', protect, attendeeStatus);
module.exports = router;


