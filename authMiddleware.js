 const { verifyToken } = require('../config/jwt');

// Middleware pour vérifier le token JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Ajoute les infos du user dans la requête
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Token invalide.' });
  }
};

module.exports = authMiddleware;
