const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4000';

const adminMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        let response;
        try {
            response = await axios.post(`${USER_SERVICE_URL}/auth/checkToken/${token}`);
            if (!response.data.valid) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }
        } catch (axiosError) {
            console.error("Axios Error:", axiosError.response?.data || axiosError.message);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userType !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = adminMiddleware;
