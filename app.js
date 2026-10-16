const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const cors = require('cors');
const express = require('express');
const menuRoutes = require('./src/routes/menuRoutes');
const typeRoutes = require('./src/routes/typeRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/menu', menuRoutes);
app.use('/api/type', typeRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

if (require.main === module) {
  const port = Number(process.env.PORT || 5000);
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

module.exports = app;
