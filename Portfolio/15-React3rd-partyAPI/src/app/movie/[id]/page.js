'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import CharacterDetails from '../../../components/CharacterDetails';
import CommentSection from '../../../components/CommentSection';
import Link from 'next/link';

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`/api/movies/${id}`)
                .then(res => res.json())
                .then(data => setMovie(data));
        }
    }, [id]);

    if (!movie) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container mt-5">
            <Link href="/" className="btn btn-secondary mb-3">Back to Movies</Link>
            <h1 className="text-center mb-4">{movie.title}</h1>
            <CharacterDetails character={movie.best_character} />
            <div className="mt-5">
                <CommentSection movieId={movie.episode} />
            </div>
        </div>
    );
}
