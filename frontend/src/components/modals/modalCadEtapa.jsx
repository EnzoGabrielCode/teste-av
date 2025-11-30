import React, { useState } from 'react';
import { etapaService } from '../../services/api';
import '../../styles/modalcadetapa.css';

function ModalCadEtapa({ onClose, aeronaveId }) {
  const [formData, setFormData] = useState({ nome: '', prazo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await etapaService.criar({ ...formData, aeronaveId });
      onClose();
    } catch (err) {
      setError('Erro ao cadastrar fase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="phase-modal-overlay" onClick={() => !loading && onClose()}></div>
      <div className="phase-modal-container">
        <div className="phase-modal-header">
          <div className="phase-modal-title">
            <div className="phase-icon">📋</div>
            Nova Fase
          </div>
          <p className="phase-modal-subtitle">Adicione uma nova fase ao cronograma</p>
          <button className="phase-close-button" onClick={() => !loading && onClose()}>×</button>
        </div>

        <div className="phase-modal-body">
          {error && <div className="input-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="phase-form-group">
              <label className="phase-label">Título da Fase <span className="required-mark">*</span></label>
              <input 
                type="text" 
                className="phase-input"
                value={formData.nome} 
                onChange={e => setFormData({...formData, nome: e.target.value})} 
                placeholder="Ex: Inspeção Elétrica" 
                required 
                disabled={loading} 
              />
            </div>

            <div className="phase-form-group">
              <label className="phase-label">Data Limite <span className="required-mark">*</span></label>
              <input 
                type="date" 
                className="phase-input"
                value={formData.prazo} 
                onChange={e => setFormData({...formData, prazo: e.target.value})} 
                required 
                disabled={loading} 
              />
            </div>
          </form>
        </div>

        <div className="phase-modal-footer">
          <button 
            type="button" 
            onClick={onClose} 
            className="phase-button phase-btn-cancel" 
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            className="phase-button phase-btn-submit" 
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Fase'}
          </button>
        </div>
      </div>
    </>
  );
}

export default ModalCadEtapa;
