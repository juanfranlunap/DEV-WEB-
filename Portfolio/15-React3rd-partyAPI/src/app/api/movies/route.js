import { NextResponse } from 'next/server';
import sw from '../../../data/data';

export async function GET() {
    return NextResponse.json(sw);
}
