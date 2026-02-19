import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

// Get port from command line arguments or environment
export function getPortFromArgs(): number | null {
  const portArg = process.argv.find(arg => arg.startsWith('--port='));
  if (portArg) {
    return parseInt(portArg.split('=')[1]);
  }
  return null;
}

export const port = getPortFromArgs() || parseInt(process.env.PORT || '7001');

// Create Express app
export const createExpressApp = (): express.Application => {
  const app = express();

  // Set view engine to EJS
  app.set('view engine', 'ejs');

  // Set views directory (dist path)
  app.set('views', path.join(__dirname, '..', 'utils', 'email'));

  return app;
};

export const createHttpServer = (app: express.Application) =>
  http.createServer(app);

// Start server
export const startServer = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
  port: number | string
) => {
  server.listen(port, () => {
    if (process.env.NODE_ENV === 'production') {
      console.log(`Server is running on production`);
    } else {
      console.log(`Server is running at http://localhost:${port}`);
    }
  });
};
