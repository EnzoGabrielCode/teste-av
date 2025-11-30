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
      setError('Selecione a etapa e o funcionário.');
      return;
    }

    try {
      setLoading(true);
      await etapaService.associarFuncionario(
        parseInt(formData.etapaId),
        parseInt(formData.funcionarioId)
      );
      alert('Funcionário associado com sucesso!');
      onClose();
    } catch (err) {
      console.error('Erro ao associar:', err);
      setError(err.response?.data?.error || 'Erro ao associar funcionário');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <>
        <div className="modal-overlay"></div>
        <aside className="modal-drawer">
          <div className="loading" style={{color:'#e5e7eb'}}>Carregando dados...</div>
        </aside>
      </>
    );
  }

  return (
    <>
      <div className="modal-overlay" onClick={() => !loading && onClose()}></div>

      <aside className="modal-drawer">
        <header className="modal-header">
          <h2>Associar Funcionário</h2>
          <p>Vincule um colaborador a uma etapa.</p>
        </header>

        {error && <div className="error-message">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Etapa</label>
            <select
              name="etapaId"
              value={formData.etapaId}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Selecione uma etapa</option>
              {etapas.map((etapa) => (
                <option key={etapa.id} value={etapa.id}>
                  {etapa.nome} ({etapa.status})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Funcionário</label>
            <select
              name="funcionarioId"
              value={formData.funcionarioId}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Selecione um funcionário</option>
              {funcionarios.map((func) => (
                <option key={func.id} value={func.id}>
                  {func.nome} ({func.nivelPermissao})
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading ? 'Associando...' : 'Associar'}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}

export default ModalAssocFuncionario;