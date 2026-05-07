import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.mensaje || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2><i className="fas fa-lock"></i> Iniciar Sesión</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-alert">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          
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
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={cargando}>
            <i className="fas fa-sign-in-alt"></i> {cargando ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="auth-link">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;