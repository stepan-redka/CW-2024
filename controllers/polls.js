const db = require('../db');

const createPoll = (req, res) => {
    const { title, options } = req.body;
    const userId = req.session.userId;

    if (!title || !options || options.length === 0) {
        return res.render('error', {
            message: "Title and options are required!",
            messageType: "alert-danger"
        });
    }

    db.query('INSERT INTO polls (title, created_by) VALUES (?, ?)', [title, userId], (error, results) => {
        if (error) {
            console.log("Error inserting into polls:", error);
            return res.render('error', {
                message: "Database error!",
                messageType: "alert-danger"
            });
        }

        const pollId = results.insertId;
        const optionValues = options.split(',').map(option => [pollId, option.trim()]);

        // Insert options individually
        const insertOption = (option, callback) => {
            db.query('INSERT INTO options (poll_id, option_text) VALUES (?, ?)', option, callback);
        };

        const insertOptions = (options, callback) => {
            let completed = 0;
            options.forEach(option => {
                insertOption(option, (error) => {
                    if (error) {
                        console.log("Error inserting option:", option, error);
                        return callback(error);
                    }
                    completed++;
                    if (completed === options.length) {
                        callback(null);
                    }
                });
            });
        };

        insertOptions(optionValues, (error) => {
            if (error) {
                console.log("Error inserting into options:", error);
                return res.render('error', {
                    message: "Database error!",
                    messageType: "alert-danger"
                });
            }

            res.redirect(`/polls/${pollId}`);
        });
    });
};

const addComment = (req, res) => {
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

const viewPoll = (req, res) => {
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

const vote = (req, res) => {
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

        res.redirect('/polls');
    });
};

const getStatistics = (req, res) => {
    const pollId = req.params.id;

    db.query('SELECT options.option_text, COUNT(votes.id) AS vote_count FROM options LEFT JOIN votes ON options.id = votes.option_id WHERE options.poll_id = ? GROUP BY options.id', [pollId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Database error!" });
        }

        res.json(results);
    });
};

const listPolls = (req, res) => {
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

const renderCreatePoll = (req, res) => {
    res.render('createPoll');
};

const viewResults = (req, res) => {
    const pollId = req.params.id;

    db.query('SELECT * FROM polls WHERE id = ?', [pollId], (error, pollResults) => {
        if (error || pollResults.length === 0) {
            console.log(error);
            return res.render('error', {
                message: "Poll not found!",
                messageType: "alert-danger"
            });
        }

        db.query('SELECT options.option_text, COUNT(votes.id) AS vote_count FROM options LEFT JOIN votes ON options.id = votes.option_id WHERE options.poll_id = ? GROUP BY options.id', [pollId], (error, results) => {
            if (error) {
                console.log(error);
                return res.render('error', {
                    message: "Database error!",
                    messageType: "alert-danger"
                });
            }

            res.render('pollResults', {
                poll: pollResults[0],
                results: results
            });
        });
    });
};

module.exports = {
    createPoll,
    viewPoll,
    vote,
    addComment,
    viewResults,
    getStatistics,
    listPolls,
    renderCreatePoll
};