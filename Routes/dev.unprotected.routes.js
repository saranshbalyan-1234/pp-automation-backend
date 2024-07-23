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
  /*  #swagger.tags = ["Dev"] */
  res.json('Server is Working')
);

Router.use('/swagger',passport.authenticate('basic', { session: false }),swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default Router;
