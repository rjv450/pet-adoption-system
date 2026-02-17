import Pet from '../models/Pet.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Get all pets with filtering and pagination
 *     tags: [Pets]
 *     parameters:
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *       - in: query
 *         name: breed
 *         schema:
 *           type: string
 *       - in: query
 *         name: age
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *     responses:
 *       200:
 *         description: List of pets
 */
// @desc    Get all pets
// @route   GET /api/pets
// @access  Public
export const getPets = async (req, res) => {
    try {
        const { species, breed, age, search } = req.query;
        let query = {};

        if (species) query.species = species;
        if (breed) query.breed = breed;
        if (age) query.age = age;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { breed: { $regex: search, $options: 'i' } },
            ];
        }

        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const pets = await Pet.find(query).skip(skip).limit(limit);
        const total = await Pet.countDocuments(query);

        res.status(200).json({ pets, total, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Get a single pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pet details
 *       404:
 *         description: Pet not found
 */
// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
export const getPet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.status(200).json(pet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Create a new pet - Admin only
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - breed
 *               - age
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: number
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [available, pending, adopted]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Pet created successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 */
// @desc    Create a pet
// @route   POST /api/pets
// @access  Private/Admin
export const createPet = async (req, res) => {
    try {
        const petData = { ...req.body };
        
        // If file is uploaded, set image path
        if (req.file) {
            petData.image = `/uploads/${req.file.filename}`;
        } else if (!petData.image) {
            // Default image if none provided
            petData.image = '/uploads/no-photo.jpg';
        }

        const pet = await Pet.create(petData);
        res.status(201).json(pet);
    } catch (error) {
        res.status(400).json({ message: 'Invalid pet data', error: error.message });
    }
};

/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     summary: Update a pet - Admin only
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: number
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [available, pending, adopted]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Pet not found
 */
// @desc    Update a pet
// @route   PUT /api/pets/:id
// @access  Private/Admin
export const updatePet = async (req, res) => {
    try {
        const petData = { ...req.body };
        
        // If file is uploaded, set image path
        if (req.file) {
            petData.image = `/uploads/${req.file.filename}`;
        }

        const pet = await Pet.findByIdAndUpdate(req.params.id, petData, {
            new: true,
            runValidators: true,
        });

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.status(200).json(pet);
    } catch (error) {
        res.status(400).json({ message: 'Invalid pet data', error: error.message });
    }
};

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Delete a pet - Admin only
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pet deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Pet not found
 */
// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Private/Admin
export const deletePet = async (req, res) => {
    try {
        const pet = await Pet.findByIdAndDelete(req.params.id);

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.status(200).json({ message: 'Pet removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
