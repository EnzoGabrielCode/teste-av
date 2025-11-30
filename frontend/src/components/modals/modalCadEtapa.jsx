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
      setError('Erro ao cadastrar etapa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={() => !loading && onClose()}></div>
      <div className="modal-drawer">
        <h2>Nova Etapa</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome da Etapa</label>
            <input type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Ex: Inspeção Elétrica" required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Prazo Estimado</label>
            <input type="date" value={formData.prazo} onChange={e => setFormData({...formData, prazo: e.target.value})} required disabled={loading} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Etapa'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
export default ModalCadEtapa;