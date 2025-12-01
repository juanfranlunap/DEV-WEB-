'use client';

import MovieList from '../components/MovieList';
import AuthButton from '../components/AuthButton';
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ textAlign: 'center', color: 'black', margin: 0, flex: 1 }}>Star Wars Movies</h1>
          <AuthButton />
        </div>
        <MovieList />
      </main>
    </div>
  );
}
