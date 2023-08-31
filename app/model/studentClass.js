import { Schema, model, models } from 'mongoose';

const studentClassSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const StudentClass = models.StudentClass || model('StudentClass', studentClassSchema);

export default StudentClass;