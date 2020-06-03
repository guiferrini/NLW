//O ts n sabe o formato de resquest e response entao informo o formato manualmente
import { Request, Response } from 'express'
import knex from '../database/connection'; // Connection witd Database

class PointsController {
  async index(request: Request, response: Response) {
    // Filtro(Query): Cidade, UF, items
    const { city, uf, items } = request.query; //informar o formato qdo receber por query

    const checkItems = String(items)
      .split(',')
      .map(item => Number(item.trim())) //trim: retirar espaços caso tenha

    //Bsca tds os ptos, em q pelo - 1 (whereIn) item q esta dentro do q estou recebendo (checkItems) 
    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', checkItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct() //caso um pto tenha masi d 1 item do filtro, retorna o pto 1 vez só
      .select('points.*'); // quero buscar os dados da tabela points e não da tabela join

    return response.json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

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

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body;
  
    // trx = transaction - ferramenta do knex. 
    //Temos 2 inserts indepententes, se 1 der erro n quero q o outro execute, usar trx no lugar do knex
    //knex/trx('tabela').o será feito - no final, await trx.commit();
    const trx = await knex.transaction()

    const point = {
      image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=60',
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

    await trx.commit(); // esse comento faz o insert na bd
  
  
    return response.json({
      id: point_id,
      ...point, //... tds infos, n so a ultima
    }); 
  }
}

export default PointsController;