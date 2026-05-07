import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Registro = ({ onSuccess, onSwitchToLogin }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const { registrar } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);

    try {
      await registrar(nombre, email, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.mensaje || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2><i className="fas fa-user-plus"></i> Crear Cuenta</h2>
          <p>Completa el formulario para registrarte</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-alert">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          
          <div className="form-group">
            <label><i className="fas fa-user"></i> Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Tu nombre completo"
            />
          </div>

          <div className="form-group">
            <label><i className="fas fa-envelope"></i> Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label><i className="fas fa-lock"></i> Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-group">
            <label><i className="fas fa-check-circle"></i> Confirmar contraseña</label>
            <input
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
              placeholder="Repite tu contraseña"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={cargando}>
            <i className="fas fa-user-plus"></i> {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        
        <div className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <button onClick={onSwitchToLogin} className="link-button">
            Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registro;