import path from 'path';

module.exports = {
  client: 'sqlite3', // nome do BD
  connection: {
    filename: path.resolve(__dirname, 'Backend', 'src', 'database', 'database.sqlite'),
  },
  migrations: { //onde será salvo a migration/tabela
    directory: path.resolve(__dirname, 'Backend', 'src', 'database', 'migrations'),
  },
  seeds: { //onde será salvo a migration/tabela
    directory: path.resolve(__dirname, 'Backend', 'src', 'database', 'seeds'),
  },
  useNullAsDefault: true,
};