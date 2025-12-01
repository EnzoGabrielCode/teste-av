import React, { useState, useEffect } from 'react';
import { funcionarioService } from '../services/api';
import ModalCadFuncionario from './modals/ModalCadFuncionario';
import '../styles/funcionarios.css';

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroPermissao, setFiltroPermissao] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('aerocodeUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsuarioLogado(parsedUser);
      } catch (error) {
        console.error('Erro ao ler dados do usuário:', error);
      }
    }
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      setLoading(true);
      const response = await funcionarioService.listar();
      setFuncionarios(response.data);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar colaboradores:', err);
      setError('Erro ao carregar lista de colaboradores');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert('Apenas administradores podem excluir colaboradores');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
      try {
        await funcionarioService.deletar(id);
        carregarFuncionarios();
      } catch (err) {
        alert('Erro ao excluir colaborador');
      }
    }
  };

  const handleModalClose = (refresh) => {
    setShowModal(false);
    if (refresh) {
      carregarFuncionarios();
    }
  };

  const handleAddClick = () => {
    if (!isAdmin) {
      alert('Apenas administradores podem cadastrar novos colaboradores');
      return;
    }
    setShowModal(true);
  };

  const funcionariosFiltrados = funcionarios.filter((f) => {
    const matchBusca = f.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       f.usuario.toLowerCase().includes(busca.toLowerCase());
    const matchPermissao = !filtroPermissao || f.nivelPermissao === filtroPermissao;
    return matchBusca && matchPermissao;
  });

  const getPermissaoClass = (permissao) => {
    const map = {
      'ADMINISTRADOR': 'permission-admin',
      'ENGENHEIRO': 'permission-engineer',
      'OPERADOR': 'permission-operator'
    };
    return map[permissao] || 'permission-operator';
  };

  const getPermissaoText = (permissao) => {
    const map = {
      'ADMINISTRADOR': 'Gestor',
      'ENGENHEIRO': 'Técnico',
      'OPERADOR': 'Assistente'
    };
    return map[permissao] || permissao;
  };

  const isAdmin = usuarioLogado?.nivelPermissao === 'ADMINISTRADOR';

  if (loading) {
    return (
      <div className="employees-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="employees-page">
      <div className="employees-header">
        <h1 className="employees-title">
          <div className="employees-icon">👥</div>
          Gestão de Colaboradores
        </h1>
        {isAdmin && (
          <button className="add-employee-btn" onClick={handleAddClick}>
            + Adicionar Colaborador
          </button>
        )}
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nome ou usuário..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select
          className="filter-permission"
          value={filtroPermissao}
          onChange={(e) => setFiltroPermissao(e.target.value)}
        >
          <option value="">Todos os acessos</option>
          <option value="ADMINISTRADOR">Gestor</option>
          <option value="ENGENHEIRO">Técnico</option>
          <option value="OPERADOR">Assistente</option>
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="employees-table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Nome Completo</th>
              <th>Contato</th>
              <th>Localização</th>
              <th>Usuário</th>
              <th>Tipo de Acesso</th>
              {isAdmin && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {funcionariosFiltrados.map((func) => (
              <tr key={func.id}>
                <td>
                  <div className="employee-name">{func.nome}</div>
                </td>
                <td>
                  <div className="employee-info">{func.telefone}</div>
                </td>
                <td>
                  <div className="employee-info">{func.endereco}</div>
                </td>
                <td>
                  <div className="employee-info">{func.usuario}</div>
                </td>
                <td>
                  <span className={`permission-badge ${getPermissaoClass(func.nivelPermissao)}`}>
                    {getPermissaoText(func.nivelPermissao)}
                  </span>
                </td>
                {isAdmin && (
                  <td>
                    <div className="table-actions">
                      <button
                        className="icon-btn btn-delete-employee"
                        onClick={() => handleDelete(func.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <ModalCadFuncionario onClose={handleModalClose} />}
    </div>
  );
}
