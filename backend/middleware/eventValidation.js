// middleware/eventValidation.js
const { body } = require('express-validator');

const validateEventUpdate = [
    body('eventName')
        .trim()
        .notEmpty()
        .withMessage('Event name is required'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    body('startDate')
        .isISO8601()
        .withMessage('Valid start date is required'),
    body('image')
        .optional()
        .isURL()
        .withMessage('Image must be a valid URL'),
];

module.exports = {
    validateEventUpdate
};