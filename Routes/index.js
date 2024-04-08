import { validateToken } from "#middlewares/jwt.js";
import unprotectedRoutes from "./unprotectedRoutes.js";
import protectedRoutes from "./protectedRoutes.js";

const registerUnprotectedRoutes = (app) => {
    unprotectedRoutes.forEach((route) => {
        app.use(route.path, route.list);
    });
};

const registerProtectedRoutes = (app) => {
    app.use(validateToken());
    protectedRoutes.forEach((route) => {
        app.use(route.path, route.list);
    });
};

const registerRoutes = (app) => {
    registerUnprotectedRoutes(app);
    registerProtectedRoutes(app);
    console.success("Routes Registered");
};

export { registerRoutes };
