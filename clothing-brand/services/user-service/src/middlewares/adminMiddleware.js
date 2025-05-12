const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user.userType !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Admin verification failed' });
    }
};

module.exports = adminMiddleware;