import React from 'react';
import styles from './Shell.module.css';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logo}>JEE PULSE</div>
        <nav className={styles.nav}>
          <button className={styles.navItem}>TEST</button>
          <button className={styles.navItem}>ANALYZE</button>
          <button className={styles.navItem}>STUDY</button>
          <button className={styles.navItem}>LIBRARY</button>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
};
