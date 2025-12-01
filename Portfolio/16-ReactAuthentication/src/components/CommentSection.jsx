'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './CommentSection.module.css';

const CommentSection = ({ movieId }) => {
    const [comments, setComments] = useState([]);
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const { user, status } = useSelector((state) => state.auth);
    const isAuthenticated = status === 'authenticated';

    React.useEffect(() => {
        if (movieId) {
            fetch(`/api/comments?movieId=${movieId}`)
                .then(res => res.json())
                .then(data => setComments(data));
        }
    }, [movieId]);

    React.useEffect(() => {
        if (isAuthenticated && user) {
            setName(user.name || user.email || '');
        }
    }, [isAuthenticated, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name && text && isAuthenticated) {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ movieId, user: name, text }),
            });
            if (res.ok) {
                const newComment = await res.json();
                setComments([newComment, ...comments]);
                setText('');
            }
        }
    };

    return (
        <div className={styles.comments}>
            <h5>Comments</h5>
            <ul className={styles.list}>
                {comments.map((c, i) => (
                    <li key={i}><strong>{c.user}:</strong> {c.text}</li>
                ))}
            </ul>
            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                        readOnly={user?.name || user?.email}
                    />
                    <textarea
                        placeholder="Your Comment"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className={styles.textarea}
                    />
                    <button type="submit" className={styles.button}>Add Comment</button>
                </form>
            ) : (
                <p className={styles.authMessage}>Sign in to add comments</p>
            )}
        </div>
    );
};

export default CommentSection;
