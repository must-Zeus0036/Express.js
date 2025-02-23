const http = require('http');
const express = require('express');
const mysql = require('mysql');
const app = express();

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'mariaDB'
});

db.connect((err) => {
    if (err) {
        console.log('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

app.use(express.urlencoded({ extended: true }));

// Define the users array
const users = [];

// HTTP methods
// GET
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, rows) => {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        if (rows.length === 0) {
            res.status(404).send('No users found');
            return;
        }
        res.status(200).send(rows);
    });
});

// POST create a new user
app.post('/users', (req, res) => {
    const { name, age } = req.body;
    db.query('INSERT INTO users (name, age) VALUES (?, ?)', [name, age], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Database error');
            return;
        }
        res.status(201).send('User added!');
    });

    const user = { ...req.body, id: parseInt(req.body.id) };
    const finduser = users.find(x => x.id === user.id);
    if (finduser) {
        res.status(400).send('User already exists');
        return;
    }
    users.push(user);
    console.log('User added:', user);
});

// DELETE a user by ID
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); // Convert ID to a number
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('User not found');
            return;
        }
        res.status(200).send(`User with ID ${id} deleted successfully`);
    });
    console.log('Received DELETE request for ID:', id);
    console.log('Users before deletion:', users);
    const finduserIndex = users.findIndex(x => x.id === id);
    if (finduserIndex === -1) {
        res.status(404).send('User not found');
        return;
    }
    users.splice(finduserIndex, 1);
    console.log('Users after deletion:', users);
    console.log('User deleted with ID:', id);
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});