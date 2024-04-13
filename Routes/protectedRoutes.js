import projectRoutes from '#project/Routes/projectRoutes.js';
import constantRoutes from '#root/Routes/constantRoutes.js';
import dashboardRoutes from '#routes/dashboardRoutes.js';
import storageRoutes from '#storage/Routes/awsRoutes.js';
import environmentRoutes from '#testcase/Routes/environment.js';
import executionHistoryRoutes from '#testcase/Routes/executionHistory.js';
import executionSuiteRoutes from '#testcase/Routes/executionSuiteRoutes.js';
import machineRoutes from '#testcase/Routes/machineRoutes.js';
import objectRoutes from '#testcase/Routes/object.js';
import reusableProcessRoutes from '#testcase/Routes/reusableProcess.js';
import testCaseRoutes from '#testcase/Routes/testCase.js';
import testStepRoutes from '#testcase/Routes/testStepRoutes.js';
import roleRoutes from '#user/Routes/roleRoutes.js';
import superAdminRoutes from '#user/Routes/superAdminRoutes.js';
import userRoutes from '#user/Routes/userRoutes.js';
// Import schedulerRoutes from "#scheduler/Routes/schedulerRoutes.js";

const protectedRoutes = [
  { list: constantRoutes, path: '/constant' },
  // { path: "/scheduler", list: schedulerRoutes },
  { list: userRoutes, path: '/user' },
  { list: superAdminRoutes, path: '/super-admin' },
  { list: roleRoutes, path: '/role' },
  { list: projectRoutes, path: '/project' },
  { list: dashboardRoutes, path: '/dashboard' },
  { list: storageRoutes, path: '/storage' },
  { list: testCaseRoutes, path: '/testcase' },
  { list: objectRoutes, path: '/object' },
  { list: testStepRoutes, path: '/teststep' },
  { list: reusableProcessRoutes, path: '/reusableProcess' },
  { list: executionHistoryRoutes, path: '/executionHistory' },
  { list: environmentRoutes, path: '/environment' },
  { list: machineRoutes, path: '/machines' },
  { list: executionSuiteRoutes, path: '/execution-suite' }
];

export default protectedRoutes;
