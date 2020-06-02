import Knex from 'knex';

//TS tipagem do knex: falo qual é o formato da variável e tenho acesso a td inteligencia da ide
export async function up(knex: Knex) {
  return knex.schema.createTable('point_items', table => {
    table.increments('id').primary();
    table.integer('point_id') //td id en pint_id tem q ser um id válido na tabela points
      .notNullable()
      .references('id') //2 no campo ID
      .inTable('points'); //1 onde será criado a chave extrangeira, na tabela: Points
    table.integer('item_id')
      .notNullable()
      .references('id')
      .inTable('items');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('point_items');
}
