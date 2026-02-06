const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../config/database'); // Import the db module

exports.register = (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
        return res.render('register', {
            message: "All fields are required!",
            messageType: "alert-danger"
        });
    }

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.render('register', {
                message: "Database error!",
                messageType: "alert-danger"
            });
        }

        if (results.length > 0) {
            return res.render('register', {
                message: "Email already in use!",
                messageType: "alert-danger"
            });
        }

        if (password !== passwordConfirm) {
            return res.render('register', {
                message: "Passwords do not match!",
                messageType: "alert-danger"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO users SET ?', { name, email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
                return res.render('register', {
                    message: "Database error!",
                    messageType: "alert-danger"
                });
            } else {
                // Set session variables
                req.session.userId = results.insertId;
                req.session.userName = name; // Store the user's name in the session
                req.session.userRole = 'user'; // Default role
                req.session.userStatus = 'active'; // Default status

                // Redirect to home page
                return res.redirect('/');
            }
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', {
            message: "All fields are required!",
            messageType: "alert-danger"
        });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.render('login', {
                message: "Database error!",
                messageType: "alert-danger"
            });
        }

        if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            return res.render('login', {
                message: "Email or Password is incorrect!",
                messageType: "alert-danger"
            });
        } else {
            req.session.userId = results[0].id;
            req.session.userName = results[0].name; // Store the user's name in the session
            req.session.userRole = results[0].role;
            req.session.userStatus = results[0].status;
            return res.redirect('/');
        }
    });
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/'); // Redirect to home page
    });
};

exports.resetPassword = (req, res) => {
    const { email } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error || results.length === 0) {
            console.log(error);
            return res.render('error', {
                message: "Email not found!",
                messageType: "alert-danger"
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // 1 hour

        db.query('UPDATE users SET ? WHERE email = ?', [{ reset_token: resetToken, reset_token_expires: resetTokenExpires }, email], (error, results) => {
            if (error) {
                console.log(error);
                return res.render('error', {
                    message: "Database error!",
                    messageType: "alert-danger"
                });
            }

            // Send email with reset link (not implemented here)
            // Example: `http://localhost:3000/auth/reset-password/${resetToken}`

            res.render('message', {
                message: "Password reset link has been sent to your email.",
                messageType: "alert-success"
            });
        });
    });
};

exports.updatePassword = (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    db.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?', [token, Date.now()], async (error, results) => {
        if (error || results.length === 0) {
            console.log(error);
            return res.render('error', {
                message: "Invalid or expired token!",
                messageType: "alert-danger"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        db.query('UPDATE users SET ? WHERE reset_token = ?', [{ password: hashedPassword, reset_token: null, reset_token_expires: null }, token], (error, results) => {
            if (error) {
                console.log(error);
                return res.render('error', {
                    message: "Database error!",
                    messageType: "alert-danger"
                });
            }

            res.render('message', {
                message: "Password has been updated.",
                messageType: "alert-success"
            });
        });
    });
};