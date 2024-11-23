const db = require('../db');

exports.viewPoll = (req, res) => {
    const pollId = req.params.id;

    db.query('SELECT * FROM polls WHERE id = ?', [pollId], (error, pollResults) => {
        if (error || pollResults.length === 0) {
            console.log(error);
            return res.render('error', {
                message: "Poll not found!",
                messageType: "alert-danger"
            });
        }

        db.query('SELECT * FROM options WHERE poll_id = ?', [pollId], (error, optionResults) => {
            if (error) {
                console.log(error);
                return res.render('error', {
                    message: "Database error!",
                    messageType: "alert-danger"
                });
            }

            db.query('SELECT comments.*, users.name FROM comments JOIN users ON comments.user_id = users.id WHERE poll_id = ?', [pollId], (error, commentResults) => {
                if (error) {
                    console.log(error);
                    return res.render('error', {
                        message: "Database error!",
                        messageType: "alert-danger"
                    });
                }

                res.render('viewPoll', {
                    poll: pollResults[0],
                    options: optionResults,
                    comments: commentResults
                });
            });
        });
    });
};

exports.vote = (req, res) => {
    const pollId = req.params.id;
    const { optionId } = req.body;
    const userId = req.session.userId;

    db.query('INSERT INTO votes (poll_id, option_id, user_id) VALUES (?, ?, ?)', [pollId, optionId, userId], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('error', {
                message: "Database error!",
                messageType: "alert-danger"
            });
        }

        res.redirect(`/polls/${pollId}`);
    });
};

exports.getStatistics = (req, res) => {
    const pollId = req.params.id;

    db.query('SELECT options.option_text, COUNT(votes.id) AS vote_count FROM options LEFT JOIN votes ON options.id = votes.option_id WHERE options.poll_id = ? GROUP BY options.id', [pollId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error!" });
        }

        res.json(results);
    });
};

exports.listPolls = (req, res) => {
    const userName = req.session.userName;

    db.query('SELECT * FROM polls', (error, results) => {
        if (error) {
            console.log("Database error:", error);
            return res.render('error', {
                message: "Database error!",
                messageType: "alert-danger"
            });
        }

        db.query('SELECT * FROM messages ORDER BY timestamp ASC', (error, messageResults) => {
            if (error) {
                console.log("Database error:", error);
                return res.render('error', {
                    message: "Database error!",
                    messageType: "alert-danger"
                });
            }

            res.render('listPolls', {
                polls: results.length > 0 ? results : [],
                messages: messageResults,
                userName: userName
            });
        });
    });
};

exports.renderCreatePoll = (req, res) => {
    res.render('createPoll');
};

exports.createPoll = (req, res) => {
    const { title, options } = req.body;
    const userId = req.session.userId;

    db.query('INSERT INTO polls (title, user_id) VALUES (?, ?)', [title, userId], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('error', {
                message: "Database error!",
                messageType: "alert-danger"
            });
        }

        const pollId = results.insertId;
        const optionValues = options.map(option => [pollId, option]);

        db.query('INSERT INTO options (poll_id, option_text) VALUES ?', [optionValues], (error) => {
            if (error) {
                console.log(error);
                return res.render('error', {
                    message: "Database error!",
                    messageType: "alert-danger"
                });
            }

            res.redirect(`/polls/${pollId}`);
        });
    });
};

exports.addComment = (req, res) => {
    const pollId = req.params.id;
    const { comment } = req.body;
    const userId = req.session.userId;

    db.query('INSERT INTO comments (poll_id, user_id, comment) VALUES (?, ?, ?)', [pollId, userId, comment], (error) => {
        if (error) {
            console.log(error);
            return res.render('error', {
                message: "Database error!",
                messageType: "alert-danger"
            });
        }

        res.redirect(`/polls/${pollId}`);
    });
};

exports.viewResults = (req, res) => {
    const pollId = req.params.id;

    db.query('SELECT options.option_text, COUNT(votes.id) AS vote_count FROM options LEFT JOIN votes ON options.id = votes.option_id WHERE options.poll_id = ? GROUP BY options.id', [pollId], (error, results) => {
        if (error) {
            console.log(error);
            return res.render('error', {
                message: "Database error!",
                messageType: "alert-danger"
            });
        }

        res.render('viewResults', {
            pollId: pollId,
            results: results
        });
    });
};