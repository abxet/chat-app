import express from 'express';
import mongoose from'mongoose';

function connectDB() {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error(error);
    }
    
}

export default connectDB;