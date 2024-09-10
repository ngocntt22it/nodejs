require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const itemSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  price: Number,
});

const Item = mongoose.model('Item', itemSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/items', async (req, res) => {
  const newItem = new Item(req.body);
  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create item', error });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items', error });
  }
});

app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  try {
    const item = await Item.findByIdAndUpdate(id, updatedItem, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update item', error });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete item', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
