import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Comment from '../../../models/Comment';

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');

    if (!movieId) {
        return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }

    const comments = await Comment.find({ movieId }).sort({ createdAt: -1 });
    return NextResponse.json(comments);
}

export async function POST(request) {
    await dbConnect();
    const body = await request.json();
    const { movieId, user, text } = body;

    if (!movieId || !user || !text) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const comment = await Comment.create({ movieId, user, text });
    return NextResponse.json(comment, { status: 201 });
}
