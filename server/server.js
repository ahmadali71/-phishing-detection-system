const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, getConnectionStatus } = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database (non-blocking — server starts even if DB fails)
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

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'APDS Phishing Detection API',
    version: '1.0.0',
    status: 'running',
    database: getConnectionStatus() ? 'connected' : 'disconnected',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      scans: '/api/scans',
      logs: '/api/logs',
      stats: '/api/stats',
      models: '/api/models'
    }
  });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    database: getConnectionStatus() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Health check for frontend
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: getConnectionStatus() ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`   API:    http://localhost:${PORT}/api`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
