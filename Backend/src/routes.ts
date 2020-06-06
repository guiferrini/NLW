import express, { response, request } from 'express';

import multer from 'multer'; //biblioteca de upload
import multerConfig from './config/multer'; //configurações da biblioteca

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController(); //criação da intancia da class
const itemsController = new ItemsController(); // instanciando a claa

routes.get('/items', itemsController.index); 

//routes.post('/points', td q esta em pointsController.ts);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post('/points', upload.single('image') ,pointsController.create); //upload.1 unico arquivo('nome q recebe')

export default routes;