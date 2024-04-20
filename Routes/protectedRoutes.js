import projectRoutes from '#project/Routes/projectRoutes.js';
import constantRoutes from '#root/Routes/constantRoutes.js';
import dashboardRoutes from '#routes/dashboardRoutes.js';
import storageRoutes from '#storage/Routes/awsRoutes.js';
import roleRoutes from '#user/Routes/roleRoutes.js';
import superAdminRoutes from '#user/Routes/superAdminRoutes.js';
import userRoutes from '#user/Routes/userRoutes.js';
/*
 * Import jobManagerRoutes from "#scheduler/Routes/jobManagerRoutes.js";
 * Import jobRoutes from "#scheduler/Routes/jobRoutes.js";
 */

const protectedRoutes = [
  { list: constantRoutes, path: '/constant' },
  { list: userRoutes, path: '/user' },
  { list: superAdminRoutes, path: '/super-admin' },
  { list: roleRoutes, path: '/role' },
  { list: projectRoutes, path: '/project' },
  { list: dashboardRoutes, path: '/dashboard' },
  { list: storageRoutes, path: '/storage' }
  /*
   * { path: "/scheduler/job-manager", list: jobManagerRoutes },
   * { path: "/scheduler/job", list: jobRoutes },
   */
];

export default protectedRoutes;
