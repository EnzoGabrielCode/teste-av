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
      setError('O telefone deve ter 11 dígitos (DDD + 9 dígitos)');
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

      alert('Funcionário cadastrado com sucesso!');
      onClose(true);
    } catch (err) {
      console.error('Erro ao cadastrar funcionário:', err);
      setError(err.response?.data?.error || 'Erro ao cadastrar funcionário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="funcionario-modal-overlay"
        onClick={() => !loading && onClose()}
      ></div>

      <aside className="funcionario-modal-drawer">
        <header className="funcionario-modal-header">
          <h2>Cadastro de Funcionário</h2>
          <p>Preencha os dados para adicionar um novo colaborador ao sistema.</p>
        </header>

        {error && (
          <div className="funcionario-modal-error-message">{error}</div>
        )}

        <form className="funcionario-modal-form" onSubmit={handleSubmit}>
          <div className="funcionario-modal-form-group">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: João Silva"
              value={formData.nome}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="funcionario-modal-form-group">
            <label>Telefone</label>
            <input
              type="text"
              name="telefone"
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChange={handleChange}
              maxLength="15"
              required
              disabled={loading}
            />
          </div>

          <div className="funcionario-modal-form-group">
            <label>Endereço</label>
            <input
              type="text"
              name="endereco"
              placeholder="Ex: Rua das Flores, 123"
              value={formData.endereco}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="funcionario-modal-form-group">
            <label>Usuário</label>
            <input
              type="text"
              name="usuario"
              placeholder="Ex: joaosilva"
              value={formData.usuario}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="funcionario-modal-form-group">
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              placeholder="Digite uma senha (mínimo 6 caracteres)"
              value={formData.senha}
              onChange={handleChange}
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          <div className="funcionario-modal-form-group">
            <label>Nível de Permissão</label>
            <select
              name="nivelPermissao"
              value={formData.nivelPermissao}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="OPERADOR">Operador</option>
              <option value="ENGENHEIRO">Engenheiro</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </div>

          <div className="funcionario-modal-actions">
            <button
              type="button"
              onClick={() => onClose()}
              className="funcionario-btn-modal-cancel"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="funcionario-btn-modal-save"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}

export default ModalCadFuncionario;
