const mongoose = require('mongoose');

const eventAttendeeSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const attendeeEvent = mongoose.model('attendeeEvent', eventAttendeeSchema);

module.exports = attendeeEvent;