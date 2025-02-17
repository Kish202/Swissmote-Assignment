const router = require('express').Router();
const {  createEvent, getAllEvents, getMyEvents, updateEvent, getEventDetails, } = require( '../controllers/authController');
const { checkEventOwnership } = require('../middleware/checkEventOwnership');

const { validateEventUpdate } = require('../middleware/eventValidation');

const protect = require('../middleware/errorHandler'); // Your JWT verification middleware

router.post('/create-event', protect, createEvent);
router.get('/get-all-events',getAllEvents);
router.get('/my-events',protect, getMyEvents);

router.get('/my-events/get-my-event/:id',protect, checkEventOwnership, getEventDetails );
router.put('/my-events/edit-event/:id',protect, checkEventOwnership,validateEventUpdate, updateEvent);




