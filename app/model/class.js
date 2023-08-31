import { Schema, model, models } from 'mongoose';

const classSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true });

const Class = models.Class || model('Class', classSchema);

export default Class;