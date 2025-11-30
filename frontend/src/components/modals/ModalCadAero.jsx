import React, { useState } from 'react';
import { aeronaveService } from '../../services/api';
import '../../styles/modalcadaero.css'; 

function ModalCadAero({ onClose }) {
  const [formData, setFormData] = useState({
    codigo: '', modelo: '', fabricante: '', tipo: 'COMERCIAL',
    anoFabricacao: '', capacidade: '', kmAtual: '', status: 'EM_MANUTENCAO', alcance: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        anoFabricacao: parseInt(formData.anoFabricacao),
        capacidade: parseInt(formData.capacidade),
        kmAtual: parseInt(formData.kmAtual),
        alcance: parseFloat(formData.alcance),
      };
      await aeronaveService.criar(payload);
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={() => !loading && onClose()}></div>
      <div className="modal-drawer">
        <h2>Cadastrar Aeronave</h2>
        {error && <div className="error-message">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Código</label>
              <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} placeholder="Ex: PT-XYZ" required />
            </div>
            <div className="form-group">
              <label>Modelo</label>
              <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} placeholder="Ex: Boeing 737" required />
            </div>
          </div>

          <div className="form-group">
            <label>Fabricante</label>
            <input type="text" name="fabricante" value={formData.fabricante} onChange={handleChange} placeholder="Ex: Boeing" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="COMERCIAL">Comercial</option>
                <option value="MILITAR">Militar</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ano</label>
              <input type="number" name="anoFabricacao" value={formData.anoFabricacao} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Capacidade</label>
              <input type="number" name="capacidade" value={formData.capacidade} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>KM Atual</label>
              <input type="number" name="kmAtual" value={formData.kmAtual} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Alcance (km)</label>
              <input type="number" step="0.1" name="alcance" value={formData.alcance} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="EM_MANUTENCAO">Em Manutenção</option>
                <option value="EM_PRODUCAO">Em Produção</option>
                <option value="CONCLUIDA">Concluída</option>
              </select>
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
export default ModalCadAero;