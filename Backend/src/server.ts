import express, { request, response } from 'express';

import routes from './routes';
import path from 'path';

const app = express();
app.use(express.json());

const PORT = 3333;

app.use(routes);   

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(PORT, () => {
  console.log('Server connected ✅');
});