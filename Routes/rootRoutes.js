import express from 'express';
// Swagger
import { createRequire } from 'module';
import swaggerUi from 'swagger-ui-express';
const require = createRequire(import.meta.url);
const swaggerFile = require('../swagger.json');
// Swagger

const Router = express.Router();

Router.get('/health', (req, res) =>
  /*  #swagger.tags = ["Health"] */
  res.json('Server is Working')
);

Router.use('/swagger', swaggerUi.serve);
Router.get('/swagger', swaggerUi.setup(swaggerFile));

Router.get('/favico.ico', (req, res) => {
  res.sendStatus(204);
});

export default Router;
