import express from 'express';
import passport from 'passport'
// Swagger
import { createRequire } from 'module';
import swaggerUi from 'swagger-ui-express';
const require = createRequire(import.meta.url);
const swaggerFile = require('../swagger.json');
// Swagger

const Router = express.Router();

Router.get('/health', (_req, res) =>
  /*  #swagger.tags = ["Health"] */
  res.json('Server is Working')
);

Router.use('/swagger',  passport.authenticate('basic', { session: false }),swaggerUi.serve, swaggerUi.setup(swaggerFile));

Router.get('/favico.ico', (_req, res) => {
  res.sendStatus(204);
});

export default Router;
