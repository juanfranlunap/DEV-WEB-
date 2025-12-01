'use client';

import React from 'react';
import styles from './CharacterDetails.module.css';

const CharacterDetails = ({ character }) => {
    return (
        <div className={styles.details}>
            <div className={styles.info}>
                <img src={`/images/${character.image}`} alt={character.name} className={styles.charImage} />
                <div className={styles.text}>
                    <h4>{character.name}</h4>
                    <p>{character.bio}</p>
                </div>
            </div>
            {/* <CommentSection /> */}
        </div>
    );
};

export default CharacterDetails;
