import { DataTypes, Sequelize } from 'sequelize';
import mysql from 'mysql';
import paginate from '#utils/pagination.js';
// Main
import Customer from '#user/Models/Customer.js';
import Unverified from '#user/Models/Unverified.js';

// Tenant
import Machine from '#testcase/Models/Machine.js';
import Permission from '#user/Models/RolePermission/Permission.js';
import Project from '#project/Models/Project.js';
import Role from '#user/Models/RolePermission/Role.js';
import User from '#user/Models/User.js';
import UserProject from '#project/Models/UserProject.js';
import UserRole from '#user/Models/RolePermission/UserRole.js';

// TestCase
import Process from '#testcase/Models/Process.js';
import ReusableProcess from '#testcase/Models/ReusableProcess.js';
import ReusableProcessLog from '#testcase/Models/ReusableProcessLog.js';
import TestCase from '#testcase/Models/TestCase.js';
import TestCaseLog from '#testcase/Models/TestCaseLog.js';
import TestParameter from '#testcase/Models/TestParameter.js';
import TestStep from '#testcase/Models/TestStep.js';

// Object
import Object from '#testcase/Models/Object/Object.js';
import ObjectLocator from '#testcase/Models/Object/ObjectLocator.js';
import ObjectLog from '#testcase/Models/Object/ObjectLog.js';

// Execution History
import ExecutionHistory from '#testcase/Models/ExecutionHistory/ExecutionHistory.js';
import ProcessHistory from '#testcase/Models/ExecutionHistory/ProcessHistory.js';
import TestStepHistory from '#testcase/Models/ExecutionHistory/TestStepHistory.js';

// Environment
import Column from '#testcase/Models/Environment/Column.js';
import Environment from '#testcase/Models/Environment/Environment.js';

// Execution Suite
import ExecutionSuite from '#testcase/Models/TestExecution/ExecutionSuite.js';
import TestCaseExecutionMapping from '#testcase/Models/TestExecution/TestCaseExecutionMapping.js';

// Scheduler
import Job from '#scheduler/Models/job.js';
import JobManager from '#scheduler/Models/JobManager.js';

import { overrideConsole } from '#utils/logger.js';

overrideConsole();

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASS,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER
});
connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE_PREFIX + process.env.DATABASE_NAME}\`;`);

const sequelize = await createDBConnection({
  db: process.env.DATABASE_PREFIX + process.env.DATABASE_NAME,
  dialect: 'mysql',
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASS,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER
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

db.machines = Machine(sequelize, DataTypes); // All associations

db.customers.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).sync({ alter: true, force: false });
db.unverifieds.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).sync({ alter: true, force: false });
/*
 * Console.log("Updaing Schema")
 * db.jobs
 *   .schema("automation_master")
 *   .sync({ force: true, alter: true })
 * db.jobManagers
 *   .schema("automation_master")
 *   .sync({ force: true, alter: true })
 */

// Await db.scheduler.schema("automation_").sync({ alter: true, });
customModelMethods(db.sequelize.models);

export default db;

async function createDBConnection (data) {
  try {
    /*
     * Console.log("Connection Details: ")
     * console.log(connectionData)
     */
    const { host, port, dialect, user, password, db } = data;

    if ((!host || !port || !dialect || user, !password || !db)) throw new Error('Insuffiecient Connection Details');
    const sequelize = new Sequelize(db, user, password, {
      dialect,
      dialectOptions: {
        ssl: {
          // This will help you. But you will see nwe error
          rejectUnauthorized: false,
          require: true // This line will fix new error
        }
      },
      host,
      logging: false,
      pool: {
        acquire: 60000,
        evict: 10000,
        idle: 10000,
        max: 50,
        min: 1
      },
      port
    });

    await sequelize
      .authenticate()
      .then(() => console.success(`Database Connected: ${dialect} => ${host}:${port}`))
      .catch((err) => {
        console.error('Sequalize Error');
        console.log(data);
        console.error(err);
      });

    return sequelize;
  } catch (err) {
    console.error(err);
  }
}
function customModelMethods (models) {
  for (const modelName in models) {
    const model = models[modelName];
    paginate(model);
  }
}
