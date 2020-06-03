import { Request, Response } from 'express';
import knex from '../database/connection'; // Connection witd Database

class ItemsController {
  async index(request: Request, response: Response) {
    const items = await knex('items').select('*'); //ele necesita tempo p regressar a info, entao await
    // é igual: SELECT * FROM items
  
    //Processo de transformar/tradução da informações -> Serialização
    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://localhost:3333/uploads/${item.image}`,   
      }; 
    }); 

    return response.json(serializedItems);
  }
}

export default ItemsController;