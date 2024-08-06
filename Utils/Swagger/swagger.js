import swaggerAutogen from 'swagger-autogen';

import { getDirectories } from '#utils/file.js';
swaggerAutogen();

const protectedRoutes = getDirectories('.', 'protected.routes');
const unprotectedRoutes = getDirectories('.', 'unprotected.routes');

console.debug(protectedRoutes, unprotectedRoutes);

const outputFile = './swagger.json';

const endpointsFiles = [...protectedRoutes, ...unprotectedRoutes];

const doc = {
  basePath: '/',
  consumes: ['application/json'],
  host: 'localhost:3001',
  info: {
    description: 'Node | Express | Mongo | Multi Tenant | Social Login',
    title: 'Starter Package',
    version: '1.0.0'
  },
  produces: ['application/json'],
  schemes: ['http', 'https'],
  securityDefinitions: {
    apiKeyAuth: {
      description: 'Enter your Bearer Token',
      in: 'header',
      name: 'Authorization',
      type: 'apiKey'
    }
  }
};

swaggerAutogen(outputFile, endpointsFiles, doc);
