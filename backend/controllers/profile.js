const multer = require('multer');
const path = require('path');
const db = require('../db'); // Assuming you have a db.js file for database connection

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.session.userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

exports.uploadAvatar = upload.single('avatar');

exports.renderEditProfile = (req, res) => {
    const userId = req.session.userId;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
        if (error || results.length === 0) {
            console.log(error);
            return res.render('error', {
                message: "User not found!",
                messageType: "alert-danger"
            });
        }

        res.render('editProfile', {
            user: results[0]
        });
    });
};

exports.updateProfile = (req, res) => {
    const userId = req.session.userId;
    const { name, email, bio } = req.body;
    const profile_picture = req.file ? `/uploads/${req.file.filename}` : req.body.profile_picture;

    db.query('UPDATE users SET ? WHERE id = ?', [{ name, email, profile_picture, bio }, userId], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('editProfile', {
                message: "Database error!",
                messageType: "alert-danger"
            });
        }

        res.redirect('/profile/edit');
    });
};