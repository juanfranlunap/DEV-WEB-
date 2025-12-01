'use client';

import React from 'react';
import MovieCard from './MovieCard';
import styles from './MovieList.module.css';


const MovieList = () => {
    const [movies, setMovies] = React.useState([]);

    React.useEffect(() => {
        fetch('/api/movies')
            .then(res => res.json())
            .then(data => setMovies(data));
    }, []);

    return (
        <div className={styles.grid}>
            {movies.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
            ))}
        </div>
    );
};

export default MovieList;
