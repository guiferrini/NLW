import express from 'express';

const routes = express.Router();

routes.get('/', (request, response) => {
  return response.json({ messege: "Hello World" });
});

export default routes;