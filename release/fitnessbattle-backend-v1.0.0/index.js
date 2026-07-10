import 'dotenv/config';
import { validateEnvironment } from './config/validation.js';
import { connectDatabase } from './services/database.js';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import workoutRoutes from './routes/workout.js';
import nutritionRoutes from './routes/nutrition.js';
import socialRoutes from './routes/social.js';
import aiRoutes from './routes/ai.js';
const app = express();
const server = createServer(app);
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    },
}));
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: process.env.CORS_ORIGIN === '*' ? '*' : (process.env.CORS_ORIGIN?.split(',') || '*'),
}));
app.use(morgan('combined'));
// Global rate limiting
import { generalLimiter } from './middlewares/rateLimiter.js';
app.use(generalLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/ai', aiRoutes);
app.use((err, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
const io = new Server(server, {
    cors: { origin: process.env.CORS_ORIGIN || '*' }
});
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});
const PORT = process.env.PORT || 5000;
async function start() {
    try {
        validateEnvironment();
        await connectDatabase();
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
const gracefulShutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        process.exit(0);
    });
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
start();
