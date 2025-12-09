import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/styles.css';

export function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return <div>Cargando...</div>;

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
        {user.rol && (user.rol.toLowerCase() === 'admin' || user.rol === 'Admin') && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/admin')}
            style={{ marginLeft: 8 }}
          >
            Ir al panel de Administración
          </button>
        )}
        <button 
          type="button" 
          className="btn btn-danger" 
          onClick={() => {
            logout();
            navigate('/unete');
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}

export default Profile;