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
      setError(err.response?.data?.error || 'Erro ao cadastrar veículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={() => !loading && onClose()}></div>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Cadastrar Novo Veículo</h2>
          <p className="modal-subtitle">Preencha as informações do veículo</p>
          <button className="close-button" onClick={() => !loading && onClose()}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="input-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label className="field-label">Identificador <span className="required-mark">*</span></label>
                <input 
                  type="text" 
                  name="codigo" 
                  className="field-input"
                  value={formData.codigo} 
                  onChange={handleChange} 
                  placeholder="Ex: PT-XYZ" 
                  required 
                />
              </div>

              <div className="form-field">
                <label className="field-label">Versão <span className="required-mark">*</span></label>
                <input 
                  type="text" 
                  name="modelo" 
                  className="field-input"
                  value={formData.modelo} 
                  onChange={handleChange} 
                  placeholder="Ex: Boeing 737" 
                  required 
                />
              </div>

              <div className="form-field full-width">
                <label className="field-label">Empresa <span className="required-mark">*</span></label>
                <input 
                  type="text" 
                  name="fabricante" 
                  className="field-input"
                  value={formData.fabricante} 
                  onChange={handleChange} 
                  placeholder="Ex: Boeing" 
                  required 
                />
              </div>

              <div className="form-field">
                <label className="field-label">Categoria <span className="required-mark">*</span></label>
                <select name="tipo" className="field-select" value={formData.tipo} onChange={handleChange}>
                  <option value="COMERCIAL">Passageiros</option>
                  <option value="MILITAR">Defesa</option>
                </select>
              </div>

              <div className="form-field">
                <label className="field-label">Ano de Criação <span className="required-mark">*</span></label>
                <input 
                  type="number" 
                  name="anoFabricacao" 
                  className="field-input"
                  value={formData.anoFabricacao} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-field">
                <label className="field-label">Lotação <span className="required-mark">*</span></label>
                <input 
                  type="number" 
                  name="capacidade" 
                  className="field-input"
                  value={formData.capacidade} 
                  onChange={handleChange} 
                  placeholder="Número de pessoas"
                  required 
                />
              </div>

              <div className="form-field">
                <label className="field-label">Quilometragem <span className="required-mark">*</span></label>
                <input 
                  type="number" 
                  name="kmAtual" 
                  className="field-input"
                  value={formData.kmAtual} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-field">
                <label className="field-label">Distância Máx (km) <span className="required-mark">*</span></label>
                <input 
                  type="number" 
                  step="0.1" 
                  name="alcance" 
                  className="field-input"
                  value={formData.alcance} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-field">
                <label className="field-label">Situação <span className="required-mark">*</span></label>
                <select name="status" className="field-select" value={formData.status} onChange={handleChange}>
                  <option value="EM_MANUTENCAO">Manutenção Ativa</option>
                  <option value="EM_PRODUCAO">Em Fabricação</option>
                  <option value="CONCLUIDA">Finalizado</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="footer-button btn-cancel" disabled={loading}>
            Cancelar
          </button>
          <button type="submit" onClick={handleSubmit} className="footer-button btn-submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Veículo'}
          </button>
        </div>
      </div>
    </>
  );
}

export default ModalCadAero;
