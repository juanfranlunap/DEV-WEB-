'use client';

import React, { useState } from 'react';
import styles from './MovieCard.module.css';
import CharacterDetails from './CharacterDetails';

const MovieCard = ({ movie }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const toggleDetails = () => setShowDetails(!showDetails);

    // Map affiliation to logo- flename
    const affiliationLogoMap = {
        'Jedi': 'jedi.png',
        'Sith': 'sith.png',
        'Empire': 'empire.png',
        'Rebellion': 'rebel.png'
    };

    const affiliation = movie.best_character.affiliation;
    const isGood = ['Jedi', 'Rebellion'].includes(affiliation);
    const affiliationLogo = affiliationLogoMap[affiliation] || 'jedi.png';

    return (
        <div className={styles.card}>
            <div
                className={styles.imageContainer}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    src={isHovered ? `/images/${affiliationLogo}` : `/images/${movie.poster}`}
                    alt={movie.title}
                    className={styles.poster}
                    style={isHovered ? { border: `3px solid ${isGood ? 'blue' : 'red'}` } : {}}
                />
            </div>
            <div className={styles.content}>
                <h3>{movie.title}</h3>
                <p>{movie.year}</p>
                <div className={styles.actions}>
                    <button onClick={() => setLikes(likes + 1)}>Like ({likes})</button>
                    <button onClick={() => setDislikes(dislikes + 1)}>Dislike ({dislikes})</button>
                </div>
                <button className={styles.moreBtn} onClick={toggleDetails}>
                    {showDetails ? 'Less...' : 'More...'}
                </button>
            </div>
            {showDetails && (
                <CharacterDetails character={movie.best_character} />
            )}
        </div>
    );
};

export default MovieCard;
