import express from 'express';
import {
    createApplication,
    getApplications,
    updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router
    .route('/')
    .post(protect, createApplication)
    .get(protect, getApplications);

router
    .route('/:id')
    .put(protect, authorize('admin'), updateApplicationStatus);

export default router;
