const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('combined')); // Logging
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize Supabase client
const supabaseUrl = 'https://buwilawmsmsxcgvebrqi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1d2lsYXdtc21zeGNndmVicnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg1OTk4MjEsImV4cCI6MjAzNDE3NTgyMX0.0wy_QmMeLJv65mhH1ykvCSvJYjFDI6tu74VxPWKl26Q';
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
app.get('/', (req, res) => {
  res.send("Hello, I am working with Supabase!");
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new product
app.post('/products', async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .insert([
        {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price
        }
      ]);
    if (error) throw error;
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a product by ID
app.put('/products/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .update({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
      })
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a product by ID
app.delete('/products/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Catch-all route for unmatched routes
app.get('*', (req, res) => {
  res.send("Route not found!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
