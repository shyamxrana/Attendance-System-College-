import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for the student.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    rollNo: {
        type: String,
        required: [true, 'Please provide a roll number.'],
        unique: true,
    },
    course: {
        type: String,
        required: [true, 'Please specify the course.'],
    },
    year: {
        type: Number,
        required: [true, 'Please specify the year.'],
    },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
