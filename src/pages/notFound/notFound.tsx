import React from 'react';
import Footer404 from '../../components/footer404/footer404';
import styles from './notFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Página no encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Footer404 />
    </div>
  );
};

export default NotFound;
