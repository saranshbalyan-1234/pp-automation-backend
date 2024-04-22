import parser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import fileupload from 'express-fileupload';
import errorContstants from '#constants/error.js';
import { createDbConnection } from '#utils/Database/mongoConnection.js';
import ArticleModel from './Mongo/article.js';


  import defaultMiddleware from '#middlewares/default.js';
  import { setupCors, setupErrorInterceptor, setupRateLimiter, setupResponseInterceptor, setupTimeout, setupValidationErrorInterceptor } from '#middlewares/server.js';
  import registerRoutes from '#routes/index.js';
 import morgalApiLogger from '#utils/Logger/api.js';
  // import { scheduleInit } from "#scheduler/Service/schedulerService.js";
 
const app = express();


  if (process.env.PRINT_ENV === 'true') {
    console.debug('======================ENV======================');
    console.debug(process.env);
    console.debug('======================ENV======================');
  }


app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use(helmet());
app.use(fileupload());
 
// app.use(defaultMiddleware());

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
 

createDbConnection('mongodb+srv://saransh:ysoserious@saransh.jvitvgq.mongodb.net');

app.use('/saransh', async (_req, res) => {
  try {
    const article = new ArticleModel({  name: 'saransh' });
    await article.save();

 
      // const article = await ArticleModel.findOneAndUpdate({ name: 'saransh' }, { name: 'saransh' }, {
      //   new: true
      // });


    return res.status(200).json(article);
  } catch (err) {
    return res.status(200).json(err);
  }
}
);

app.use((_req, res) => res.status(404).json({ error: errorContstants.ENDPOINT_NOT_FOUND }));

app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT ${process.env.PORT} PROCESS_ID ${process.pid}`);
  // ScheduleInit();
});
