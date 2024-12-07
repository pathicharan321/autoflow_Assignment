import express from 'express';
import  bodyParser from 'body-parser';
import  mongoose from 'mongoose';
import ratelimit from 'express-rate-limit'
const app = express();
import 'dotenv/config'
const PORT =process.env.port||4000;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let rateLimiter = ratelimit({
  windowMs: 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 1000,
  message: 'You have exceeded the 100 requests in 24 hrs limit!', 
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api',rateLimiter);

import urlrouter from './routes/apiroute.js';
app.use('/api',urlrouter);

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_CLUSTER = process.env.MONGO_CLUSTER;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const mongoURI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

  