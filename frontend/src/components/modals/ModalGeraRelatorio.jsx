import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/modalgerarelatorio.css';

function ModalGeraRelatorio({ onClose, aeronaveId }) {
  const [tipoRelatorio, setTipoRelatorio] = useState('completo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGerar = async () => {
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3000/api/relatorios/gerar/${aeronaveId}`,
        {
          params: { tipo: tipoRelatorio },
          responseType: 'blob',
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      
      // Cria um blob e faz download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${tipoRelatorio}-aeronave-${aeronaveId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert('Documento gerado com sucesso!');
      onClose();
    } catch (err) {
      console.error('Erro ao gerar documento:', err);
      setError('Erro ao gerar documento. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relatorio-modal-overlay" onClick={() => !loading && onClose()}></div>

      <div className="relatorio-modal-container">
        <div className="relatorio-modal-header">
          <div className="relatorio-modal-title">
            <div className="relatorio-icon">📄</div>
            Gerar Documento
          </div>
          <p className="relatorio-modal-subtitle">
            Escolha o tipo de documento para gerar
          </p>
          <button className="relatorio-close-button" onClick={() => !loading && onClose()}>
            ×
          </button>
        </div>

        <div className="relatorio-modal-body">
          {error && <div className="input-error">{error}</div>}

          <div className="relatorio-info">
            <h3>Sobre o Documento</h3>
            <p>
              O documento será gerado em formato PDF com todas as informações
              selecionadas do veículo.
            </p>
          </div>

          <div className="relatorio-options">
            <label className="relatorio-option">
              <input
                type="radio"
                name="tipoRelatorio"
                value="completo"
                checked={tipoRelatorio === 'completo'}
                onChange={(e) => setTipoRelatorio(e.target.value)}
                disabled={loading}
              />
              <div className="relatorio-option-label">
                <div className="relatorio-option-title">Documento Completo</div>
                <div className="relatorio-option-description">
                  Inclui todas as informações, fases, componentes e validações
                </div>
              </div>
            </label>

            <label className="relatorio-option">
              <input
                type="radio"
                name="tipoRelatorio"
                value="resumido"
                checked={tipoRelatorio === 'resumido'}
                onChange={(e) => setTipoRelatorio(e.target.value)}
                disabled={loading}
              />
              <div className="relatorio-option-label">
                <div className="relatorio-option-title">Documento Resumido</div>
                <div className="relatorio-option-description">
                  Apenas informações básicas e status atual
                </div>
              </div>
            </label>

            <label className="relatorio-option">
              <input
                type="radio"
                name="tipoRelatorio"
                value="tecnico"
                checked={tipoRelatorio === 'tecnico'}
                onChange={(e) => setTipoRelatorio(e.target.value)}
                disabled={loading}
              />
              <div className="relatorio-option-label">
                <div className="relatorio-option-title">Documento Técnico</div>
                <div className="relatorio-option-description">
                  Especificações técnicas detalhadas e validações
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="relatorio-modal-footer">
          <button
            type="button"
            className="relatorio-button relatorio-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="relatorio-button relatorio-btn-submit"
            onClick={handleGerar}
            disabled={loading}
          >
            {loading ? 'Gerando...' : 'Gerar Documento'}
          </button>
        </div>
      </div>
    </>
  );
}

export default ModalGeraRelatorio;
