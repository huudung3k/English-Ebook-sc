import { Schema, Types, model, models } from 'mongoose';
import Role from './role';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLoginAt: {
        type: Date
    },
    studentClass: { type: Types.ObjectId, ref: "StudentClass", default: null }
}, { timestamps: true });

const User = models.User || model('User', userSchema);

export default User;