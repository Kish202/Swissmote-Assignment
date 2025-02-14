// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const protect = require('./middleware/errorHandler');
// const fileUpload = require('express-fileupload');
// const cloudinary = require('cloudinary').v2;
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(fileUpload({
//     useTempFiles:true  //temp file will start upload soon
// }))

//  // Configuration
//  cloudinary.config({ 
//     cloud_name: process.env.Cloud_Name, 
//     api_key: process.env.api_key, 
//     api_secret: process.env.api_secret 
// });



// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.error('MongoDB connection error:', err));

  



// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/events',require('./routes/events'));

// // app.use(protect);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const app = express();

// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const protect = require('./middleware/errorHandler');
// const fileUpload = require('express-fileupload');
// const cloudinary = require('cloudinary').v2;
// const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true
}));

// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.Cloud_Name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret 
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});