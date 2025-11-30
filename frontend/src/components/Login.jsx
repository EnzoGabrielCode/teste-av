import React, { useState } from 'react';
import '../styles/login.css';
import { authService } from '../services/api';

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(usuario, senha);
      const { token, funcionario } = response.data;
      
      onLogin({
        id: funcionario.id,
        nome: funcionario.nome,
        usuario: funcionario.usuario,
        nivelPermissao: funcionario.nivelPermissao,
        nivel: funcionario.nivelPermissao.toLowerCase(),
        permissao: funcionario.nivelPermissao.toLowerCase(),
        token,
      });
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        Aero<span>Code</span>
      </div>

      <div className="form-wrapper">
        <h2>Sistema de Gestão de Aeronaves</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuário</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
