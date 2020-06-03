//O ts n sabe o formato de resquest e response entao informo o formato manualmente
import { Request, Response } from 'express'
import knex from '../database/connection';

class PointsController {
  async create(resquest: Request, response: Response) {
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
  
    // trx = transaction - ferramenta do knex. 
    //Temos 2 inserts indepententes, se 1 der erro n quero q o outro execute, usar trx no lugar do knex
    //knex/trx('tabela').o será feito
    const trx = await knex.transaction()

    const point = {
      image: 'imagem-fake-p n ficar vazio',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    }
  
    const idNewPoint = await trx('points').insert(point);
    const point_id = idNewPoint[0];
   
    //relacionamento com a tabela de Items
    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });
  
    await trx('point_items').insert(pointItems);
  
  
    return response.json({
      id: point_id,
      ...point, //... tds infos, n so a ultima
    }); 
  }
}

export default PointsController;