import React, { useState } from 'react';
import { relatorioService } from '../../services/api';
import '../../styles/modalcadaero.css'; 

function ModalGeraRelatorio({ onClose, aeronaveId }) {
  const [formData, setFormData] = useState({ titulo: '', descricao: '' });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  const getUsuarioId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('aerocodeUser'));
      return user?.id || 1;
    } catch { return 1; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setStatusMessage('');
    try {
      setLoading(true);
      setStatusMessage('Gerando relatório...');
      const res = await relatorioService.criar({
        titulo: formData.titulo,
        descricao: formData.descricao,
        aeronaveId: String(aeronaveId),
        usuarioId: String(getUsuarioId())
      });
      
      const pdf = await relatorioService.downloadPDF(res.data.id);
      const url = window.URL.createObjectURL(new Blob([pdf.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Relatorio_${formData.titulo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      onClose();
    } catch (err) {
      setError('Falha ao gerar relatório.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={() => !loading && onClose()}></div>
      <div className="modal-drawer">
        <h2>Gerar Relatório Técnico</h2>
        {error && <div className="error-message">{error}</div>}
        {statusMessage && <div className="info-message">{statusMessage}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} placeholder="Ex: Relatório Final" required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} rows={5} placeholder="Detalhes técnicos..." required disabled={loading} style={{resize:'vertical'}} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Processando...' : 'Gerar PDF'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
export default ModalGeraRelatorio;