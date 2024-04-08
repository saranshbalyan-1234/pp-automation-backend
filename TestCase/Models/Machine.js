export default (sequelize, DataTypes) => {
    const Machine = sequelize.define("machines", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "name",
            validate: {
                notNull: true,
            },
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "url",
            validate: {
                notNull: true,
            },
        },
    });

    sequelize.models.users.hasMany(sequelize.models.userRoles, {
        foreignKey: "userId",
        constraints: false,
    });
    sequelize.models.roles.hasMany(sequelize.models.permissions, {
        foreignKey: "roleId",
        constraints: false,
    });

    sequelize.models.userRoles.hasMany(sequelize.models.permissions, {
        foreignKey: "roleId",
        constraints: false,
    });

    sequelize.models.userRoles.hasOne(sequelize.models.roles, {
        foreignKey: "id",
        sourceKey: "roleId",
        constraints: false,
    });

    sequelize.models.projects.hasMany(sequelize.models.testCases, {
        sourceKey: "id",
        foreignKey: "projectId",
        constraints: false,
    });

    sequelize.models.objects.hasMany(sequelize.models.objectLocators, {
        foreignKey: "objectId",
        as: "locators",
        constraints: false,
    });

    sequelize.models.projects.hasMany(sequelize.models.userProjects, {
        foreignKey: "projectId",
        as: "members",
        constraints: false,
    });
    sequelize.models.userProjects.hasOne(sequelize.models.projects, {
        foreignKey: "id",
        sourceKey: "projectId",
        constraints: false,
    });
    sequelize.models.userProjects.hasOne(sequelize.models.users, {
        foreignKey: "id",
        sourceKey: "userId",
        constraints: false,
    });
    sequelize.models.testCases.hasMany(sequelize.models.processes, {
        sourceKey: "id",
        foreignKey: "testCaseId",
        constraints: false,
    });

    sequelize.models.reusableProcesses.hasMany(sequelize.models.testSteps, {
        sourceKey: "id",
        foreignKey: "reusableProcessId",
        constraints: false,
    });

    sequelize.models.processes.hasMany(sequelize.models.testSteps, {
        sourceKey: "id",
        foreignKey: "processId",
        constraints: false,
    });

    sequelize.models.processes.hasOne(sequelize.models.reusableProcesses, {
        sourceKey: "reusableProcessId",
        foreignKey: "id",
        constraints: false,
    });

    sequelize.models.testSteps.hasMany(sequelize.models.testParameters, {
        sourceKey: "id",
        foreignKey: "testStepId",
        constraints: false,
    });

    sequelize.models.testSteps.hasOne(sequelize.models.objects, {
        sourceKey: "objectId",
        foreignKey: "id",
        constraints: false,
    });
    sequelize.models.executionHistories.hasMany(sequelize.models.processHistories, {
        as: "process",
        sourceKey: "id",
        foreignKey: "executionHistoryId",
        constraints: false,
    });

    sequelize.models.processHistories.hasMany(sequelize.models.testStepHistories, {
        as: "testSteps",
        sourceKey: "processId",
        foreignKey: "processId",
        constraints: false,
    });
    sequelize.models.environments.hasMany(sequelize.models.columns, {
        sourceKey: "id",
        foreignKey: "envId",
        constraints: false,
    });

    sequelize.models.testCases.hasMany(sequelize.models.environments, {
        sourceKey: "id",
        foreignKey: "testCaseId",
        constraints: false,
    });

    sequelize.models.projects.hasMany(sequelize.models.executionSuites, {
        sourceKey: "id",
        foreignKey: "projectId",
        constraints: false,
    });

    sequelize.models.executionSuites.hasMany(sequelize.models.testCaseExecutionMappings, {
        sourceKey: "id",
        foreignKey: "executionSuiteId",
        constraints: false,
    });

    sequelize.models.testCaseExecutionMappings.hasOne(sequelize.models.testCases, {
        sourceKey: "testCaseId",
        foreignKey: "id",
        constraints: false,
    });

    sequelize.models.projects.hasMany(sequelize.models.jobManagers, {
        sourceKey: "id",
        foreignKey: "projectId",
        constraints: false,
    });

    sequelize.models.jobManagers.hasMany(sequelize.models.jobs, {
        sourceKey: "id",
        foreignKey: "jobManagerId",
        constraints: false,
    });

    sequelize.models.customers.hasOne(sequelize.models.unverifieds, {
        sourceKey: "email",
        foreignKey: "email",
        constraints: false,
    });

    return Machine;
};
