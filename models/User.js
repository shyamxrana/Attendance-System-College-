import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        enum: ['teacher', 'student'],
        default: 'student',
    },
    studentProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: false, // Only if role is student
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
