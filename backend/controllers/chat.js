const db = require('../db');

exports.renderChat = (req, res) => {
    const userId = req.session.userId;
    const userName = req.session.userName; // Assuming you store the user's name in the session

    db.query('SELECT * FROM messages ORDER BY timestamp ASC', (error, results) => {
        if (error) {
            console.log(error);
            return res.render('error', {
                message: "Database error!",
                messageType: "alert-danger"
            });
        }

        res.render('chat', { title: 'Chat', messages: results, userName: userName });
    });
};

exports.renderListPollsWithChat = (req, res) => {
    const userId = req.session.userId;
    const userName = req.session.userName; // Assuming you store the user's name in the session

    db.query('SELECT * FROM polls', (error, pollResults) => {
        if (error) {
            console.log(error);
            return res.render('error', {
                message: "Database error!",
                messageType: "alert-danger"
            });
        }

        db.query('SELECT * FROM messages ORDER BY timestamp ASC', (error, messageResults) => {
            if (error) {
                console.log(error);
                return res.render('error', {
                    message: "Database error!",
                    messageType: "alert-danger"
                });
            }

            res.render('listPolls', { polls: pollResults, messages: messageResults, userName: userName });
        });
    });
};