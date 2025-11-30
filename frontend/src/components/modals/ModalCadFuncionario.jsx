import React, { useState } from 'react';
import { funcionarioService } from '../../services/api';
import '../../styles/modalcadfuncionario.css';

function ModalCadFuncionario({ onClose }) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    usuario: '',
    senha: '',
    nivelPermissao: 'OPERADOR',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telefone') {
      const apenasNumeros = value.replace(/\D/g, '');
      let telefoneFormatado = apenasNumeros;

      if (apenasNumeros.length > 0) {
        telefoneFormatado = `(${apenasNumeros.substring(0, 2)}`;
      }
      if (apenasNumeros.length >= 3) {
        telefoneFormatado += `) ${apenasNumeros.substring(2, 7)}`;
      }
      if (apenasNumeros.length >= 8) {
        telefoneFormatado += `-${apenasNumeros.substring(7, 11)}`;
      }

      setFormData({ ...formData, telefone: telefoneFormatado });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const telefoneNumeros = formData.telefone.replace(/\D/g, '');
    if (telefoneNumeros.length !== 11) {
      setError('O contato deve ter 11 dígitos (DDD + 9 dígitos)');
      return;
    }

    try {
      setLoading(true);

      const novoFuncionario = {
        nome: formData.nome,
        telefone: formData.telefone,
        endereco: formData.endereco,
        usuario: formData.usuario,
        senha: formData.senha,
        nivelPermissao: formData.nivelPermissao,
      };

      await funcionarioService.criar(novoFuncionario);
      alert('Colaborador cadastrado com sucesso!');
      onClose(true);
    } catch (err) {
      console.error('Erro ao cadastrar colaborador:', err);
      setError(err.response?.data?.error || 'Erro ao cadastrar colaborador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="employee-modal-overlay" onClick={() => !loading && onClose(false)}></div>

      <div className="employee-modal-container">
        <div className="employee-modal-header">
          <div className="employee-modal-title">
            <div className="employee-icon">👤</div>
            Cadastro de Colaborador
          </div>
          <p className="employee-modal-subtitle">Adicione um novo membro à equipe</p>
          <button className="employee-close-button" onClick={() => !loading && onClose(false)}>×</button>
        </div>

        <div className="employee-modal-body">
          {error && <div className="input-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="employee-form-grid">
              <div className="employee-form-group full-width">
                <label className="employee-label">Nome Completo <span className="required-mark">*</span></label>
                <input
                  type="text"
                  name="nome"
                  className="employee-input"
                  placeholder="Ex: João Silva"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="employee-form-group">
                <label className="employee-label">Contato <span className="required-mark">*</span></label>
                <input
                  type="text"
                  name="telefone"
                  className="employee-input"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={handleChange}
                  maxLength="15"
                  required
                  disabled={loading}
                />
              </div>

              <div className="employee-form-group">
                <label className="employee-label">Localização <span className="required-mark">*</span></label>
                <input
                  type="text"
                  name="endereco"
                  className="employee-input"
                  placeholder="Ex: Rua das Flores, 123"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="employee-form-group">
                <label className="employee-label">Login <span className="required-mark">*</span></label>
                <input
                  type="text"
                  name="usuario"
                  className="employee-input"
                  placeholder="Ex: joaosilva"
                  value={formData.usuario}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="employee-form-group">
                <label className="employee-label">Chave de Acesso <span className="required-mark">*</span></label>
                <input
                  type="password"
                  name="senha"
                  className="employee-input"
                  placeholder="Digite uma senha (mínimo 6 caracteres)"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  minLength="6"
                  disabled={loading}
                />
              </div>

              <div className="employee-form-group full-width">
                <label className="employee-label">Tipo de Acesso <span className="required-mark">*</span></label>
                <div className="permission-selector">
                  <div 
                    className={`permission-card ${formData.nivelPermissao === 'OPERADOR' ? 'selected' : ''}`}
                    onClick={() => !loading && setFormData({...formData, nivelPermissao: 'OPERADOR'})}
                  >
                    <div className="permission-icon">🔧</div>
                    <div className="permission-name">Assistente</div>
                    <div className="permission-description">Operações básicas</div>
                  </div>
                  <div 
                    className={`permission-card ${formData.nivelPermissao === 'ENGENHEIRO' ? 'selected' : ''}`}
                    onClick={() => !loading && setFormData({...formData, nivelPermissao: 'ENGENHEIRO'})}
                  >
                    <div className="permission-icon">⚙️</div>
                    <div className="permission-name">Técnico</div>
                    <div className="permission-description">Acesso avançado</div>
                  </div>
                  <div 
                    className={`permission-card ${formData.nivelPermissao === 'ADMINISTRADOR' ? 'selected' : ''}`}
                    onClick={() => !loading && setFormData({...formData, nivelPermissao: 'ADMINISTRADOR'})}
                  >
                    <div className="permission-icon">👑</div>
                    <div className="permission-name">Gestor</div>
                    <div className="permission-description">Controle total</div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="employee-modal-footer">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="employee-button employee-btn-cancel"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="employee-button employee-btn-submit"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Colaborador'}
          </button>
        </div>
      </div>
    </>
  );
}

export default ModalCadFuncionario;
