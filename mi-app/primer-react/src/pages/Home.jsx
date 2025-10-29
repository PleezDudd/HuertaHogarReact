import React from 'react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section id="inicio" className="hero">
        <div className="container hero-inner">
          <h1>
            ¡Descubre la frescura del campo con <span>HuertoHogar</span>!
          </h1>
          <p>Conéctate con la naturaleza y lleva lo mejor del campo a tu mesa.</p>
          <Link to="/productos" className="btn btn-primary">Explorar Catálogo</Link>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="info">
        <div className="container info-grid">
          <article className="card">
            <h2>Misión</h2>
            <p>
              Proporcionar productos frescos y de calidad directamente desde el campo hasta la puerta de nuestros
              clientes, fomentando la conexión con agricultores locales y prácticas sostenibles.
            </p>
          </article>
          <article className="card">
            <h2>Visión</h2>
            <p>
              Ser la tienda online líder en productos frescos y naturales en Chile, destacando por calidad, servicio y
              compromiso con la sostenibilidad, expandiendo nuestra presencia nacional e internacional.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Home;