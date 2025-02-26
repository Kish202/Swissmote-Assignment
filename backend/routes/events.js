const router = require('express').Router();
const {  createEvent, getAllEvents, getMyEvents, editEvent, getEventById, attendEvent, attendeeList, attendeeStatus, deleteEvent} = require( '../controllers/authController');
const { checkEventOwnership } = require('../middleware/checkEventOwnership');


const protect = require('../middleware/errorHandler'); // Your JWT verification middleware
const Guestaccess = require('../middleware/GuestToken');


router.post('/create-event', protect,Guestaccess, createEvent);
router.get('/get-all-events',getAllEvents);
router.get('/get-my-events', protect, Guestaccess, getMyEvents);
router.put('/my-events/edit-event/:id',protect, Guestaccess,editEvent);
router.get('/my-events/:id',protect,getEventById)

router.get('/:eventId/attendees', protect, attendeeList);
router.get('/:eventId/status/:userId', protect, attendeeStatus);
router.delete('/my-events/:id/delete-event', protect,Guestaccess, deleteEvent);

module.exports = router;

