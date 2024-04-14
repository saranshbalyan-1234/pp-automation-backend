import express from 'express';

import { getAllJobByJobManagerId } from '../Controllers/jobController.js';
import { createJobManager, getAllJobManager, getJobManagerById, removeJobManager, updateJobManagerById } from '../Controllers/jobManagerController.js';
const Router = express.Router();

const jobManagerId = 'jobManagerId';

Router.get('/', getAllJobManager);
Router.get(`/:${jobManagerId}/jobs`, getAllJobByJobManagerId);
Router.post('/', createJobManager);
Router.get(`/:${jobManagerId}`, getJobManagerById);
Router.put(`/:${jobManagerId}`, updateJobManagerById);
Router.delete(`/:${jobManagerId}`, removeJobManager);

export default Router;
