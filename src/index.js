require('dotenv').config();

const express = require('express');
const cors = require('cors');
const motorhomeRoutes = require('./routes/motorhomes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.use('/api/motorhomes', motorhomeRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Motorhome Database API running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}/api/health to check server status`);
  });
}

module.exports = app;
