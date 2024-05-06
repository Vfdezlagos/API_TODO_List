import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const userSchema = Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'role-user'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(paginate);

const userModel = model('User', userSchema, 'users');

export default userModel;