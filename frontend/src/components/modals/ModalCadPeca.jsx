import React, { useState } from 'react';
import { pecaService } from '../../services/api';
import '../../styles/modalcadpeca.css';

function ModalCadPeca({ onClose, aeronaveId, codigoVisivel }) {
  const [formData, setFormData] = useState({
    nome: '',
    fornecedor: '',
    tipo: 'NACIONAL',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await pecaService.criar({
        ...formData,
        aeronaveId: parseInt(aeronaveId),
      });
      alert('Componente adicionado com sucesso!');
      onClose();
    } catch (err) {
      console.error('Erro ao cadastrar componente:', err);
      setError(err.response?.data?.error || 'Erro ao cadastrar componente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="peca-modal-overlay" onClick={() => !loading && onClose()}></div>

      <div className="peca-modal-container">
        <div className="peca-modal-header">
          <div className="peca-modal-title">
            <div className="peca-icon">🔧</div>
            Adicionar Componente
          </div>
          <p className="peca-modal-subtitle">
            Veículo: {codigoVisivel}
          </p>
          <button className="peca-close-button" onClick={() => !loading && onClose()}>
            ×
          </button>
        </div>

        <div className="peca-modal-body">
          {error && <div className="input-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="peca-form-group">
              <label className="peca-label">
                Nome do Componente <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                name="nome"
                className="peca-input"
                placeholder="Ex: Motor V8"
                value={formData.nome}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="peca-form-group">
              <label className="peca-label">
                Distribuidor <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                name="fornecedor"
                className="peca-input"
                placeholder="Ex: Auto Parts Inc"
                value={formData.fornecedor}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="peca-form-group">
              <label className="peca-label">
                Origem <span className="required-mark">*</span>
              </label>
              <select
                name="tipo"
                className="peca-select"
                value={formData.tipo}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="NACIONAL">Nacional</option>
                <option value="IMPORTADA">Importada</option>
              </select>
            </div>
          </form>
        </div>

        <div className="peca-modal-footer">
          <button
            type="button"
            className="peca-button peca-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="peca-button peca-btn-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Adicionar Componente'}
          </button>
        </div>
      </div>
    </>
  );
}

export default ModalCadPeca;
