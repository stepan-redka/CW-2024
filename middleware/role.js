exports.isAdmin = (req, res, next) => {
    if (req.session.userRole !== 'admin') {
        return res.status(403).send('Access denied.');
    }
    next();
};