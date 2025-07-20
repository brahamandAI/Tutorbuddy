import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { getSocketIO } from './src/lib/socket';
import { WebSocketServer } from 'ws';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3001', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      // Handle Next.js HMR endpoint
      if (req.url?.startsWith('/_next/webpack-hmr')) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        });
        return;
      }

      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Initialize WebSocket server for HMR
  const wss = new WebSocketServer({ server, path: '/_next/webpack-hmr' });
  
  wss.on('connection', (ws) => {
    console.log('HMR WebSocket connected');
    
    ws.on('error', console.error);
    
    ws.on('close', () => {
      console.log('HMR WebSocket disconnected');
    });
  });

  // Initialize Socket.IO
  getSocketIO(server);

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}); 