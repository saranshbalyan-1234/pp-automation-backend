import { Sequelize, DataTypes } from "sequelize";
import paginate from "#utils/pagination.js";
import mysql from "mysql";
//Main
import Customer from "#user/Models/Customer.js";
import Unverified from "#user/Models/Unverified.js";

//Tenant
import Role from "#user/Models/RolePermission/Role.js";
import Permission from "#user/Models/RolePermission/Permission.js";
import User from "#user/Models/User.js";
import UserRole from "#user/Models/RolePermission/UserRole.js";
import Project from "#project/Models/Project.js";
import UserProject from "#project/Models/UserProject.js";
import Machine from "#testcase/Models/Machine.js";

//TestCase
import TestCase from "#testcase/Models/TestCase.js";
import TestParameter from "#testcase/Models/TestParameter.js";
import TestStep from "#testcase/Models/TestStep.js";
import Process from "#testcase/Models/Process.js";
import ReusableProcess from "#testcase/Models/ReusableProcess.js";
import ReusableProcessLog from "#testcase/Models/ReusableProcessLog.js";
import TestCaseLog from "#testcase/Models/TestCaseLog.js";

//Object
import Object from "#testcase/Models/Object/Object.js";
import ObjectLocator from "#testcase/Models/Object/ObjectLocator.js";
import ObjectLog from "#testcase/Models/Object/ObjectLog.js";

//Execution History
import ExecutionHistory from "#testcase/Models/ExecutionHistory/ExecutionHistory.js";
import ProcessHistory from "#testcase/Models/ExecutionHistory/ProcessHistory.js";
import TestStepHistory from "#testcase/Models/ExecutionHistory/TestStepHistory.js";

//Environment
import Environment from "#testcase/Models/Environment/Environment.js";
import Column from "#testcase/Models/Environment/Column.js";

//Execution Suite
import ExecutionSuite from "#testcase/Models/TestExecution/ExecutionSuite.js";
import TestCaseExecutionMapping from "#testcase/Models/TestExecution/TestCaseExecutionMapping.js";

//Scheduler
import Job from "#scheduler/Models/job.js";
import JobManager from "#scheduler/Models/JobManager.js";

import { overrideConsole } from "#utils/logger.js";

overrideConsole();

const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
});
await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE_PREFIX + process.env.DATABASE_NAME}\`;`);

const sequelize = await createDBConnection({
    db: process.env.DATABASE_PREFIX + process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: "mysql",
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sequelize.dialect.supports.schemas = true;

db.customers = Customer(sequelize, DataTypes);
db.unverifieds = Unverified(sequelize, DataTypes);

db.users = User(sequelize, DataTypes);

db.roles = Role(sequelize, DataTypes);
db.userRoles = UserRole(sequelize, DataTypes);
db.permissions = Permission(sequelize, DataTypes);

db.projects = Project(sequelize, DataTypes);
db.userProjects = UserProject(sequelize, DataTypes);

db.testCases = TestCase(sequelize, DataTypes);
db.testCaseLogs = TestCaseLog(sequelize, DataTypes);

db.reusableProcess = ReusableProcess(sequelize, DataTypes);
db.reusableProcessLogs = ReusableProcessLog(sequelize, DataTypes);

db.process = Process(sequelize, DataTypes);

db.objects = Object(sequelize, DataTypes);
db.ObjectLocators = ObjectLocator(sequelize, DataTypes);
db.objectLogs = ObjectLog(sequelize, DataTypes);

db.testSteps = TestStep(sequelize, DataTypes);
db.testParameters = TestParameter(sequelize, DataTypes);

db.executionHistory = ExecutionHistory(sequelize, DataTypes);
db.processHistory = ProcessHistory(sequelize, DataTypes);
db.testStepHistory = TestStepHistory(sequelize, DataTypes);

db.enviroments = Environment(sequelize, DataTypes);
db.columns = Column(sequelize, DataTypes);

db.executionSuites = ExecutionSuite(sequelize, DataTypes);
db.testCaseExecutionMappings = TestCaseExecutionMapping(sequelize, DataTypes);

db.jobs = Job(sequelize, DataTypes);
db.jobManagers = JobManager(sequelize, DataTypes);

db.machines = Machine(sequelize, DataTypes); //all associations

db.customers.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).sync({ force: false, alter: true });
db.unverifieds.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).sync({ force: false, alter: true });
// console.log("Updaing Schema")
// db.jobs
//   .schema("automation_master")
//   .sync({ force: true, alter: true })
// db.jobManagers
//   .schema("automation_master")
//   .sync({ force: true, alter: true })


// await db.scheduler.schema("automation_").sync({ alter: true, });
customModelMethods(db.sequelize.models);

export default db;

async function createDBConnection(data) {
    try {
        // console.log("Connection Details: ")
        // console.log(connectionData)
        const { host, port, dialect, user, password, db } = data;

        if ((!host || !port || !dialect || user, !password || !db)) throw new Error("Insuffiecient Connection Details");
        const sequelize = new Sequelize(db, user, password, {
            host,
            dialect,
            port,
            logging: false,
            dialectOptions: {
                ssl: {
                    require: true, // This will help you. But you will see nwe error
                    rejectUnauthorized: false, // This line will fix new error
                },
            },
            pool: {
                max: 50,
                min: 1,
                acquire: 60000,
                idle: 10000,
                evict: 10000,
            },
        });

        await sequelize
            .authenticate()
            .then(() => {
                console.success(`Database Connected: ${dialect} => ${host}:${port}`);
            })
            .catch((err) => {
                console.error("Sequalize Error");
                console.log(data);
                console.error(err);
            });

        return sequelize;
    } catch (err) {
        console.error(err);
    }
}
function customModelMethods(models) {
    for (const modelName in models) {
        const model = models[modelName];
        paginate(model);
    }
}
