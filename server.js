require('dotenv').config();  

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; 

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

let items = [];
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  

// Create
app.post('/api/items', (req, res) => {
  const newItem = req.body;
  items.push(newItem);
  res.status(201).json(newItem);
});

// Read
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Update
app.put('/api/items/:id', (req, res) => {
  const id = req.params.id;
  const updatedItem = req.body;
  items = items.map(item => (item.id === id ? updatedItem : item));
  res.json(updatedItem);
});

// Delete
app.delete('/api/items/:id', (req, res) => {
  const id = req.params.id;
  items = items.filter(item => item.id !== id);
  res.status(204).send();
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
