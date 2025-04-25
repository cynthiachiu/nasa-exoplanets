const express = require('express');
const cors = require('cors');
const exoplanetRoutes = require('./routes/exoplanetRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', exoplanetRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  const { initializeData } = require('./services/exoplanetService');
  await initializeData();
});