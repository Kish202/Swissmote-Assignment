const router = require('express').Router();
const {  createEvent, getAllEvents, getMyEvents, updateEvent, } = require( '../controllers/authController');
const { checkEventOwnership } = require('../middleware/checkEventOwnership');


const protect = require('../middleware/errorHandler'); // Your JWT verification middleware

router.post('/create-event', protect, createEvent);
router.get('/get-all-events',getAllEvents);
router.get('/my-events',protect, getMyEvents);

router.get('/my-events/get-my-event/:id',protect, checkEventOwnership, getEve );
router.put('/my-events/edit-event/:id',protect, checkEventOwnership, updateEvent);


const { validateEventUpdate } = require('../middleware/eventValidation');


