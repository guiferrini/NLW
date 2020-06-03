import express, { request, response } from 'express';

import routes from './routes';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3333;

app.use(cors({
  //origin: 'www....'
}));
app.use(express.json());

app.use(routes);   

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(PORT, () => {
  console.log('Server connected ✅');
});