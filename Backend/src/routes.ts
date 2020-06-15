import express, { response, request } from 'express';
import { celebrate, Joi } from 'celebrate';

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
routes.get('/points', pointsController.index); //busca filtrada por: uf, city, items
routes.get('/points/:id', pointsController.show);
routes.delete('/points/:id', pointsController.delete);

routes.post(
  '/points', 
  upload.single('image'), //upload.1 unico arquivo('nome q recebe')
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(3).max(40).required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required(), 
    })
  }, {
    abortEarly: false 
  }),
  pointsController.create
); 

export default routes;