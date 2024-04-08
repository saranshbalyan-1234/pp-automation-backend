import authRoutes from "#user/Routes/authRoutes.js";
import rootRoutes from "#routes/rootRoutes.js";
import aesRoutes from "#encryption/Routes/aes.routes.js";
import passportRoutes from "#user/Routes/passport.js";
const unprotectedRoutes = [
    { path: "/auth", list: authRoutes },
    { path: "/", list: rootRoutes },
    { path: "/encryption/aes", list: aesRoutes },
    { path: "/auth", list: passportRoutes },
];

export default unprotectedRoutes;
