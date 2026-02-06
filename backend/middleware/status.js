exports.isActive = (req, res, next) => {
    if (req.session.userStatus !== 'active') {
        return res.status(403).send('Account is inactive.');
    }
    next();
};