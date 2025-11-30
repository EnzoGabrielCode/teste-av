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
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">SG</div>
          <h1 className="login-title">Bem-vindo</h1>
          <p className="login-subtitle">Sistema de Gestão Integrada</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="field-label">Usuário</label>
            <input
              type="text"
              className="field-input"
              placeholder="Digite seu usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label className="field-label">Senha</label>
            <input
              type="password"
              className="field-input"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="remember-forgot">
            <div className="remember-checkbox">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" className="remember-label">Lembrar-me</label>
            </div>
            <a href="#" className="forgot-link">Esqueceu a senha?</a>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="divider">ou</div>

        <div className="signup-link">
          Não tem uma conta? <a href="#">Entre em contato</a>
        </div>
      </div>
    </div>
  );
}
