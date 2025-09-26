import React from 'react';
import Footer404 from '../../components/footer404/footer404';
import styles from './notFound.module.css';
import kiwiTextIcon from '../../assets/kiwiTextIcon.svg';


const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <img src={kiwiTextIcon} alt="kiwi" />
            <div className={styles.navLinks}>
                <a href="https://kiwipay.lat/">Para Pacientes</a>
                <a href="https://kiwipay.lat/clinicas">Para Clínicas</a>
                <a href="https://kiwipay.lat/quienessomos">Quiénes somos</a>
                <a id={styles.linkComienza} href="https://kiwipay.lat/web">Comienza ahora</a>
            </div>
        </div>
        <div>
            <p>No pudimos encontrar la página que buscabas. Esto puede ser porque:</p>
            <ul>
                <li>Hay un error en la URL que escribiste en el navegador web. Comprueba la URL e inténtalo de nuevo.</li>
                <li>La página que estás buscando cambió de ubicación o fue eliminada.</li>
            </ul>
            <p>Para volver a tu página de inicio haz clic aquí, o puedes intentar buscar el contenido que deseas aquí.</p>
        </div>
      <Footer404 />
    </div>
  );
};

export default NotFound;
