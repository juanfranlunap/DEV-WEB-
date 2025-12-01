import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '../../../lib/db';
import Like from '../../../models/Like';


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const movieId = searchParams.get('movieId');

        if (!movieId) {
            return NextResponse.json({ error: 'movieId is required' }, { status: 400 });
        }

        await dbConnect();

        const likes = await Like.find({ movieId, type: 'like' });
        const dislikes = await Like.find({ movieId, type: 'dislike' });

        return NextResponse.json({
            likes: likes.length,
            dislikes: dislikes.length,
        });
    } catch (error) {
        console.error('Error fetching likes:', error);
        return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { movieId, type } = await request.json();

        if (!movieId || !type || !['like', 'dislike'].includes(type)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        await dbConnect();

        const userEmail = session.user.email;

        const existingVote = await Like.findOne({ movieId, userEmail });

        if (existingVote) {

            if (existingVote.type === type) {
                await Like.deleteOne({ movieId, userEmail });
                return NextResponse.json({ message: 'Vote removed', action: 'removed' });
            } else {
                existingVote.type = type;
                await existingVote.save();
                return NextResponse.json({ message: 'Vote updated', action: 'updated' });
            }
        } else {
            const newVote = new Like({
                movieId,
                userEmail,
                type,
            });
            await newVote.save();
            return NextResponse.json({ message: 'Vote added', action: 'added' });
        }
    } catch (error) {
        console.error('Error saving like:', error);
        return NextResponse.json({ error: 'Failed to save like' }, { status: 500 });
    }
}
