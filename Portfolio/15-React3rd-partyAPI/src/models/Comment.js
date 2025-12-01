import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
