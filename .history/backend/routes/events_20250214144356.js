const router = require('express').Router();
const {  createEvent, getAllEvents, getMyEvents, updateEvent, getEventForEdit} = require( '../controllers/authController');
const { checkEventOwnership } = require('../middleware/checkEventOwnership');


const protect = require('../middleware/errorHandler'); // Your JWT verification middleware

router.post('/create-event', protect, createEvent);
router.get('/get-all-events',getAllEvents);
router.get('/my-events',protect, getMyEvents);

router.get('/edit-event/:id',protect, checkEventOwnership, getEventForEdit);
router.put('')


const { validateEventUpdate } = require('../middleware/eventValidation');


