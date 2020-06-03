import express, { response, request } from 'express';
import knex from './database/connection'; // Connection witd Database

const routes = express.Router();

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

routes.post('/points', async (resquest, response) => {
  const {
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    items
  } = resquest.body;

  //knex('tabela').o será feito
  const ids = await knex('points').insert({
    image: 'imagem-fake-p n ficar vazio',
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf
  });

  //relacionamento com a tabela de Items
  const pointItems = items.map((item_id: number) => {
    return {
      item_id,
      point_id: ids[0],
    };
  });

  await knex('point_items').insert(pointItems);


  return response.json({ success: 'true' });
});

export default routes;