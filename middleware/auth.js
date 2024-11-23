exports.isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};
// exports.logout = (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.log(err);
//             return res.redirect('/');
//         }
//         res.clearCookie('connect.sid'); // Clear the session cookie
//         res.redirect('/'); // Redirect to home page
//     });
// };