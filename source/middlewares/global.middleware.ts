import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import type { RequestHandler } from 'express';

// Rate limiting configuration - optimized for better performance
export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // Increased limit for better user experience
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => {
    // Skip rate limiting for health checks and static assets
    return req.url === '/health' || req.url.startsWith('/static/');
  },
  keyGenerator: req => {
    // Use user ID if authenticated, otherwise IP
    return (req.headers['x-user-id'] as string) || req.ip || 'unknown';
  },
});

// Response time monitoring middleware
export const responseTime = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${duration}ms`);
  });
  next();
};

// Compression configuration
export const compressionConfig: RequestHandler = compression({
  level: 6, // Higher compression level for better performance
  threshold: 512, // Compress responses larger than 512 bytes
  filter: (req, res) => {
    // Skip compression for already compressed content types
    if (req.headers['accept-encoding']?.includes('gzip')) {
      return true;
    }
    // Don't compress small responses
    if (
      res.getHeader('content-length') &&
      parseInt(res.getHeader('content-length') as string) < 512
    ) {
      return false;
    }
    // Skip compression for images and other binary content
    const contentType = res.getHeader('content-type') as string;
    if (
      contentType &&
      (contentType.includes('image/') ||
        contentType.includes('video/') ||
        contentType.includes('audio/') ||
        contentType.includes('application/pdf'))
    ) {
      return false;
    }
    return true;
  },
});

// CORS configuration
export const corsConfig = cors({
  origin:
    process.env.NODE_ENV !== 'production'
      ? 'http://localhost:3000'
      : 'https://www.inventera.pro',
  // origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
});

// Helmet security configuration
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

// Apply all middleware to the app
export const applyMiddleware = (app: express.Application) => {
  app.use(responseTime);
  app.use(limiter);
  app.use(compressionConfig);
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(cookieParser());
  app.use(corsConfig);
  app.options('*', corsConfig);
  app.disable('x-powered-by');
  app.use(helmetConfig);
};
