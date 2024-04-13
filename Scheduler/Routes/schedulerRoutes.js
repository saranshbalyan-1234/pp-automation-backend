import express from 'express';

import { createJob, getAllJobByJobManagerId, getJobById, removeJob, updateJob } from '../Controllers/jobController.js';
import { createJobManager, getAllJobManager, getJobManagerById, removeJobManager, updateJobManagerById } from '../Controllers/jobManagerController.js';
const Router = express.Router();

Router.get('/job-manager', getAllJobManager);
Router.get('/job-manager/:jobManagerId/jobs', getAllJobByJobManagerId);
Router.post('/job-manager', createJobManager);
Router.get('/job-manager/:jobManagerId', getJobManagerById);
Router.put('/job-manager/:jobManagerId', updateJobManagerById);
Router.delete('/job-manager/:jobManagerId', removeJobManager);

Router.post('/job', createJob);
Router.get('/job/:jobId', getJobById);
Router.put('/job/:jobId', updateJob);
Router.delete('/job/:jobId', removeJob);

export default Router;
