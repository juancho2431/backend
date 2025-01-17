// middleware/authorize.js
const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ message: 'No autorizado' });
        }
        next();
    };
};

module.exports = authorize;
