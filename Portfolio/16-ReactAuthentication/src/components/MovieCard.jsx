'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './MovieCard.module.css';
import Link from 'next/link';

const MovieCard = ({ movie }) => {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { status } = useSelector((state) => state.auth);
    const isAuthenticated = status === 'authenticated';


    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const res = await fetch(`/api/likes?movieId=${movie.episode}`);
                if (res.ok) {
                    const data = await res.json();
                    setLikes(data.likes || 0);
                    setDislikes(data.dislikes || 0);
                }
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        };

        fetchLikes();
    }, [movie.episode]);

    const handleLike = async () => {
        if (!isAuthenticated) return;

        try {
            const res = await fetch('/api/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    movieId: movie.episode,
                    type: 'like',
                }),
            });

            if (res.ok) {

                const countRes = await fetch(`/api/likes?movieId=${movie.episode}`);
                if (countRes.ok) {
                    const data = await countRes.json();
                    setLikes(data.likes || 0);
                    setDislikes(data.dislikes || 0);
                }
            }
        } catch (error) {
            console.error('Error liking:', error);
        }
    };

    const handleDislike = async () => {
        if (!isAuthenticated) return;

        try {
            const res = await fetch('/api/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    movieId: movie.episode,
                    type: 'dislike',
                }),
            });

            if (res.ok) {
                const countRes = await fetch(`/api/likes?movieId=${movie.episode}`);
                if (countRes.ok) {
                    const data = await countRes.json();
                    setLikes(data.likes || 0);
                    setDislikes(data.dislikes || 0);
                }
            }
        } catch (error) {
            console.error('Error disliking:', error);
        }
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

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
                    <button
                        onClick={handleLike}
                        disabled={!isAuthenticated}
                        title={!isAuthenticated ? 'Sign in to like' : ''}
                        className={!isAuthenticated ? styles.disabled : ''}
                    >
                        Like ({likes})
                    </button>
                    <button
                        onClick={handleDislike}
                        disabled={!isAuthenticated}
                        title={!isAuthenticated ? 'Sign in to dislike' : ''}
                        className={!isAuthenticated ? styles.disabled : ''}
                    >
                        Dislike ({dislikes})
                    </button>
                </div>
                {!isAuthenticated && (
                    <p className={styles.authMessage}>Sign in to like/dislike</p>
                )}
                <Link href={`/movie/${movie.episode}`}>
                    <button className={styles.moreBtn}>
                        More...
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default MovieCard;
