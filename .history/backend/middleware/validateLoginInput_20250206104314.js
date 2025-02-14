// middleware/validateLoginInput.js
const validateLoginInput = (req, res, next) => {
    const { email, password } = req.body;

    // Check if fields exist
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address'
        });
    }

    next();
};

module.exports = validateLoginInput;