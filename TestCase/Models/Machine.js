export default (sequelize, DataTypes) => {
  const Machine = sequelize.define('machines', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: 'name',
      validate: {
        notNull: true
      }
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: 'url',
      validate: {
        notNull: true
      }
    }
  });

  sequelize.models.users.hasMany(sequelize.models.userRoles, {
    constraints: false,
    foreignKey: 'userId'
  });
  sequelize.models.roles.hasMany(sequelize.models.permissions, {
    constraints: false,
    foreignKey: 'roleId'
  });

  sequelize.models.userRoles.hasMany(sequelize.models.permissions, {
    constraints: false,
    foreignKey: 'roleId'
  });

  sequelize.models.userRoles.hasOne(sequelize.models.roles, {
    constraints: false,
    foreignKey: 'id',
    sourceKey: 'roleId'
  });

  sequelize.models.projects.hasMany(sequelize.models.testCases, {
    constraints: false,
    foreignKey: 'projectId',
    sourceKey: 'id'
  });

  sequelize.models.objects.hasMany(sequelize.models.objectLocators, {
    as: 'locators',
    constraints: false,
    foreignKey: 'objectId'
  });

  sequelize.models.projects.hasMany(sequelize.models.userProjects, {
    as: 'members',
    constraints: false,
    foreignKey: 'projectId'
  });
  sequelize.models.userProjects.hasOne(sequelize.models.projects, {
    constraints: false,
    foreignKey: 'id',
    sourceKey: 'projectId'
  });
  sequelize.models.userProjects.hasOne(sequelize.models.users, {
    constraints: false,
    foreignKey: 'id',
    sourceKey: 'userId'
  });
  sequelize.models.testCases.hasMany(sequelize.models.processes, {
    constraints: false,
    foreignKey: 'testCaseId',
    sourceKey: 'id'
  });

  sequelize.models.reusableProcesses.hasMany(sequelize.models.testSteps, {
    constraints: false,
    foreignKey: 'reusableProcessId',
    sourceKey: 'id'
  });

  sequelize.models.processes.hasMany(sequelize.models.testSteps, {
    constraints: false,
    foreignKey: 'processId',
    sourceKey: 'id'
  });

  sequelize.models.processes.hasOne(sequelize.models.reusableProcesses, {
    constraints: false,
    foreignKey: 'id',
    sourceKey: 'reusableProcessId'
  });

  sequelize.models.testSteps.hasMany(sequelize.models.testParameters, {
    constraints: false,
    foreignKey: 'testStepId',
    sourceKey: 'id'
  });

  sequelize.models.testSteps.hasOne(sequelize.models.objects, {
    constraints: false,
    foreignKey: 'id',
    sourceKey: 'objectId'
  });
  sequelize.models.executionHistories.hasMany(sequelize.models.processHistories, {
    as: 'process',
    constraints: false,
    foreignKey: 'executionHistoryId',
    sourceKey: 'id'
  });

  sequelize.models.processHistories.hasMany(sequelize.models.testStepHistories, {
    as: 'testSteps',
    constraints: false,
    foreignKey: 'processId',
    sourceKey: 'processId'
  });
  sequelize.models.environments.hasMany(sequelize.models.columns, {
    constraints: false,
    foreignKey: 'envId',
    sourceKey: 'id'
  });

  sequelize.models.testCases.hasMany(sequelize.models.environments, {
    constraints: false,
    foreignKey: 'testCaseId',
    sourceKey: 'id'
  });

  sequelize.models.projects.hasMany(sequelize.models.executionSuites, {
    constraints: false,
    foreignKey: 'projectId',
    sourceKey: 'id'
  });

  sequelize.models.executionSuites.hasMany(sequelize.models.testCaseExecutionMappings, {
    constraints: false,
    foreignKey: 'executionSuiteId',
    sourceKey: 'id'
  });

  sequelize.models.testCaseExecutionMappings.hasOne(sequelize.models.testCases, {
    constraints: false,
    foreignKey: 'id',
    sourceKey: 'testCaseId'
  });

  sequelize.models.projects.hasMany(sequelize.models.jobManagers, {
    constraints: false,
    foreignKey: 'projectId',
    sourceKey: 'id'
  });

  sequelize.models.jobManagers.hasMany(sequelize.models.jobs, {
    constraints: false,
    foreignKey: 'jobManagerId',
    sourceKey: 'id'
  });

  sequelize.models.customers.hasOne(sequelize.models.unverifieds, {
    constraints: false,
    foreignKey: 'email',
    sourceKey: 'email'
  });

  return Machine;
};
