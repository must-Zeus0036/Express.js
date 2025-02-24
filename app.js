const http = require('http');
const express = require('express');
const mysql = require('mysql');
const app = express();

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());

const db = mysql.createConnection({ // connection to the database
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

app.use(express.urlencoded({ extended: true })); //using middleware to parse the data

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
    const { id, name, age } = req.body;
    if (!id || !name || !age) {
        res.status(407).send('ID, name, and age are required');
        return;
    }

    // Check if the user with the given ID already exists in the database
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Database error');
            return;
        }
        if (rows.length > 0) {
            res.status(400).send('User with this ID already exists');
            return;
        }

        // Insert the new user into the database
        db.query('INSERT INTO users (id, name, age) VALUES (?, ?, ?)', [id, name, age], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).send('Database error');
                return;
            }
            res.status(201).send('User added!');

            // Add the user to the users array
            const user = { id, name, age };
            users.push(user);
            console.log('User added:', user);
        });
    });
});

// DELETE a user by ID
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); // Convert ID to a number

    // Delete user from the database
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('User not found');
            return;
        }

        // Log the received DELETE request and the current state of the users array
        console.log('Received DELETE request for ID:', id);
        console.log('Users before deletion:', users);

        // Find and delete the user from the users array
        const finduserIndex = users.findIndex(x => x.id === id);
        if (finduserIndex === -1) {
            res.status(404).send('User not found in array');
            return;
        }
        users.splice(finduserIndex, 1); // Remove the user from the array

        // Log the updated state of the users array
        console.log('Users after deletion:', users);
        console.log('User deleted with ID:', id);

        // Send a single response indicating the user was deleted successfully
        res.status(200).send(`User with ID ${id} deleted successfully`);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});