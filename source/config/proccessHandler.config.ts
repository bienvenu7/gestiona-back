// Configure process event handlers
export const configureProcessHandlers = () => {
  // Graceful shutdown handlers
  process.once('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    console.log('Server closed');
    process.exit(0);
  });

  process.once('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    console.log('Server closed');
    process.exit(0);
  });

  // Uncaught Exception handler
  process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err.message);
    console.error(err.stack);
    process.exit(1);
  });

  // Unhandled Promise Rejection handler
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
};
