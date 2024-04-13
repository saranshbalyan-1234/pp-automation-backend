import { defaultMiddleware } from '#middlewares/default.js';
import { morgalApiLogger } from '#utils/logger.js';
import { registerRoutes } from '#routes/index.js';
import { setupCors, setupErrorInterceptor, setupRateLimiter, setupResponseInterceptor, setupTimeout, setupValidationErrorInterceptor } from '#middlewares/server.js';
import { syncDatabase } from '#user/Service/database.js';
import errorContstants from '#constants/error.js';
import express from 'express';
import fileupload from 'express-fileupload';
import helmet from 'helmet';
import parser from 'body-parser';
// Import { scheduleInit } from "#scheduler/Service/schedulerService.js";
const app = express();

if (process.env.PRINT_ENV === 'true') {
  console.debug('======================ENV======================');
  console.debug(process.env);
  console.debug('======================ENV======================');
}

console.log(a);
console.log('safa ');
console;
function process () { }

app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use(helmet());
app.use(defaultMiddleware());
app.use(fileupload());

process.env.MULTI_TENANT === 'false' ? console.log('MULTITENANT is turned OFF') : console.log('MULTITENANT is turned ON');
process.env.ENCRYPTION === 'true' ? console.log('ENCRYPTION is turned ON') : console.log('ENCRYPTION is turned OFF');
process.env.NODE_ENV === 'development' ? console.log('DEVELOPMENT MODE is turned ON') : console.log('DEVELOPMENT MODE is turned OFF');

setupCors(app);
setupResponseInterceptor(app);
setupErrorInterceptor(app);
setupTimeout(app);
setupRateLimiter(app);
morgalApiLogger(app);
registerRoutes(app);
setupValidationErrorInterceptor(app);

if (process.env.NODE_ENV === 'production') {
  syncDatabase(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME);
}

app.use((req, res) => res.status(404).json({ error: errorContstants.ENDPOINT_NOT_FOUND }));
app.listen(process.env.PORT, () => {
  console.success(`Server started on PORT ${process.env.PORT} PROCESS_ID ${process.pid}`);
  // ScheduleInit();
});
