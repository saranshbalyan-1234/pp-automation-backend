import mysql from 'mysql';
import { DataTypes, Sequelize } from 'sequelize';

import Project from '#project/Models/Project.js';
import UserProject from '#project/Models/UserProject.js';
import Job from '#scheduler/Models/job.js';
import JobManager from '#scheduler/Models/JobManager.js';
import Customer from '#user/Models/Customer.js';
import Permission from '#user/Models/RolePermission/Permission.js';
import Role from '#user/Models/RolePermission/Role.js';
import UserRole from '#user/Models/RolePermission/UserRole.js';
import Unverified from '#user/Models/Unverified.js';
import User from '#user/Models/User.js';
import overrideConsole from '#utils/Logger/console.js';
import paginate from '#utils/pagination.js';

overrideConsole();

export const createDBConnection = async (data) => {
  try {
    /*
     * Console.log("Connection Details: ")
     * console.log(connectionData)
     */
    const { host, port, dialect, user, password, db: database } = data;

    if ((!host || !port || !dialect || user, !password || !database)) throw new Error('Insuffiecient Connection Details');
    const sequelizenew = new Sequelize(database, user, password, {
      dialect,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false,
          require: true
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

    await sequelizenew
      .authenticate()
      .then(() => console.success(`Database Connected: ${dialect} => ${host}:${port}`))
      .catch((err) => {
        console.error('Sequalize Error');
        console.log(data);
        console.error(err);
      });

    return sequelizenew;
  } catch (err) {
    console.error(err);
  }
};
const customModelMethods = (models) => {
  for (const modelName in models) {
    if (Object.hasOwn(models, modelName)) {
      const model = models[modelName];
      paginate(model);
    }
  }
};

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

const db = {
  Sequelize,
  sequelize
};

db.sequelize.dialect.supports.schemas = true;

db.customers = Customer(sequelize, DataTypes);
db.unverifieds = Unverified(sequelize, DataTypes);

db.users = User(sequelize, DataTypes);

db.roles = Role(sequelize, DataTypes);
db.userRoles = UserRole(sequelize, DataTypes);
db.permissions = Permission(sequelize, DataTypes);

db.projects = Project(sequelize, DataTypes);
db.userProjects = UserProject(sequelize, DataTypes);

db.jobs = Job(sequelize, DataTypes);
db.jobManagers = JobManager(sequelize, DataTypes);

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
