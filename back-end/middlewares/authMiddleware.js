const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
    
        // check if authorization header is present
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
    
        // extract token from header
        const token = authHeader.split(' ')[1];
    
        // check if token is present
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
    
        // verify token
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = payload; // create user object in request
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = { authMiddleware };