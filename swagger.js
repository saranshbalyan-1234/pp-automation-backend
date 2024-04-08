import swaggerAutogen from "swagger-autogen";

swaggerAutogen();

const outputFile = "./swagger.json";

const endpointsFiles = [
    "./User/Routes/authRoutes.js",
    "./User/Routes/userRoutes.js",
    "./User/Routes/roleRoutes.js",
    "./User/Routes/superAdminRoutes.js",

    "./Routes/constantRoutes.js",
    "./Routes/dashboardRoutes.js",

    "./Project/Routes/projectRoutes.js",

    "./Storage/Routes/awsRoutes.js",

    "./TestCase/Routes/testCase.js",
    "./TestCase/Routes/testStepRoutes.js",
    "./TestCase/Routes/object.js",
    "./TestCase/Routes/reusableProcess.js",
    "./TestCase/Routes/environment.js",
    "./TestCase/Routes/executionHistory.js",
    "./TestCase/Routes/executionSuiteRoutes.js",
    "./TestCase/Routes/machineRoutes.js",

    "./Scheduler/Routes/schedulerRoutes.js",
];

const doc = {
    info: {
        version: "1.0.0",
        title: "Automation Api Structure",
        description: "Automateum",
    },
    host: "localhost:3001",
    basePath: "/",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
        apiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
            description: "Enter your Bearer Token",
        },
    },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
