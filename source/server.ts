import { createExpressApp, startServer, port, createHttpServer } from './app';
import { applyMiddleware } from './middlewares/global.middleware';
import { configureErrorHandling } from './config/error.config';
import { configureProcessHandlers } from './config/proccessHandler.config';
import envConfig from './config/env.config';
import express from 'express';
import path from 'path';
import { configureRoutes } from './middlewares/routes';
import { prismaErrorHandler } from './config/db.config';
import { Server } from 'socket.io';
import { verifyToken } from './config/jwt.config';
import { IJwtPayload } from './types/auth';

// Create Express app
const app = createExpressApp();

app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'public', 'uploads'))
);

app.use('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: envConfig.NODE_ENV,
  });
});

// Apply middleware
applyMiddleware(app);

// Configure routes
configureRoutes(app);

// Configure db error handling
app.use(prismaErrorHandler);

// Configure process handlers
configureProcessHandlers();

// Configure error handling (must be after routes)
configureErrorHandling(app);

//create http server
const server = createHttpServer(app);

//create io variable
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const decoded = verifyToken(
    token as string,
    envConfig.JWT_SECRET
  ) as IJwtPayload;

  socket.userId = decoded.userId;
  socket.companyId = decoded.companyId;

  next();
});

io.on('connection', socket => {
  const companyRoom = socket.companyId;
  console.log(`User ${socket.userId} joined ${companyRoom}`);
  socket.join(companyRoom);
});

// Start server
startServer(server, port);
