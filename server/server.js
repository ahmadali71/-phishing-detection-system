const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route imports
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const logRoutes = require('./routes/logRoutes');
const statRoutes = require('./routes/statRoutes');
const modelRoutes = require('./routes/modelRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/models', modelRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
