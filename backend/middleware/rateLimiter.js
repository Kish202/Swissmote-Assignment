// // middleware/rateLimiter.js
// // to prevent brute force
// const rateLimit = require('express-rate-limit');

// const loginLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: , // 5 attempts per window per IP
//     message: {
//         success: false,
//         message: 'Too many login attempts, please try again after 15 minutes'
//     }
// });

// module.exports = loginLimiter;