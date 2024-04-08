import db from "#utils/dataBaseConnection.js";
import getError from "#utils/error.js";
import { idValidation } from "#validations/index.js";
// import { createJobManagerValidation } from "../Validations/scheduler.js";
import errorContstants from "#constants/error.js";
import successContstants from "#constants/success.js";
import _ from "lodash";
import { stopManager, startManagerJobs, addToConnectionPool, deleteFromConnectionPool, getJobManagerFromMap } from "../Service/schedulerService.js";
const JobManager = db.jobManagers;
const Job = db.jobs;

export const createJobManager = async (req, res) => {
    /*  #swagger.tags = ["Scheduler"] 
       #swagger.security = [{"apiKeyAuth": []}]
    */
    try {
        // const { error } = createJobManagerValidation.validate(req.body);
        // if (error) throw new Error(error.details[0].message);

        const projectId = req.headers["x-project-id"];
        const { active, connection } = req.body;

        const jobManager = await JobManager.schema(req.database).create({ ...req.body, projectId });
        if (connection && active) {
            await addToConnectionPool(jobManager.id, req.user.tenant, req.body.connection);
        }

        return res.status(200).json(jobManager);
    } catch (error) {
        getError(error, res);
    }
};

export const updateJobManagerById = async (req, res) => {
    /*  #swagger.tags = ["Scheduler"] 
       #swagger.security = [{"apiKeyAuth": []}]
    */
    try {
        const jobManagerId = req.params.jobManagerId;
        const { error } = idValidation.validate({ id: jobManagerId });
        if (error) throw new Error(error.details[0].message);

        const prevJobManager = await JobManager.schema(req.database).findByPk(jobManagerId);
        if (!prevJobManager) return res.status(404).json({ error: errorContstants.RECORD_NOT_FOUND });
        const prevConnectionData = prevJobManager.dataValues.connection;
        const { name = prevJobManager.dataValues.name, active = prevJobManager.dataValues.active, connection = prevConnectionData } = req.body;

        let payload = _.cloneDeep(req.body);

        if (active) {
            if (prevJobManager.dataValues.active == false) {
                console.log("Starting Job Manager: " + prevJobManager.dataValues.id);
                const jobs = await Job.schema(req.database).findAll({ where: { jobManagerId } });
                await startManagerJobs({ name, active, connection, jobs }, req.user.tenant, false);
            } else {
                console.log("Job Manager already active");
                const { host, port, dialect, user, password, db } = connection;
                if (
                    (host && port && dialect && user && password) ||
                    prevConnectionData.host != host ||
                    prevConnectionData.port != port ||
                    prevConnectionData.dialect != dialect ||
                    prevConnectionData.user != user ||
                    prevConnectionData.password != password ||
                    prevConnectionData.db != db
                ) {
                    console.log("New Connection Found");
                    deleteFromConnectionPool(req.user.tenant + "_" + prevJobManager.dataValues.id);
                    await addToConnectionPool(jobManagerId, req.user.tenant, req.body.connection);
                } else {
                    console.log("Using Old Connection");
                    delete payload.connection;
                }
            }
        } else {
            console.log("Making Job Manager Inactive");
            if (prevJobManager.dataValues.active == true) {
                const oldJobManager = getJobManagerFromMap(req.user.tenant + "_" + prevJobManager.dataValues.id);
                if (oldJobManager) {
                    stopManager(prevJobManager.dataValues.id, req.user.tenant);
                    console.log("Job Manager Inactive Successfully");
                } else console.log("Job Manager Not Found");
            } else console.log("Job Manager Already Stopped");
        }

        const updatedJobManager = await JobManager.schema(req.database).update(payload, { where: { id: jobManagerId } });
        if (updatedJobManager.length > 0) {
            // console.log(Updated Scheduler Maps")
            // console.log("Connection Pool: ", connectionPool)
            // console.log("Job Manager: ", jobManagerMap,")
            return res.status(200).json({ message: successContstants.UPDATED });
        }
    } catch (error) {
        getError(error, res);
    }
};

export const getAllJobManager = async (req, res) => {
    /*  #swagger.tags = ["Scheduler"] 
       #swagger.security = [{"apiKeyAuth": []}]
    */
    try {
        const projectId = req.headers["x-project-id"];
        const jobManagers = await JobManager.schema(req.database).findAll({ where: { projectId } });
        return res.status(200).json(jobManagers);
    } catch (error) {
        getError(error, res);
    }
};

export const getJobManagerById = async (req, res) => {
    /*  #swagger.tags = ["Scheduler"] 
       #swagger.security = [{"apiKeyAuth": []}]
    */
    try {
        const jobManagerId = req.params.jobManagerId;
        const jobManager = await JobManager.schema(req.database).findByPk(jobManagerId);
        return res.status(200).json(jobManager);
    } catch (error) {
        getError(error, res);
    }
};

export const removeJobManager = async (req, res) => {
    /*  #swagger.tags = ["Scheduler"] 
       #swagger.security = [{"apiKeyAuth": []}]
    */
    try {
        const jobManagerId = req.params.jobManagerId;
        const { error } = idValidation.validate({ id: jobManagerId });
        if (error) throw new Error(error.details[0].message);

        const deletedJobManager = await JobManager.schema(req.database).destroy({
            where: { id: jobManagerId },
        });
        if (deletedJobManager > 0) return res.status(200).json({ message: successContstants.DELETED });
        else return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
    } catch (error) {
        getError(error, res);
    }
};
