import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/styles.css';

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sesionActiva = localStorage.getItem('sesionActiva');
    const usuarioRaw = localStorage.getItem('usuarioActual');

    if (!sesionActiva || !usuarioRaw) {
      navigate('/registro', { replace: true });
      return;
    }

    try {
      const parsed = JSON.parse(usuarioRaw);
      setUser(parsed);
    } catch {
      // si guardaste solo un string (ej: el correo), muéstralo
      setUser({ nombre: usuarioRaw, email: usuarioRaw, rol: 'usuario' });
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('usuarioActual');
    navigate('/registro', { replace: true });
  };

  if (!user) return null;

  const roleClass =
    user.rol && user.rol.toLowerCase() === 'administrador'
      ? 'role-badge administrador'
      : 'role-badge usuario';

  return (
    <main className="container de perfil main-content">
      <h2>Perfil de Usuario</h2>

      <img
        id="img-prof"
        className="img-profile"
        src={user.foto || '/img/perfil.jpg'}
        alt="Imagen de perfil"
      />

      <section className="profile-data">
        <div className="profile-field">
          <label>Nombre</label>
          <span>{user.nombre || 'Sin nombre'}</span>
        </div>
        <div className="profile-field">
          <label>Email</label>
          <span>{user.email || 'sin-correo@ejemplo.com'}</span>
        </div>
        <div className="profile-field">
          <label>Rol</label>
          <span className={roleClass}>
            {user.rol ? user.rol : 'Usuario'}
          </span>
        </div>
      </section>

      <div className="profile-actions">
        <button type="button" className="btn btn-outline" onClick={() => alert('Editar perfil no implementado')}>
          Editar perfil
        </button>
        {user.rol && user.rol.toLowerCase() === 'admin' && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/admin')}
            style={{ marginLeft: 8 }}
          >
            Ir al panel de Administración
          </button>
        )}
        <button type="button" className="btn btn-danger" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}

export default Profile;