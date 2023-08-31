import { Schema, model, models, Types } from 'mongoose';

const partSchema = new Schema({
    partNumber: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    unit: { type: Types.ObjectId, ref: "Unit" }
}, { timestamps: true });

const Part = models.Part || model('Part', partSchema);

export default Part;