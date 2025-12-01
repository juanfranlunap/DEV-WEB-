import { NextResponse } from 'next/server';
import sw from '../../../../data/data';

export async function GET(request, { params }) {
    const { id } = await params;
    const movie = sw.find((m) => m.episode === id);

    if (!movie) {
        return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json(movie);
}
