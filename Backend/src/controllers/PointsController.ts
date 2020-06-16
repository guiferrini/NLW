//O ts n sabe o formato de resquest e response entao informo o formato manualmente
import { Request, Response } from 'express'
import knex from '../database/connection'; // Connection witd Database

class PointsController {
  async update(request: Request, response: Response) {
    const { id } = request.params;
    
    const { email, whatsapp } = request.body;

    knex('points')
      .where({id}) 
      .update({ email, whatsapp })
      .then(u => response.status(!!u?200:404).json({success:!!u}))
      .catch(e => response.status(500).json(e));
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    
    await knex('points').where('id', id).delete();

    return response.status(204).send();
}
  async index(request: Request, response: Response) {
    // Filtro(Query): Cidade, UF, items
    const { city, uf, items} = request.query; //informar o formato qdo receber por query

    //inclui no filtro: items
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
      .select('points.*', 'point_items.item_id') // retorna id point c item id)

      const serializedPoints = points.map(point => {
        return {
          ...point,
          image_url: `http://localhost:3333/uploads/${point.image}`,
        };
      });

    return response.json(serializedPoints);  
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    // na tabela 'points', where id for = {id}, eu quero buscar o 1° e unico (id é único)
    const point = await knex('points').where('id', id).first();

    // se n encontrei nenhum id, retorna erro
    if (!point) {
      return response.status(400).json({ message: 'Point not found.' })
    }

    const serializedPoint = {
        ...point,
        image_url: `http://localhost:3333/uploads/${point.image}`,
      };

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
      .select('items.*')

    return response.json({ point: serializedPoint, items });
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
      image: request.file.filename,
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
    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
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