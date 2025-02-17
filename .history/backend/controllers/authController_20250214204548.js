const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

const register = async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        // Check username uniqueness
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username must be unique'
            });
        }

        // Check email uniqueness
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'This email is already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message:"user created successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// login function


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email
            },
        message:'uer successfully logged in'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};



// controllers/authController.js
const verifyToken = async (req, res) => {
    try {
        // Token is already verified by middleware
        res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const googleLogin = async (req, res) => {
//     try {
//         const { token } = req.body;
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: process.env.GOOGLE_CLIENT_ID
//         });

//         const payload = ticket.getPayload();
        
//         // Find or create user
//         let user = await User.findOne({ email: payload.email });
//         if (!user) {
//             user = await User.create({
//                 email: payload.email,
//                 name: payload.name,
//                 username: payload.email.split('@')[0],
//                 password: await bcrypt.hash(Math.random().toString(36), 10)
//             });
//         }

//         // Generate JWT
//         const jwtToken = generateToken(user._id);

//         res.json({
//             success: true,
//             token: jwtToken,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });
//     } catch (error) {
//         res.status(401).json({
//             success: false,
//             message: 'Invalid token'
//         });
//     }
// };

// router.get('/verify', protect, verifyToken);






const Event = require('../models/Event');
const cloudinary = require('cloudinary').v2;

const createEvent = async (req, res) => {
    try {
        const {
            eventName,
            category,
            description,
            startDate,
            endDate
        } = req.body;

        // Validate required fields
        if (!eventName || !category || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        if (start < now) {
            return res.status(400).json({
                success: false,
                message: 'Start date cannot be in the past'
            });
        }

        if (end < start) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        // Check if image was uploaded
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                success: false,
                message: 'Event image is required'
            });
        }

        const file = req.files.image;

        // Validate image type
        if (!file.mimetype.startsWith('image')) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image file'
            });
        }


        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'events',
            resource_type: 'auto'
        });

        // Create event
        const event = await Event.create({
            host: req.user._id,
            hostName: req.user.name,
            eventName,
            category,
            description,
            startDate,
            endDate,
            image: result.secure_url
        });

        // Update user's createdEvents array
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { createdEvents: event._id } },
            { new: true }
        );

        res.status(201).json({
            success: true,
            data: event,
            message: 'Event created successfully'
        });

    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
};

const getAllEvents = async (req, res) => {
    try {
        // Fetch all events and populate host details
        const events = await Event.find()
            .populate('host', 'username -_id') // Populate host details but exclude password
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            success: true,
            count: events.length,
            data: events,
            message: 'Events fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
};

const getMyEvents = async (req, res) => {
    try {
        // Get authenticated user's ID from req.user (set by auth middleware)
        const userId = req.user._id;

        // Find all events where the host is the current user
        const events = await Event.find({ host: userId })
            .populate({
                path: 'host',
                select: 'username name email -_id' // Include specific user fields, exclude _id
            })
            .sort({ startDate: 1 }) // Sort by start date ascending
            .select('-__v'); // Exclude version key

        res.status(200).json({
            success: true,
            count: events.length,
            data: events,
            message: 'Your events fetched successfully'
        });

    } catch (error) {
        console.error('Error fetching user events:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your events',
            error: error.message
        });
    }
};





const editEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        // Find event and verify ownership
        const event = await Event.findOne({ _id: eventId, host: userId });
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found or you are not authorized to edit this event'
            });
        }

        const {
            eventName,
            category,
            description,
            startDate,
            endDate,
            hostName
        } = req.body;

        // Validate dates if they are being updated
        if (startDate || endDate) {
            const start = new Date(startDate || event.startDate);
            const end = new Date(endDate || event.endDate);
            const now = new Date();

            if (start < now) {
                return res.status(400).json({
                    success: false,
                    message: 'Start date cannot be in the past'
                });
            }

            if (end < start) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date'
                });
            }
        }

        // Handle image update if new image is uploaded
        let imageUrl = event.image; // Keep existing image by default
        if (req.files && req.files.image) {
            const file = req.files.image;

            // Validate image type
            if (!file.mimetype.startsWith('image')) {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload an image file'
                });
            }

            // Upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'events',
                resource_type: 'auto'
            });
            imageUrl = result.secure_url;
        }

        // Update event with new data
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                eventName: eventName || event.eventName,
                category: category || event.category,
                description: description || event.description,
                startDate: startDate || event.startDate,
                endDate: endDate || event.endDate,
                hostName: hostName || event.hostName,
                image: imageUrl
            },
            { new: true, runValidators: true }
        ).populate('host', 'username name email -_id');

        res.status(200).json({
            success: true,
            data: updatedEvent,
            message: 'Event updated successfully'
        });

    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: error.message
        });
    }
};




module.exports = {
    register,
    login,
    verifyToken,
    createEvent,
    getAllEvents,
    getMyEvents
   
};
