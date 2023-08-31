import { Schema, model, models, Types } from 'mongoose';

const unitSchema = new Schema({
    unitNumber: {
        type: Number,
        required: true
    },
    topic: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true
    },
    class: { type: Types.ObjectId, ref: "Class", required: true }
}, { timestamps: true });

const Unit = models.Unit || model('Unit', unitSchema);

export default Unit;