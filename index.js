import express from "express";
import helmet from "helmet";
import fileupload from "express-fileupload";
import parser from "body-parser";
import { defaultMiddleware } from "#middlewares/default.js";
import { registerRoutes } from "#routes/index.js";
import errorContstants from "#constants/error.js";
import { morgalApiLogger } from "#utils/logger.js";
import { setupTimeout, setupRateLimiter, setupCors, setupResponseInterceptor, setupErrorInterceptor, setupValidationErrorInterceptor } from "#middlewares/server.js";
import { syncDatabase, createSuperAdmin } from "#user/Service/database.js";
// import { scheduleInit } from "#scheduler/Service/schedulerService.js";
const app = express();

if (process.env.PRINT_ENV == "true") {
    console.debug("======================ENV======================");
    console.debug(process.env);
    console.debug("======================ENV======================");
}

app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use(helmet());
app.use(defaultMiddleware());
app.use(fileupload());

process.env.MULTI_TENANT == "false" ? console.log(`MULTITENANT is turned OFF`) : console.log(`MULTITENANT is turned ON`);
process.env.ENCRYPTION == "true" ? console.log(`ENCRYPTION is turned ON`) : console.log(`ENCRYPTION is turned OFF`);
process.env.NODE_ENV == "development" ? console.log(`DEVELOPMENT MODE is turned ON`) : console.log(`DEVELOPMENT MODE is turned OFF`);

setupCors(app);
setupResponseInterceptor(app);
setupErrorInterceptor(app);
setupTimeout(app);
setupRateLimiter(app);
morgalApiLogger(app);
registerRoutes(app);
setupValidationErrorInterceptor(app);

if (process.env.NODE_ENV == "production") {
    await syncDatabase(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME);
    await createSuperAdmin();
}

app.use((req, res) => {
    return res.status(404).json({ error: errorContstants.ENDPOINT_NOT_FOUND });
});
app.listen(process.env.PORT, () => {
    console.success(`Server started on PORT ${process.env.PORT} PROCESS_ID ${process.pid}`);
    // scheduleInit();
});
