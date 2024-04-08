import userRoutes from "#user/Routes/userRoutes.js";
import superAdminRoutes from "#user/Routes/superAdminRoutes.js";
import roleRoutes from "#user/Routes/roleRoutes.js";
import projectRoutes from "#project/Routes/projectRoutes.js";
import testCaseRoutes from "#testcase/Routes/testCase.js";
import objectRoutes from "#testcase/Routes/object.js";
import testStepRoutes from "#testcase/Routes/testStepRoutes.js";
import reusableProcessRoutes from "#testcase/Routes/reusableProcess.js";
import executionHistoryRoutes from "#testcase/Routes/executionHistory.js";
import executionSuiteRoutes from "#testcase/Routes/executionSuiteRoutes.js";
import environmentRoutes from "#testcase/Routes/environment.js";
import storageRoutes from "#storage/Routes/awsRoutes.js";
import machineRoutes from "#testcase/Routes/machineRoutes.js";
import dashboardRoutes from "#routes/dashboardRoutes.js";
import constantRoutes from "#root/Routes/constantRoutes.js";
// import schedulerRoutes from "#scheduler/Routes/schedulerRoutes.js";

const protectedRoutes = [
    { path: "/constant", list: constantRoutes },
    // { path: "/scheduler", list: schedulerRoutes },
    { path: "/user", list: userRoutes },
    { path: "/super-admin", list: superAdminRoutes },
    { path: "/role", list: roleRoutes },
    { path: "/project", list: projectRoutes },
    { path: "/dashboard", list: dashboardRoutes },
    { path: "/storage", list: storageRoutes },
    { path: "/testcase", list: testCaseRoutes },
    { path: "/object", list: objectRoutes },
    { path: "/teststep", list: testStepRoutes },
    { path: "/reusableProcess", list: reusableProcessRoutes },
    { path: "/executionHistory", list: executionHistoryRoutes },
    { path: "/environment", list: environmentRoutes },
    { path: "/machines", list: machineRoutes },
    { path: "/execution-suite", list: executionSuiteRoutes },
];

export default protectedRoutes;
