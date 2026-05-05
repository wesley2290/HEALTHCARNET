const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');

// Enregistrer un utilisateur
const register = async (req, res) => {
  const { nom, prenom, email, mot_de_passe, role } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    // Créer l'utilisateur
    const [result] = await pool.query(
      'INSERT INTO users (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)',
      [nom, prenom, email, hashedPassword, role]
    );

    // Générer un token
    const user = { id: result.insertId, role };
    const token = generateToken(user);

    res.status(201).json({ token, user: { id: result.insertId, nom, prenom, email, role } });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription.', error: error.message });
  }
};

// Connecter un utilisateur
const login = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    // Générer un token
    const token = generateToken({ id: user.id, role: user.role });

    res.json({
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion.', error: error.message });
  }
};

module.exports = { register, login }; // <-- Export des fonctions