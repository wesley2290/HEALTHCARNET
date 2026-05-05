const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); // <-- Vérifie que cette ligne est présente

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // <-- Vérifie que cette ligne est présente

// Route de test
app.get('/', (req, res) => {
  res.send('✅ HealthCarnet Backend is running!');
});

// Démarrer le serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {  // <-- Ajoute '0.0.0.0' ici
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});