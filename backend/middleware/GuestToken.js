// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// const preventGuestAccess = async (req, res, next) => {
//     try {
        
//         const token = req.header('Authorization')?.replace('Bearer ', '');
        
//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'No token provided, access denied'
//             });
//         }

       
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

//         const user = await User.findById(decoded.id);
//         console.log(user);
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         }

//         if (user.isGuest) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Guest users cannot access this feature. Please register or login to continue.'
//             });
//         }


//         req.user = user;
//         next();

//     } catch (error) {
//         console.error('Guest middleware error:', error);
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid token'
//             });
//         }
//         res.status(500).json({
//             success: false,
//             message: 'Server error in guest middleware'
//         });
//     }
// };

// module.exports = preventGuestAccess;



// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const Guestaccess = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            
            token = req.headers.authorization.split(' ')[1];

            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

           
            req.user = await User.findById(decoded.id).select('-password');

            console.log(req.user);
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    }

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

module.exports = Guestaccess