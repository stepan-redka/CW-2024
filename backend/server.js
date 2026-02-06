const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./config/database');
const websocket = require('./services/websocket'); // Include the WebSocket server

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'hbs');

db.connect((err) => {
    if (err) {
        console.error("Помилка " + err.message);
    } else {
        console.log('Connected to the database');
    }
});

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    res.locals.messageType = req.session.messageType;
    res.locals.userId = req.session.userId; // Pass userId to views
    delete req.session.message;
    delete req.session.messageType;
    next();
});

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/polls', require('./routes/polls'));
app.use('/profile', require('./routes/profile'));
app.use('/chat', require('./routes/chat')); // Include chat routes

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});