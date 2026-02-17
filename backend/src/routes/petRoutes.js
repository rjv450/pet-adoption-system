import express from 'express';
import {
    getPets,
    getPet,
    createPet,
    updatePet,
    deletePet,
} from '../controllers/petController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router
    .route('/')
    .get(getPets)
    .post(protect, authorize('admin'), upload.single('image'), createPet);

router
    .route('/:id')
    .get(getPet)
    .put(protect, authorize('admin'), upload.single('image'), updatePet)
    .delete(protect, authorize('admin'), deletePet);

export default router;
