import express from 'express';
import knex from './database/connection'; // Connection witd Database

const routes = express.Router();

routes.get('/items', async (request, response) => {
  const items = await knex('items').select('*'); //ele necesita tempo p regressar a info, entao await
  // é igual: SELECT * FROM items

  //Processo de transformar/tradução da informações -> Serialização
  const serializedItems = items.map(item => {
    return {
      title: item.title,
      image_url: `http://localhost:3333/uploads/${item.image}`,
    }
  });

  return response.json(serializedItems);
}); 

export default routes;