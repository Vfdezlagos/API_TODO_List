import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const taskSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'Empty...'
    },
    type: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

taskSchema.plugin(paginate);

const taskModel = model('Task', taskSchema, 'tasks');

export default taskModel;