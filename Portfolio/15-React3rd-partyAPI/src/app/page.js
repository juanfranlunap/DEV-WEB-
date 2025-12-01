'use client';

import MovieList from '../components/MovieList';
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 style={{ textAlign: 'center', color: 'black', marginBottom: '2rem' }}>Star Wars Movies</h1>
        <MovieList />
      </main>
    </div>
  );
}
