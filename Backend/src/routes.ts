import express, { response, request } from 'express';
import knex from './database/connection'; // Connection witd Database

import PointsController from './controllers/pointsController';

const routes = express.Router();
const pointsController = new PointsController(); //criação da intancia da class

routes.get('/items', async (request, response) => {
  const items = await knex('items').select('*'); //ele necesita tempo p regressar a info, entao await
  // é igual: SELECT * FROM items

  //Processo de transformar/tradução da informações -> Serialização
  const serializedItems = items.map(item => {
    return {
      id: item.id,
      title: item.title,
      image_url: `http://localhost:3333/uploads/${item.image}`,   
    }
  }); 

  return response.json(serializedItems);
}); 

//routes.post('/points', td q esta em pointsController.ts);
routes.post('/points', pointsController.create);

export default routes;