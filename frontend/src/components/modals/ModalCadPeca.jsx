import React, { useState } from 'react';
import '../../styles/modalcadaero.css';  
import { pecaService } from '../../services/api'; 

function ModalCadPeca({ onClose, codigoVisivel, aeronaveId }) {
  const [formData, setFormData] = useState({ nomePeca: '', tipo: 'NACIONAL', fornecedor: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aeronaveId) return alert('Erro: ID da aeronave ausente');
    try {
      setLoading(true);
      await pecaService.criar({
        nome: formData.nomePeca,
        tipo: formData.tipo,
        fornecedor: formData.fornecedor,
        aeronaveId: Number(aeronaveId),
      });
      onClose();
    } catch (error) {
      alert('Erro ao salvar peça.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-drawer">
        <h2>Adicionar Peça</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Aeronave</label>
            <input type="text" value={codigoVisivel} disabled style={{opacity: 0.7}} />
          </div>
          <div className="form-group">
            <label>Nome da Peça</label>
            <input type="text" value={formData.nomePeca} onChange={e => setFormData({...formData, nomePeca: e.target.value})} placeholder="Ex: Altímetro" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                <option value="NACIONAL">Nacional</option>
                <option value="IMPORTADA">Importada</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fornecedor</label>
              <input type="text" value={formData.fornecedor} onChange={e => setFormData({...formData, fornecedor: e.target.value})} placeholder="Ex: Embraer" required />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
export default ModalCadPeca;