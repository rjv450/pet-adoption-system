import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        species: {
            type: String,
            required: [true, 'Please add a species (e.g., Dog, Cat)'],
        },
        breed: {
            type: String,
            required: [true, 'Please add a breed'],
        },
        age: {
            type: Number,
            required: [true, 'Please add an age'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        status: {
            type: String,
            enum: ['available', 'pending', 'adopted'],
            default: 'available',
        },
        image: {
            type: String,
            default: 'no-photo.jpg',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Pet', petSchema);
