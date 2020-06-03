import express, { response, request } from 'express';

import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsController';

const routes = express.Router();
const pointsController = new PointsController(); //criação da intancia da class
const itemsController = new ItemsController(); // instanciando a claa

routes.get('/items', itemsController.index); 

//routes.post('/points', td q esta em pointsController.ts);
routes.post('/points', pointsController.create);

export default routes;