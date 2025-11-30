import React, { useState, useEffect } from 'react';
import { funcionarioService } from '../services/api';
import ModalCadFuncionario from '../components/modals/ModalCadFuncionario';
import '../styles/funcionarios.css';
import { MdPersonAdd, MdDelete } from 'react-icons/md';

function FuncionarioAdmin() {
  const [showModal, setShowModal] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      setLoading(true);
      const response = await funcionarioService.listar();
      setFuncionarios(response.data);
    } catch (err) {
      console.error('Erro ao carregar funcionários:', err);
      setError('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const excluirFuncionario = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      return;
    }

    try {
      await funcionarioService.deletar(id);
      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
      alert('Funcionário excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir funcionário:', err);
      alert('Erro ao excluir funcionário');
    }
  };

  const handleModalClose = (novoFuncionario) => {
    setShowModal(false);
    if (novoFuncionario) {
      carregarFuncionarios();
    }
  };

  if (loading) {
    return (
      <div className="funcionario-page">
        <div className="funcionario-loading">Carregando funcionários...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="funcionario-page">
        <div className="funcionario-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="funcionario-page">
      <header className="funcionario-header">
        <div>
          <h1>Gestão de Funcionários</h1>
          <p className="funcionario-subtitle">
            Gerencie usuários, níveis de permissão e acessos ao sistema.
          </p>
        </div>

        <div className="funcionario-header-actions">
          <button
            className="funcionario-btn-primary"
            onClick={() => setShowModal(true)}
          >
            <MdPersonAdd />
            <span>Novo Funcionário</span>
          </button>
        </div>
      </header>

      <main className="funcionario-main">
        <section className="funcionario-table-section">
          <div className="funcionario-section-header">
            <h2>Lista de Funcionários</h2>
            <span className="funcionario-section-badge">
              Total: {funcionarios.length || 0}
            </span>
          </div>

          <div className="funcionario-table-wrapper">
            <table className="funcionario-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Usuário</th>
                  <th>Nível</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="funcionario-empty-row">
                      Nenhum funcionário cadastrado.
                    </td>
                  </tr>
                ) : (
                  funcionarios.map((func) => (
                    <tr key={func.id}>
                      <td>{func.id}</td>
                      <td>{func.nome}</td>
                      <td>{func.telefone}</td>
                      <td>{func.usuario}</td>
                      <td
                        className={`funcionario-nivel-badge funcionario-nivel-${func.nivelPermissao?.toLowerCase()}`}
                      >
                        {func.nivelPermissao}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="funcionario-btn-danger-soft"
                          onClick={() => excluirFuncionario(func.id)}
                        >
                          <MdDelete size={18} />
                          <span>Excluir</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showModal && <ModalCadFuncionario onClose={handleModalClose} />}
    </div>
  );
}

function FuncionarioEngenheiro() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      setLoading(true);
      const response = await funcionarioService.listar();
      const filtrados = response.data.filter(
        (f) =>
          f.nivelPermissao === 'OPERADOR' || f.nivelPermissao === 'ENGENHEIRO'
      );
      setFuncionarios(filtrados);
    } catch (err) {
      console.error('Erro ao carregar funcionários:', err);
      setError('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="funcionario-page">
        <div className="funcionario-loading">Carregando funcionários...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="funcionario-page">
        <div className="funcionario-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="funcionario-page">
      <header className="funcionario-header">
        <div>
          <h1>Funcionários</h1>
          <p className="funcionario-subtitle">
            Visualize os colaboradores operadores e engenheiros.
          </p>
        </div>
      </header>

      <main className="funcionario-main">
        <section className="funcionario-table-section">
          <div className="funcionario-section-header">
            <h2>Lista de Funcionários</h2>
            <span className="funcionario-section-badge">
              Total: {funcionarios.length || 0}
            </span>
          </div>

          <div className="funcionario-table-wrapper">
            <table className="funcionario-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Nível</th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="funcionario-empty-row">
                      Nenhum funcionário encontrado.
                    </td>
                  </tr>
                ) : (
                  funcionarios.map((func) => (
                    <tr key={func.id}>
                      <td>{func.id}</td>
                      <td>{func.nome}</td>
                      <td>{func.telefone}</td>
                      <td
                        className={`funcionario-nivel-badge funcionario-nivel-${func.nivelPermissao?.toLowerCase()}`}
                      >
                        {func.nivelPermissao}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function Funcionario({ user }) {
  if (user.nivel === 'administrador') return <FuncionarioAdmin />;
  if (user.nivel === 'engenheiro') return <FuncionarioEngenheiro />;
  return <div className="funcionario-page">Você não deveria estar aqui.</div>;
}

export default Funcionario;
