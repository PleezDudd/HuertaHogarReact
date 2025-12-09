import React from 'react';

export const Blog = () => {
  return (
    <div>
      <section id="blog" className="blog">
        <div className="container">
          <h2>Blog: Vida saludable & sostenibilidad</h2>
          <div className="grid-blog">
            <article className="post">
              <h4>Por qué elegir productos locales</h4>
              <p>Reduce tu huella de carbono y apoya a comunidades agrícolas cercanas.</p>
              <a href="#" className="link">Leer más</a>
            </article>
            <article className="post">
              <h4>Recetas con temporada</h4>
              <p>Ideas fáciles para aprovechar frutas y verduras frescas cada semana.</p>
              <a href="#" className="link">Leer más</a>
            </article>
            <article className="post">
              <h4>Qué es la agricultura orgánica</h4>
              <p>Prácticas sostenibles para alimentos más limpios y nutritivos.</p>
              <a href="#" className="link">Leer más</a>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
