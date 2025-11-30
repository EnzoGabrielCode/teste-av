import React, { useState, useEffect } from 'react';
import { funcionarioService, etapaService } from '../../services/api';
import '../../styles/modalassofun.css';

function ModalAssocFuncionario({ onClose, codigoAeronave }) {
  const [formData, setFormData] = useState({
    etapaId: '',
    funcionarioId: '',
  });
  const [etapas, setEtapas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (codigoAeronave) {
      carregarDados();
    }
  }, [codigoAeronave]);

  const carregarDados = async () => {
    try {
      setLoadingData(true);
      const [etapasRes, funcionariosRes] = await Promise.all([
        etapaService.listarPorAeronaveCodigo(codigoAeronave), 
        funcionarioService.listar(),
      ]);

      setEtapas(etapasRes.data);
      setFuncionarios(funcionariosRes.data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar listas de dados.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.etapaId || !formData.funcionarioId) {
      setError('Selecione a fase e o colaborador.');
      return;
    }

    try {
      setLoading(true);
      await etapaService.associarFuncionario(
        parseInt(formData.etapaId),
        parseInt(formData.funcionarioId)
      );
      alert('Colaborador associado com sucesso!');
      onClose();
    } catch (err) {
      console.error('Erro ao associar:', err);
      setError(err.response?.data?.error || 'Erro ao associar colaborador');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <>
        <div className="assign-modal-overlay"></div>
        <div className="assign-modal-container">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="assign-modal-overlay" onClick={() => !loading && onClose()}></div>

      <div className="assign-modal-container">
        <div className="assign-modal-header">
          <div className="assign-modal-title">
            <div className="assign-icon">🔗</div>
            Associar Colaborador
          </div>
          <p className="assign-modal-subtitle">Vincule um colaborador a uma fase</p>
          <button className="assign-close-button" onClick={() => !loading && onClose()}>×</button>
        </div>

        <div className="assign-modal-body">
          {error && <div className="input-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="search-section">
              <label className="field-label">Fase do Cronograma</label>
              <select
                name="etapaId"
                className="assign-search-input"
                value={formData.etapaId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Selecione uma fase</option>
                {etapas.map((etapa) => (
                  <option key={etapa.id} value={etapa.id}>
                    {etapa.nome} ({etapa.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="search-section">
              <label className="field-label">Colaborador</label>
              <select
                name="funcionarioId"
                className="assign-search-input"
                value={formData.funcionarioId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Selecione um colaborador</option>
                {funcionarios.map((func) => (
                  <option key={func.id} value={func.id}>
                    {func.nome} ({func.nivelPermissao})
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        <div className="assign-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="assign-button assign-btn-cancel"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="assign-button assign-btn-submit"
            disabled={loading}
          >
            {loading ? 'Associando...' : 'Associar'}
          </button>
        </div>
      </div>
    </>
  );
}

export default ModalAssocFuncionario;
