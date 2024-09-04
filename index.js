const http = require('http');
const express = require('express');;
const bodyParser = require('body-parser');
const db = require('./database/db');
const query = require('./database/query');
const authenticateToken = require('./middleware/jwtAuth'); 

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.connectDB();

app.post('/register', (req, res) => {
    const { name, age, email, password } = req.body;
    if (!name || !age || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    query.registerUser({ name, age, email, password })
        .then(user => res.status(201).json(user))
        .catch(err => res.status(400).json({ message: err.message }));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password' });
    }

    query.loginUser({ email, password })
        .then(({ token, user }) => res.status(200).json({ token, user }))
        .catch(err => res.status(400).json({ message: err.message }));
});

app.get('/users', authenticateToken, (req, res) => {
    query.getAllUsers()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({ message: 'Internal Server Error' }));
});

app.get('/users/email/:email', authenticateToken, (req, res) => {
    const email = req.params.email;
    query.getUserByEmail(email)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => res.status(500).json({ message: 'Internal Server Error' }));
});

app.get('/users/:id', authenticateToken, (req, res) => {
    const id = req.params.id;
    query.getUserById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => res.status(500).json({ message: 'Internal Server Error' }));
});

app.post('/users', authenticateToken, (req, res) => {
    const { name, age } = req.body;
    if (!name || !age) {
        return res.status(400).json({ message: 'Please provide both name and age' });
    }

    query.createUser({ name, age })
        .then(user => res.status(201).json(user))
        .catch(err => res.status(500).json({ message: 'Internal Server Error' }));
});

app.put('/users/:id', authenticateToken, (req, res) => {
    const id = req.params.id;
    const { name, age } = req.body;
    query.updateUser(id, { name, age })
        .then(updatedUser => {
            if (updatedUser) {
                res.status(200).json(updatedUser);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => res.status(500).json({ message: 'Internal Server Error' }));
});

app.delete('/users/:id', authenticateToken, (req, res) => {
    const id = req.params.id;
    query.deleteUser(id)
        .then(deletedUser => {
            if (deletedUser) {
                res.status(200).json({ message: 'User deleted successfully' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => res.status(500).json({ message: 'Internal Server Error' }));
});

app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`);
    });