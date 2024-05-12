import parser from 'body-parser';
import express from 'express';
import fileupload from 'express-fileupload';
import helmet from 'helmet';

import defaultMiddleware from '#middlewares/default.middleware.js';
import { setupErrorInterceptor, setupValidationErrorInterceptor } from '#middlewares/server.middleware.js';
import { createDbConnection } from '#root/mongoConnection.js';
import seedSuperAdmin from '#user/Seed/superadmin.seed.js';
import overrideConsole from '#utils/Logger/console.js';

import registerRoutes from './registerRoutes.js';
// Import { scheduleInit } from "#scheduler/Service/schedulerService.js";

const app = express();

app.use(defaultMiddleware());

overrideConsole();
const conn = await createDbConnection('mongodb+srv://saransh:ysoserious@saransh.jvitvgq.mongodb.net');

if (process.env.PRINT_ENV === 'true') {
  console.debug('======================ENV======================');
  console.debug(process.env);
  console.debug('======================ENV======================');
}

app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use(helmet());
app.use(fileupload());
await registerRoutes(app);

// App.use(defaultMiddleware());

/*
 * Process.env.MULTI_TENANT === 'false' ? console.log('MULTITENANT is turned OFF') : console.log('MULTITENANT is turned ON');
 * process.env.ENCRYPTION === 'true' ? console.log('ENCRYPTION is turned ON') : console.log('ENCRYPTION is turned OFF');
 * process.env.NODE_ENV === 'development' ? console.log('DEVELOPMENT MODE is turned ON') : console.log('DEVELOPMENT MODE is turned OFF');
 */

/*
 * setupCors(app);
 * setupResponseInterceptor(app);
 * setupErrorInterceptor(app);
 * setupTimeout(app);
 * setupRateLimiter(app);
 * morgalApiLogger(app);
 * registerRoutes(app);
 * setupValidationErrorInterceptor(app);
 */
setupValidationErrorInterceptor(app);
setupErrorInterceptor(app);
// setupResponseInterceptor(app);
await seedSuperAdmin(conn);

app.listen(process.env.PORT, () => {
  console.success(`Server started on PORT ${process.env.PORT} PROCESS_ID ${process.pid}`);
  // ScheduleInit();
});
