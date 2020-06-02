import knex from 'knex';
import path from 'path'; // p lidar com caminhos, rotas
// path.resolve: a função uni caminhos
// __dirname: retorna o diretorio do arquivo q estamos executando a variável, neste caso 'database'

const connection = {
  client: 'sqlite3', // nome do BD
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite'), //1° local, 2° nome
  }
}

export default connection;