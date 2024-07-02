const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Assuming you don't use body parsing yet
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Mongoose connection (without deprecated option)
mongoose.connect('mongodb://localhost:27017/quotes');

const quoteSchema = new mongoose.Schema({
  text: String,
  author: String
});

// Model name should match schema name (singular and case-sensitive)
const Quote = mongoose.model('Quote', quoteSchema);

// Error handling middleware (example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// API endpoint to get a random quote
app.get('/api/quote', async (req, res) => {
  try {
    const quotes = await Quote.find();
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(randomQuote);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching quotes');
  }
});

app.get('/api/quotes', async (req, res) => {
  const author = req.query.author;
  try {
    const quotes = await Quote.find({ author: new RegExp(author, 'i') });
    res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching quotes');
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});