'use client';

import React, { useState } from 'react';
import styles from './CommentSection.module.css';

const CommentSection = () => {
    const [comments, setComments] = useState([]);
    const [name, setName] = useState('');
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && text) {
            setComments([...comments, { name, text }]);
            setName('');
            setText('');
        }
    };

    return (
        <div className={styles.comments}>
            <h5>Comments</h5>
            <ul className={styles.list}>
                {comments.map((c, i) => (
                    <li key={i}><strong>{c.name}:</strong> {c.text}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                />
                <textarea
                    placeholder="Your Comment"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={styles.textarea}
                />
                <button type="submit" className={styles.button}>Add Comment</button>
            </form>
        </div>
    );
};

export default CommentSection;
