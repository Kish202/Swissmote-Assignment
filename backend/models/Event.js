const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Host user reference is required']
  },
  hostName: {
    type: String,
    required: [true, 'Host name is required'],
    trim: true
  },
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['Conference', 'Workshop', 'Seminar', 'Meetup', 'Concert', 'Exhibition', 'Party', 'Technology']
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    // validate: {
    //   validator: function(value) {
    //     return value >= new Date();
    //   },
    //   message: 'Start date cannot be in the past'
    // }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    // validate: {
    //   validator: function(value) {
    //     return value >= this.startDate;
    //   },
    //   message: 'End date must be after or equal to start date'
    // }
  },
  image: {
    type: String,
    required: [true, 'Event image is required']
  },


  attendees: {
    type: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    default: [],
    validate: {
        validator: function(array) {
            return array.every(item => item != null);
        },
        message: 'Attendees array cannot contain null values'
    }
},
attendeeCount: {
    type: Number,
    default: 0,
    min: 0
}




}, {
  timestamps: true
});

// Indexes for better query performance
eventSchema.index({ host: 1, startDate: 1 });
eventSchema.index({ category: 1 });



// eventSchema.index({ 'attendees.userId': 1 });
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;


// // pre-save middleware to clean nulls and update count
// eventSchema.pre('save', function(next) {
//   // Remove null values
//   this.attendees = this.attendees.filter(attendee => attendee != null);
//   // Update attendee count
//   this.attendeeCount = this.attendees.length;
//   next();
//   });


