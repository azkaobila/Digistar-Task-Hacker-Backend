const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        req.user = decoded; // Store the decoded token data
        next(); // Pass control to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
    }
}

module.exports = authenticateToken;