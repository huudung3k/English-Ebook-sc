import { Schema, model, models, Types } from 'mongoose';

const sectionSchema = new Schema({
    sectionNumber: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    preTitle1: {
        type: String,
    },
    preTitle2: {
        type: String
    },
    hasAudio: {
        type: Boolean,
        default: false
    },
    audioFile: {
        type: String
    },
    isExercise: {
        type: Boolean,
        default: false
    },
    isTable: {
        type: Boolean,
        default: false
    },
    isMatchWords: {
        type: Boolean,
        default: false
    },
    part: { type: Types.ObjectId, ref: "Part" }
}, { timestamps: true });

const Section = models.Section || model('Section', sectionSchema);

export default Section;