const express = require('express');
const app = express();

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = [];

// HTTP methods
// GET
app.get('/users', (req, res) => {
    if (users.length === 0) {
        res.status(404).send('No users found');
        return;
    }
    res.status(200).send(users);
});

// POST create a new user
app.post('/users', (req, res) => {
    const user = { ...req.body, id: parseInt(req.body.id) };
    const finduser = users.find(x => x.id === user.id);
    if (finduser) {
        res.status(400).send('User already exists');
        return;
    }
    users.push(user);
    res.status(201).send('User added!');
    console.log('User added:', user);
});

// DELETE a user by ID
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); // Convert ID to a number
    console.log('Received DELETE request for ID:', id);
    console.log('Users before deletion:', users);
    const finduserIndex = users.findIndex(x => x.id === id);
    if (finduserIndex === -1) {
        res.status(404).send('User not found');
        return;
    }
    users.splice(finduserIndex, 1);
    console.log('Users after deletion:', users);
    res.status(200).send(`User with ID ${id} deleted successfully`);
    console.log('User deleted with ID:', id);
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});