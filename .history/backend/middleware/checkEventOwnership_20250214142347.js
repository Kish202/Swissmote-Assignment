const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model
const Event = require('../models/Event'); // Import Event model

  const checkEventOwnership = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.user.id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if the logged-in user is the event owner
        if (event.hostId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to edit this event'
            });
        }

        // Add event to request object for future use
        req.event = event;
        next();
    } catch (error) {
        console.error('Error checking event ownership:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while checking event ownership'
        });
    }
};


mo