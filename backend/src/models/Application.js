import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        pet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pet',
            required: true,
        },
        message: {
            type: String,
            required: [true, 'Please add a message explaining why you want to adopt'],
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Application', applicationSchema);
