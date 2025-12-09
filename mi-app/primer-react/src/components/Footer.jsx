import React from 'react';
import '../css/styles.css';

export default function Footer() {
  return (
    <footer id="contacto" className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>HuertoHogar</h3>
          <p>Frescura y calidad, directo del campo a tu mesa.</p>
        </div>
        <div>
          <h4>Ayuda</h4>
          <ul>
            <li><a href="#">Preguntas frecuentes</a></li>
            <li><a href="#">Políticas de envío</a></li>
            <li><a href="#">Devoluciones</a></li>
          </ul>
        </div>
        <div>
          <h4>Conecta</h4>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className="copy">© 2025 HuertoHogar. Todos los derechos reservados.</div>
    </footer>
  );
}