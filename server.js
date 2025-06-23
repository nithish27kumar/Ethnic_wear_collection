const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(express.static('frontend')); // 'public' is the folder where your frontend files are


// Manually Set MongoDB URI
const MONGO_URI = 'mongodb://127.0.0.1:27017/dressDb'; // Change 'dressdb' to your database name

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB connected successfully');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if MongoDB connection fails
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);



// Start the server
const PORT = 5000; // You can also manually set the port here
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://127.0.0.1:5000`);
});
