import express, { request, response } from 'express';

const app = express();
app.use(express.json());
const PORT = 3333;

const users = [
  'Gui',
  'joão',
  'David',
]

app.get('/users', (request, response) => {
  console.log('Server Connected');
  //response.send('Texto Simples'); String
  //response.json({message: 'Hello World'}); Objeto, informação única
  //Array, lista de informações (['gui', 'joao', 'ze'])
  return response.json(users);
});

app.get('/users/:id', (request, response) => {
  const id = Number(request.params.id);
  const user = users[id];

  return response.json(user);
});

app.post('/users', (request, response) => {
  const data = request.body;

  const User = {
    name: data.name,
    email: data.email,
  }
  /**
   * Insomnia
   * {
	    "name": "gui",
	    "email": "gui@gmail.com"
      }
   */

  return response.json(User);
});

app.listen(PORT, () => {
  console.log('Server connected ✅');
});