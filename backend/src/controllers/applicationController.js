import Application from '../models/Application.js';
import Pet from '../models/Pet.js';
import Notification from '../models/Notification.js';

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Apply to adopt a pet
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - petId
 *               - message
 *             properties:
 *               petId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Pet not available or already applied
 *       401:
 *         description: Not authorized
 */
// @desc    Apply for adoption
// @route   POST /api/applications
// @access  Private (User)
export const createApplication = async (req, res) => {
    try {
        const { petId, message } = req.body;

        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        if (pet.status !== 'available') {
            return res
                .status(400)
                .json({ message: 'Pet is not available for adoption' });
        }

        // Check if user already applied for this pet
        const existingApplication = await Application.findOne({
            user: req.user._id,
            pet: petId,
        });

        if (existingApplication) {
            return res
                .status(400)
                .json({ message: 'You have already applied for this pet' });
        }

        const application = await Application.create({
            user: req.user._id,
            pet: petId,
            message,
        });

        // Create notification for admin
        await Notification.create({
            user: req.user._id,
            application: application._id,
            message: `New adoption application submitted for ${pet.name}`,
            type: 'application_status',
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get applications - User sees own, Admin sees all
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 *       401:
 *         description: Not authorized
 */
// @desc    Get applications
// @route   GET /api/applications
// @access  Private (User: own, Admin: all)
export const getApplications = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.user.role !== 'admin') {
            query.user = req.user._id;
        }

        const applications = await Application.find(query)
            .populate('user', 'name email')
            .populate('pet', 'name species breed')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Application.countDocuments(query);

        res.status(200).json({
            applications,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @swagger
 * /api/applications/{id}:
 *   put:
 *     summary: Update application status - Admin only
 *     tags: [Applications]
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Application status updated
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Application not found
 */
// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Admin)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status;
        await application.save();

        // If approved, update pet status to adopted and reject other pending applications
        if (status === 'approved') {
            const pet = await Pet.findById(application.pet);
            if (pet) {
                pet.status = 'adopted';
                await pet.save();
            }

            // Reject other pending applications for this pet
            await Application.updateMany(
                {
                    pet: application.pet,
                    _id: { $ne: application._id },
                    status: 'pending',
                },
                { status: 'rejected' }
            );
        }

        // Create notification for user
        const pet = await Pet.findById(application.pet);
        await Notification.create({
            user: application.user,
            application: application._id,
            message: `Your adoption application for ${pet.name} has been ${status}`,
            type: 'application_status',
        });

        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
