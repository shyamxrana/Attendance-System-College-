import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late'],
        default: 'Present',
    },
}, { timestamps: true });

// Ensure unique attendance for a student on a specific date (optional but good practice)
// Note: Date usually includes time, so we might need to normalize date part or handle it in query/validation.
// For now, we'll keep it simple in schema and validate in logic.

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
