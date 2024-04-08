import db from "#utils/dataBaseConnection.js";
import getError from "#utils/error.js";
import { idValidation } from "#validations/index.js";
// import { createJobValidataion } from "../Validations/scheduler.js";
import errorContstants from "#constants/error.js";
import successContstants from "#constants/success.js";
import { addJob, updateJobStatus, getJobManagerFromMap } from "../Service/schedulerService.js";
const Job = db.jobs;
const JobManager = db.jobManagers;

export const createJob = async (req, res) => {
    /*  #swagger.tags = ["Scheduler"] 
       #swagger.security = [{"apiKeyAuth": []}]
    */
    try {
        // const { error } = createJobValidataion.validate(req.body);
        // if (error) throw new Error(error.details[0].message);

        const jobManagerId = req.body.jobManagerId;
        const job = await Job.schema(req.database).create({ ...req.body });
        await addJob(jobManagerId, job, req.user.tenant);
        return res.status(200).json(job);
    } catch (error) {
        getError(error, res);
    }
};

export const updateJob = async (req, res) => {
    /*  #swagger.tags = ["Scheduler"] 
       #swagger.security = [{"apiKeyAuth": []}]
    */
    try {
        const jobId = req.params.jobId;
        const { error } = idValidation.validate({ id: jobId });
        if (error) throw new Error(error.details[0].message);

        const job = await Job.schema(req.database).findOne({ where: { id: jobId } });
        if (!job) return res.status(404).json({ error: errorContstants.RECORD_NOT_FOUND });

        const updatedJob = await Job.schema(req.database).update({ ...req.body }, { where: { id: jobId } });
        if (Object.prototype.hasOwnProperty.call(req.body, "active")) updateJobStatus(job.jobManagerId, jobId, req.body.active, req.user.tenant);

        if (updatedJob.length > 0) return res.status(200).json({ message: successContstants.UPDATED });
    } catch (error) {
        getError(error, res);
    }
};

export const getAllJobByJobManagerId = async (req, res) => {
    /*  #swagger.tags = ["Scheduler"] 
       #swagger.security = [{"apiKeyAuth": []}]
    */
    try {
        const jobManagerId = req.params.jobManagerId;
        const jobs = await Job.schema(req.database).findAll({ where: { jobManagerId } });
        return res.status(200).json(jobs);
    } catch (error) {
        getError(error, res);
    }
};

export const getJobById = async (req, res) => {
    /*  #swagger.tags = ["Scheduler"] 
       #swagger.security = [{"apiKeyAuth": []}]
    */
    try {
        const jobId = req.params.jobId;
        const job = await Job.schema(req.database).findByPk(jobId);
        return res.status(200).json(job);
    } catch (error) {
        getError(error, res);
    }
};

export const removeJob = async (req, res) => {
    /*  #swagger.tags = ["Scheduler"] 
       #swagger.security = [{"apiKeyAuth": []}]
    */
    try {
        const jobId = req.params.jobId;

        const manager = await JobManager.findOne({ where: { jobId } });

        const jobManager = getJobManagerFromMap(req.user.tenant + "_" + manager.id);
        await jobManager.stop(String(jobId));
        const { error } = idValidation.validate({ id: jobId });
        if (error) throw new Error(error.details[0].message);

        const deletedJob = await Job.schema(req.database).destroy({
            where: { id: jobId },
        });
        if (deletedJob > 0) return res.status(200).json({ message: successContstants.DELETED });
        else return res.status(400).json({ error: errorContstants.RECORD_NOT_FOUND });
    } catch (error) {
        getError(error, res);
    }
};
