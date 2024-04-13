import aesRoutes from '#encryption/Routes/aes.routes.js';
import rootRoutes from '#routes/rootRoutes.js';
import authRoutes from '#user/Routes/authRoutes.js';
import passportRoutes from '#user/Routes/passport.js';
const unprotectedRoutes = [
  { list: authRoutes, path: '/auth' },
  { list: rootRoutes, path: '/' },
  { list: aesRoutes, path: '/encryption/aes' },
  { list: passportRoutes, path: '/auth' }
];

export default unprotectedRoutes;
