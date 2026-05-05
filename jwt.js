const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'HealthCarnet_SuperSecretKey_2026_!@#',
    { expiresIn: '1h' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'HealthCarnet_SuperSecretKey_2026_!@#');
};

module.exports = { generateToken, verifyToken };