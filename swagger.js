import swaggerAutogen from 'swagger-autogen';

swaggerAutogen();

const outputFile = './swagger.json';

const endpointsFiles = [
  './User/Routes/authRoutes.js',
  './User/Routes/userRoutes.js',
  './User/Routes/roleRoutes.js',
  './User/Routes/superAdminRoutes.js',

  './Routes/constantRoutes.js',
  './Routes/dashboardRoutes.js',

  './Project/Routes/projectRoutes.js',

  './Storage/Routes/awsRoutes.js',

  './Scheduler/Routes/schedulerRoutes.js'
];

const doc = {
  basePath: '/',
  consumes: ['application/json'],
  host: 'localhost:3001',
  info: {
    description: 'Automateum',
    title: 'Automation Api Structure',
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
