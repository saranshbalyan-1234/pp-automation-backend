import parser from 'body-parser';
import express from 'express';
import fileupload from 'express-fileupload';
import helmet from 'helmet';

import defaultMiddleware from '#middlewares/default.middleware.js';
import { setupCors, setupErrorInterceptor, setupRateLimiter, setupResponseInterceptor, setupTimeout, setupValidationErrorInterceptor } from '#middlewares/server.middleware.js';
import { getTenantDB } from '#root/mongo.connection.js';
import seedSuperAdmin from '#user/Seed/superadmin.seed.js';
import morgalApiLogger from '#utils/Logger/api.logger.js';
import overrideConsole from '#utils/Logger/console.logger.js';

import registerRoutes from './registerRoutes.js';
// Import { scheduleInit } from "#scheduler/Service/schedulerService.js";

const app = express();

app.use(defaultMiddleware());

overrideConsole();

await getTenantDB();

if (process.env.PRINT_ENV === 'true') {
  console.debug('======================ENV======================');
  console.debug(process.env);
  console.debug('======================ENV======================');
}

app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use(helmet());
app.use(fileupload());

process.env.MULTI_TENANT === 'false' ? console.log('MULTITENANT is turned OFF') : console.log('MULTITENANT is turned ON');
process.env.ENCRYPTION === 'true' ? console.log('ENCRYPTION is turned ON') : console.log('ENCRYPTION is turned OFF');
process.env.NODE_ENV === 'development' ? console.log('DEVELOPMENT MODE is turned ON') : console.log('DEVELOPMENT MODE is turned OFF');

setupCors(app);
setupTimeout(app);
setupRateLimiter(app);
morgalApiLogger(app);
setupErrorInterceptor(app);
setupResponseInterceptor(app);

await seedSuperAdmin();
await registerRoutes(app);

setupValidationErrorInterceptor(app);

app.listen(process.env.PORT, () => {
  console.success(`Server started on PORT ${process.env.PORT} PROCESS_ID ${process.pid}`);
  // ScheduleInit();
});
