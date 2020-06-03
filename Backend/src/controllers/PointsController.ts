//O ts n sabe o formato de resquest e response entao informo o formato manualmente
import { Request, Response } from 'express'
import knex from '../database/connection'; // Connection witd Database

class PointsController {
  async show(resquest: Request, response: Response) {
    const { id } = resquest.params;

    // na tabela 'points', where id for = {id}, eu quero buscar o 1° e unico (id é único)
    const point = await knex('points').where('id', id).first();

    // se n encontrei nenhum id, retorna erro
    if (!point) {
      return response.status(400).json({ message: 'Point not found.' })
    }

    /**
     retornando tds items q estão relacionados com os Pontos
     listando tds os items q tem relação com esse pto de coleta
     quero fazer um join na tabela (point_items) onde id do meu item (item_id) seja = point_items.item_id, seja = id q recebo em cima
    
     * SELECT *   FROM items
     *   JOIN point_items ON items.id = point_items.item.id
     *  WHERE point_items.point_id = { id }
     */
    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')

    return response.json({ point, items });
  }

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