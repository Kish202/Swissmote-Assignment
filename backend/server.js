require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const protect = require('./middleware/errorHandler');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const app = express();

const http = require('http');
const User = require('./models/User');
const Event = require('./models/Event');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:5173", // Your React app URL
        methods: ["GET", "POST"]
    }
});


app.use(cors());
app.use(express.json());
app.use(fileUpload({
    useTempFiles:true  //temp file will start upload soon
}))

 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.Cloud_Name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret 
});



// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

  
// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle join event
    socket.on('joinEvent', async ({ userId, eventId }) => {
        try {

            
            const event = await Event.findById(eventId);
            const user = await User.findById(userId);

            if (!event || !user) {
                socket.emit('joinEventError', { message: 'Event or user not found' });
                return;
            }

            // Check if user already joined
            if (event.attendees.some(attendee => attendee.userId.toString() === userId)) {
                socket.emit('joinEventError', { message: 'Already joined this event' });
                return;
            }

            // Update database
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                // Add user to event attendees
                event.attendees.push({ userId });
                event.attendeeCount = event.attendees.length;
                await event.save({ session });

                // Add event to user's joined events
                await User.findByIdAndUpdate(
                    userId,
                    {
                        $addToSet: { joinedEvents: eventId },
                        $inc: { joinedEventsCount: 1 }
                    },
                    { session }
                );

                await session.commitTransaction();

                // Emit updated attendee count to all clients
                io.emit('attendeeUpdate', {
                    eventId: eventId,
                    attendeeCount: event.attendeeCount,
                    attendees: event.attendees
                });

            } catch (error) {
                await session.abortTransaction();
                socket.emit('joinEventError', { message: error.message });
            } finally {
                session.endSession();
            }

        } catch (error) {
            socket.emit('joinEventError', { message: error.message });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events',require('./routes/events'));

// app.use(protect);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
