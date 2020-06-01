import express from 'express';

const app = express();
const PORT = 3333;

app.get('/', (request, response) => {
  console.log('Server Connected');
  //response.send('Texto Simples'); String
  //response.json({message: 'Hello World'}); Objeto, informação única
  response.json([ //Array, lista de informações
    'Gui',
    'joão',
    'David',
    'Carlos',
    'zé',
    'Su',
  ]);
});

app.listen(PORT);