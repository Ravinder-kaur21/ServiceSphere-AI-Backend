import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { config } from './config/env.js';
import userRoutes from './routes/userRoutes.js';
import technicianRoutes from './routes/technicianRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ServiceSphere AI API is running' });
});

app.use('/api', userRoutes);
app.use('/api', technicianRoutes);

app.use(errorHandler);

async function startServer() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed, continuing with memory-only API mode:', error.message);
  }

  app.listen(config.port, () => {
    console.log(`ServiceSphere AI API listening on port ${config.port}`);
  });
}

startServer();

export default app;
