"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddleware = exports.helmetConfig = exports.corsConfig = exports.compressionConfig = exports.responseTime = exports.limiter = void 0;
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Rate limiting configuration - optimized for better performance
exports.limiter = (0, express_rate_limit_1.default)({
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
        return req.headers['x-user-id'] || req.ip || 'unknown';
    },
});
// Response time monitoring middleware
const responseTime = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${duration}ms`);
    });
    next();
};
exports.responseTime = responseTime;
// Compression configuration
exports.compressionConfig = (0, compression_1.default)({
    level: 6, // Higher compression level for better performance
    threshold: 512, // Compress responses larger than 512 bytes
    filter: (req, res) => {
        // Skip compression for already compressed content types
        if (req.headers['accept-encoding']?.includes('gzip')) {
            return true;
        }
        // Don't compress small responses
        if (res.getHeader('content-length') &&
            parseInt(res.getHeader('content-length')) < 512) {
            return false;
        }
        // Skip compression for images and other binary content
        const contentType = res.getHeader('content-type');
        if (contentType &&
            (contentType.includes('image/') ||
                contentType.includes('video/') ||
                contentType.includes('audio/') ||
                contentType.includes('application/pdf'))) {
            return false;
        }
        return true;
    },
});
// CORS configuration
exports.corsConfig = (0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
});
// Helmet security configuration
exports.helmetConfig = (0, helmet_1.default)({
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
const applyMiddleware = (app) => {
    app.use(exports.responseTime);
    app.use(exports.limiter);
    app.use(exports.compressionConfig);
    app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
    app.use(body_parser_1.default.json({ limit: '50mb' }));
    app.use((0, cookie_parser_1.default)());
    app.use(exports.corsConfig);
    app.options('*', exports.corsConfig);
    app.disable('x-powered-by');
    app.use(exports.helmetConfig);
};
exports.applyMiddleware = applyMiddleware;
//# sourceMappingURL=global.middleware.js.map