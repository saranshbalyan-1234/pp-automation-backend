import express from 'express';

import { createJob, getJobById, removeJob, updateJob } from '../Controllers/jobController.js';
const Router = express.Router();

const jobId = 'jobId';

Router.post('/', createJob);
Router.get(`/:${jobId}`, getJobById);
Router.put(`/:${jobId}`, updateJob);
Router.delete(`/:${jobId}`, removeJob);

export default Router;
