import express, { Request, Response } from 'express';
import addressesRoutes from './routes/addressesRoutes';
import rpcRoutes from './routes/rpcRoutes';
import transactionsRoutes from './routes/transactionsRoutes';
import webhooksRoutes from './routes/webhooksRoutes';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api/v1/addresses', addressesRoutes);
app.use('/api/v1/transactions', transactionsRoutes);
app.use('/api/v1/webhooks', webhooksRoutes);
app.use('/api/v1/rpc', rpcRoutes);

app.get('*', (req: Request, res: Response) => {
  res.status(404).send('404 - Page Not Found');
});

export { app };
