import React, { useEffect } from 'react';

export const Nosotros = () => {
  useEffect(() => {
    document.title = 'Nosotros | HuertoHogar';
  }, []);

  return (
    <main>
      {/* Mapa / Presencia */}
      <section id="mapa" className="mapa">
        <div className="container mapa-wrap">
          <div>
            <h2>Nuestras tiendas y cobertura</h2>
            <p>
              Operamos en: Santiago, Puerto Montt, Villarrica, Nacimiento, Viña del Mar,
              Valparaíso y Concepción.
            </p>
            <ul className="ciudades">
              <li>Santiago</li>
              <li>Puerto Montt</li>
              <li>Villarrica</li>
              <li>Nacimiento</li>
              <li>Viña del Mar</li>
              <li>Valparaíso</li>
              <li>Concepción</li>
            </ul>
          </div>

          {/* Placeholder de mapa (reemplaza por un iframe si quieres) */}
          <div className="map-placeholder" role="img" aria-label="Mapa de presencia de tiendas">
            Mapa
          </div>
        </div>
      </section>
    </main>
  );
};

export default Nosotros;