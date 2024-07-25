import express from 'express';
// Swagger
import { createRequire } from 'module';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
const require = createRequire(import.meta.url);
const swaggerFile = require('../swagger.json');
// Swagger

const Router = express.Router();

Router.get('/health', (_req, res) =>
  res.json('Server is Working')
);

Router.use('/swagger', passport.authenticate('basic', { session: false }), swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default Router;
