import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aeronaveService } from '../services/api';
import ModalCadAero from './modals/ModalCadAero';
import '../styles/aeronaves.css';

export default function Aeronaves() {
  const [aeronaves, setAeronaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarAeronaves();
  }, []);

  const carregarAeronaves = async () => {
    try {
      setLoading(true);
      const response = await aeronaveService.listar();
      setAeronaves(response.data);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar veículos:', err);
      setError('Erro ao carregar lista de veículos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        await aeronaveService.deletar(id);
        carregarAeronaves();
      } catch (err) {
        alert('Erro ao excluir veículo');
      }
    }
  };

  const handleModalClose = (refresh) => {
    setShowModal(false);
    if (refresh) {
      carregarAeronaves();
    }
  };

  const aeronavesFiltradas = aeronaves.filter((a) =>
    a.modelo.toLowerCase().includes(filtro.toLowerCase()) ||
    a.codigo.toLowerCase().includes(filtro.toLowerCase())
  );

  const getStatusClass = (status) => {
    const statusMap = {
      'EM_MANUTENCAO': 'status-maintenance',
      'EM_PRODUCAO': 'status-production',
      'CONCLUIDA': 'status-completed',
      'CANCELADA': 'status-cancelled'
    };
    return statusMap[status] || 'status-production';
  };

  const getStatusText = (status) => {
    const textMap = {
      'EM_MANUTENCAO': 'Manutenção Ativa',
      'EM_PRODUCAO': 'Em Fabricação',
      'CONCLUIDA': 'Finalizado',
      'CANCELADA': 'Descontinuado'
    };
    return textMap[status] || status;
  };

  if (loading) {
    return (
      <div className="vehicles-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="vehicles-page">
      <div className="page-header">
        <h1 className="page-title">
          <div className="title-icon">🚗</div>
          Gestão de Veículos
        </h1>
        <button className="add-vehicle-btn" onClick={() => setShowModal(true)}>
          + Adicionar Novo
        </button>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Buscar</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Buscar por modelo ou identificador..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {aeronavesFiltradas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚗</div>
          <h3 className="empty-title">Nenhum veículo encontrado</h3>
          <p className="empty-text">Comece adicionando um novo veículo ao sistema</p>
        </div>
      ) : (
        <div className="vehicles-grid">
          {aeronavesFiltradas.map((aeronave) => (
            <div key={aeronave.id} className="vehicle-card">
              <div className="vehicle-header">
                <div className="vehicle-code">{aeronave.codigo}</div>
                <h3 className="vehicle-model">{aeronave.modelo}</h3>
                <div className="vehicle-manufacturer">{aeronave.fabricante}</div>
              </div>

              <div className="vehicle-body">
                <div className="vehicle-info">
                  <div className="info-item">
                    <span className="info-label">Tipo</span>
                    <span className="info-value">{aeronave.tipo}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Ano</span>
                    <span className="info-value">{aeronave.anoFabricacao}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Lotação</span>
                    <span className="info-value">{aeronave.capacidade}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Alcance</span>
                    <span className="info-value">{aeronave.alcance} km</span>
                  </div>
                </div>

                <span className={`vehicle-status ${getStatusClass(aeronave.status)}`}>
                  {getStatusText(aeronave.status)}
                </span>

                <div className="vehicle-actions">
                  <button
                    className="action-btn btn-view"
                    onClick={() => navigate(`/aeronaves/${aeronave.codigo}`)}
                  >
                    Ver Detalhes
                  </button>
                  <button
                    className="action-btn btn-delete"
                    onClick={() => handleDelete(aeronave.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <ModalCadAero onClose={handleModalClose} />}
    </div>
  );
}
