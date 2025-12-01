import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['like', 'dislike'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// 1 vote por user
LikeSchema.index({ movieId: 1, userEmail: 1 }, { unique: true });

export default mongoose.models.Like || mongoose.model('Like', LikeSchema);
