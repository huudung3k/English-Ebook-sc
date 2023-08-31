import { Schema, Types, model, models } from 'mongoose';

const assignmentSchema = new Schema({
    user: { type: Types.ObjectId, ref: "User", required: true },
    answer: {
        type: Map
    },
    section: { type: Types.ObjectId, ref: "Section", required: true },
    isTemplate: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFinished: {
        type: Boolean,
        default: false
    },
    numberOfCorrects: {
        type: Number
    }
}, { timestamps: true });

const Assignment = models.Assignment || model('Assignment', assignmentSchema);

export default Assignment;