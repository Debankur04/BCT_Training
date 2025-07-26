const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';

// In-memory storage
let users = [];
let contacts = [];
let contactId = 1;

// Middleware to verify JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/',(req,res)=>{
    res.send('Api is working')
})

// Signup
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    users.push({ username, password });
    res.json({ message: 'Signup successful' });
});

// Signin
app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Create contact
app.post('/contacts', authenticateToken, (req, res) => {
    const { name, number, email } = req.body;
    const contact = { id: contactId++, name, number, email, owner: req.user.username };
    contacts.push(contact);
    res.json(contact);
});

// Read contacts
app.get('/contacts', authenticateToken, (req, res) => {
    const userContacts = contacts.filter(c => c.owner === req.user.username);
    res.json(userContacts);
});

// Update contact
app.put('/contacts/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, number, email } = req.body;
    const contact = contacts.find(c => c.id == id && c.owner === req.user.username);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    contact.name = name || contact.name;
    contact.number = number || contact.number;
    contact.email = email || contact.email;
    res.json(contact);
});

// Delete contact
app.delete('/contacts/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = contacts.findIndex(c => c.id == id && c.owner === req.user.username);
    if (index === -1) return res.status(404).json({ message: 'Contact not found' });
    contacts.splice(index, 1);
    res.json({ message: 'Contact deleted' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
/*
Example JSON bodies for Postman requests:

1. Signup (POST /signup)
{
    "username": "alice",
    "password": "password123"
}

2. Signin (POST /signin)
{
    "username": "alice",
    "password": "password123"
}

3. Create Contact (POST /contacts)
{
    "name": "Bob Smith",
    "number": "1234567890",
    "email": "bob@example.com"
}

4. Update Contact (PUT /contacts/:id)
{
    "name": "Robert Smith",
    "number": "0987654321",
    "email": "robert@example.com"
}

No body needed for:
- Read Contacts (GET /contacts)
- Delete Contact (DELETE /contacts/:id)
*/
