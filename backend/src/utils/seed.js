import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Pet from '../models/Pet.js';
import connectDB from '../config/db.js';

dotenv.config();

// Sample pets data
const samplePets = [
    {
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 2,
        description: 'Buddy is a friendly and energetic Golden Retriever who loves playing fetch and going for long walks. He is great with kids and other pets. Buddy is house-trained and knows basic commands.',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&h=600&fit=crop',
    },
    {
        name: 'Luna',
        species: 'Cat',
        breed: 'Persian',
        age: 3,
        description: 'Luna is a beautiful Persian cat with a calm and gentle personality. She enjoys lounging in sunny spots and being petted. Luna is perfect for a quiet home environment.',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
    },
    {
        name: 'Max',
        species: 'Dog',
        breed: 'German Shepherd',
        age: 4,
        description: 'Max is a loyal and intelligent German Shepherd. He is well-trained and protective. Max would be perfect for an active family who enjoys outdoor activities.',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop',
    },
    {
        name: 'Whiskers',
        species: 'Cat',
        breed: 'Siamese',
        age: 1,
        description: 'Whiskers is a playful and curious Siamese kitten. She loves interactive toys and climbing. Whiskers is very social and would thrive in a home with lots of attention.',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
    },
    {
        name: 'Rocky',
        species: 'Dog',
        breed: 'Bulldog',
        age: 5,
        description: 'Rocky is a gentle and laid-back Bulldog. Despite his tough appearance, he is very sweet and loves cuddling. Rocky is perfect for apartment living.',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&h=600&fit=crop',
    },
    {
        name: 'Mittens',
        species: 'Cat',
        breed: 'Maine Coon',
        age: 2,
        description: 'Mittens is a large and friendly Maine Coon with a fluffy coat. She is very sociable and gets along well with other pets. Mittens loves attention and being brushed.',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
    },
    {
        name: 'Charlie',
        species: 'Dog',
        breed: 'Labrador Retriever',
        age: 1,
        description: 'Charlie is an energetic young Labrador who loves water and playing fetch. He is very friendly and great with children. Charlie needs an active family.',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop',
    },
    {
        name: 'Shadow',
        species: 'Cat',
        breed: 'British Shorthair',
        age: 4,
        description: 'Shadow is a calm and independent British Shorthair. He enjoys quiet time and is perfect for someone looking for a low-maintenance companion.',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
    },
    {
        name: 'Daisy',
        species: 'Dog',
        breed: 'Beagle',
        age: 3,
        description: 'Daisy is a friendly Beagle with a great sense of smell. She loves exploring and going on adventures. Daisy is great with families and other dogs.',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&h=600&fit=crop',
    },
    {
        name: 'Princess',
        species: 'Cat',
        breed: 'Ragdoll',
        age: 2,
        description: 'Princess is a beautiful Ragdoll cat known for her docile and placid temperament. She loves being held and is very affectionate. Perfect for families.',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
    },
];

// Admin user data
const adminUser = {
    name: 'Admin User',
    email: 'admin@petadopt.com',
    password: 'admin123',
    role: 'admin',
};

const seedData = async () => {
    try {
        // Connect to database
        await connectDB();

        console.log('🌱 Starting database seeding...\n');

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Pet.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create admin user
        console.log('👤 Creating admin user...');
        const admin = await User.create(adminUser);
        console.log(`✅ Admin user created: ${admin.email} (Password: ${adminUser.password})\n`);

        // Create sample pets
        console.log('🐾 Creating sample pets...');
        const pets = await Pet.insertMany(samplePets);
        console.log(`✅ Created ${pets.length} pets\n`);

        // Display summary
        console.log('📊 Seeding Summary:');
        console.log(`   - Admin Users: 1`);
        console.log(`   - Pets: ${pets.length}`);
        console.log('\n✨ Database seeding completed successfully!');
        console.log('\n📝 Login Credentials:');
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Password: ${adminUser.password}`);
        console.log(`   Role: ${adminUser.role}\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed function
seedData();



