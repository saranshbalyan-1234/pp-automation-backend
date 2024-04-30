import { validateToken } from '#middlewares/jwt.js';
import { getDirectories } from '#utils/file.js';

const getRoutes = (app, type) => {
  getDirectories('.', type, (err, res) => {
    if (err) {
      console.e('Error', err);
    } else {
      res.forEach(async element => {

        const route = await import(element);
        const defaultFile = route.default;
        const tempAr = element.split('.');
        const tempAr1 = tempAr[tempAr.length - 4].split('/');
        const name = tempAr1[tempAr1.length - 1];
        app.use(name, defaultFile);
        
      });
    }
  });
};

const registerUnprotectedRoutes = (app) => {
  getRoutes(app, 'unprotected.routes');
};

const registerProtectedRoutes = (app) => {
  app.use(validateToken());

  getRoutes(app, 'protected.routes');
};

const registerRoutes = (app) => {
  registerUnprotectedRoutes(app);
  registerProtectedRoutes(app);

  console.success('Routes Registered');
};

export default registerRoutes;
