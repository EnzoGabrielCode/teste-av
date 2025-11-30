import React, { useState } from 'react';
import { testeService } from '../../services/api';
import '../../styles/modalregistrateste.css';

function ModalRegistraTeste({ onClose, aeronaveId }) {
  const [formData, setFormData] = useState({
    tipo: '',
    resultado: 'APROVADO',
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

    if (!formData.tipo) {
      setError('Por favor, selecione um tipo de validação');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        tipo: formData.tipo,
        resultado: formData.resultado,
        aeronaveId: parseInt(aeronaveId),
      };
      
      await testeService.criar(payload);
      alert('Validação registrada com sucesso!');
      onClose();
    } catch (err) {
      console.error('Erro completo:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Erro ao registrar validação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="teste-modal-overlay" onClick={() => !loading && onClose()}></div>

      <div className="teste-modal-container">
        <div className="teste-modal-header">
          <div className="teste-modal-title">
            <div className="teste-icon">🔬</div>
            Registrar Validação
          </div>
          <p className="teste-modal-subtitle">
            Registre os resultados da validação técnica
          </p>
          <button className="teste-close-button" onClick={() => !loading && onClose()}>
            ×
          </button>
        </div>

        <div className="teste-modal-body">
          {error && <div className="input-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="teste-form-group">
              <label className="teste-label">
                Tipo de Validação <span className="required-mark">*</span>
              </label>
              <select
                name="tipo"
                className="teste-select"
                value={formData.tipo}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Selecione um tipo</option>
                <option value="ELETRICO">Teste Elétrico</option>
                <option value="HIDRAULICO">Teste Hidráulico</option>
                <option value="AERODINAMICO">Teste Aerodinâmico</option>
              </select>
            </div>

            <div className="teste-form-group">
              <label className="teste-label">
                Resultado <span className="required-mark">*</span>
              </label>
              <select
                name="resultado"
                className="teste-select"
                value={formData.resultado}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="APROVADO">Aprovado</option>
                <option value="REPROVADO">Reprovado</option>
              </select>
            </div>
          </form>
        </div>

        <div className="teste-modal-footer">
          <button
            type="button"
            className="teste-button teste-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="teste-button teste-btn-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Registrar Validação'}
          </button>
        </div>
      </div>
    </>
  );
}

export default ModalRegistraTeste;
