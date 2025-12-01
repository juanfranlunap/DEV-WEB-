'use client';

import React from 'react';
import MovieCard from './MovieCard';
import styles from './MovieList.module.css';
import data from '../data/data.js';

const MovieList = () => {
    return (
        <div className={styles.grid}>
            {data.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
            ))}
        </div>
    );
};

export default MovieList;
