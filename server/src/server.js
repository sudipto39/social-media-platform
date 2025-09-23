const mongoose = require('mongoose');
const dotenv = require('dotenv');
const config = require('./config/default');
const app = require('./app');
require('./workers/queue'); // Start Bull queue worker

dotenv.config();

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
