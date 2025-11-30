import React, { useState } from 'react';
import { testeService } from '../../services/api';
import '../../styles/modalcadaero.css';

function ModalRegistraTeste({ onClose, aeronaveId }) {
  const [formData, setFormData] = useState({ tipo: 'ELETRICO', resultado: 'APROVADO' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await testeService.criar({ ...formData, aeronaveId });
      onClose();
    } catch (err) {
      alert('Erro ao registrar teste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={() => !loading && onClose()}></div>
      <div className="modal-drawer">
        <h2>Registrar Teste</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo de Teste</label>
            <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} disabled={loading}>
              <option value="ELETRICO">Elétrico</option>
              <option value="HIDRAULICO">Hidráulico</option>
              <option value="AERODINAMICO">Aerodinâmico</option>
            </select>
          </div>
          <div className="form-group">
            <label>Resultado</label>
            <select value={formData.resultado} onChange={e => setFormData({...formData, resultado: e.target.value})} disabled={loading}>
              <option value="APROVADO">Aprovado</option>
              <option value="REPROVADO">Reprovado</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Salvando...' : 'Registrar'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
export default ModalRegistraTeste;