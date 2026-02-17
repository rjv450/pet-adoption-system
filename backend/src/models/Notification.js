import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['application_status', 'pet_update', 'system'],
            default: 'application_status',
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Notification', notificationSchema);



