const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré. Veuillez vous reconnecter.' });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Token invalide. Veuillez vous authentifier à nouveau.' });
        }

        res.status(500).json({ message: 'Erreur serveur.' });
    }
};


module.exports = authMiddleware;
