// config/axios.js
const axios = require('axios');
const logger = require('./logger'); // Optional: Create a logger utility

// const api = axios.create({
//     timeout: 5000
// });

api.interceptors.request.use(
    (config) => {
        config.metadata = { startTime: new Date() };
        logger?.info(`API Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        logger?.error('Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        const duration = new Date() - response.config.metadata.startTime;
        logger?.info(`API Response: ${response.status} (${duration}ms)`);
        return response;
    },
    (error) => {
        logger?.error('Response Error:', {
            status: error.response?.status,
            message: error.response?.data?.message
        });
        return Promise.reject(error);
    }
);

module.exports = api;