import express, { Request, Response } from 'express';
import addressesRoutes from './routes/addressesRoutes';
import messagesRoutes from './routes/messagesRoutes';
import rpcRoutes from './routes/rpcRoutes';
import transactionsRoutes from './routes/transactionsRoutes';
import userRoutes from './routes/userRoutes';
import webhooksRoutes from './routes/webhooksRoutes';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json('Hello world!');
});
app.use('/api/v1/rpc', rpcRoutes);

app.use('/api/v1/addresses', addressesRoutes);
app.use('/api/v1/transactions', transactionsRoutes);
app.use('/api/v1/webhooks', webhooksRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/dialect', messagesRoutes);
app.use('/api/v1/me', (req: Request, res: Response) => {
  return res.json('ok');
});

app.get('*', (req: Request, res: Response) => {
  console.log(req.path);

  res.status(404).json('here');
});

export { app };
