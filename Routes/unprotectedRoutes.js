import aesRoutes from '#encryption/Routes/aes.routes.js';
import authRoutes from '#user/Routes/authRoutes.js';
import passportRoutes from '#user/Routes/passport.js';
import rootRoutes from '#routes/rootRoutes.js';
const unprotectedRoutes = [
  { list: authRoutes, path: '/auth' },
  { list: rootRoutes, path: '/' },
  { list: aesRoutes, path: '/encryption/aes' },
  { list: passportRoutes, path: '/auth' }
];

export default unprotectedRoutes;
