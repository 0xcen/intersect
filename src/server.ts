require('dotenv').config();
import { app } from './';
import prisma from './prisma';

prisma
  .$connect()
  .then(_ => console.log('Connected to database'))
  .catch(console.error);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
