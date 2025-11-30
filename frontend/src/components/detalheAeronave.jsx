import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/detalheaeronave.css';
import { 
  MdAdd, 
  MdPerson, 
  MdCheck, 
  MdPlayArrow, 
  MdArrowBack, 
  MdBuild, 
  MdAssignment, 
  MdScience, 
  MdDescription, 
  MdSettings,
  MdCheckCircle
} from 'react-icons/md';
import ModalCadEtapa from '../components/modals/modalCadEtapa';
import ModalAssocFuncionario from '../components/modals/ModalAssoFun';
import ModalCadPeca from '../components/modals/ModalCadPeca';
import ModalRegistraTeste from '../components/modals/ModalRegistraTeste';
import ModalGeraRelatorio from '../components/modals/ModalGeraRelatorio';
import { aeronaveService, etapaService, pecaService } from '../services/api';

function DetalheAeronave({ user = {} }) {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [aeronave, setAeronave] = useState(null);
  const [etapas, setEtapas] = useState([]);
  const [temEmAndamento, setTemEmAndamento] = useState(false);
  const [pecas, setPecas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEtapaModal, setShowEtapaModal] = useState(false);
  const [showAssocModal, setShowAssocModal] = useState(false);
  const [showPecaModal, setShowPecaModal] = useState(false);
  const [showTesteModal, setShowTesteModal] = useState(false);
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [codigo]);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const aeronaveRes = await aeronaveService.buscarPorCodigo(codigo);
      const aeronaveData = aeronaveRes.data;

      const [etapasRes, pecasRes] = await Promise.all([
        etapaService.listarPorAeronaveId(aeronaveData.id),
        pecaService.listarPorAeronave(aeronaveData.id),
      ]);

      const etapasData = etapasRes.data || [];

      setAeronave(aeronaveData);
      setEtapas(etapasData);
      setPecas(pecasRes.data || []);

      const tem = etapasData.some((e) => e.status === 'ANDAMENTO');
      setTemEmAndamento(tem);
    } catch (err) {
      console.error('Erro ao carregar dados do veículo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIniciar = async (etapa) => {
    try {
      await etapaService.atualizarStatus(etapa.id, 'ANDAMENTO');
      await carregarDados();
    } catch (err) {
      console.error('Erro ao iniciar fase:', err);
      alert('Erro ao iniciar fase');
    }
  };

  const handleConcluir = async (etapa) => {
    try {
      await etapaService.atualizarStatus(etapa.id, 'CONCLUIDA');
      await carregarDados();
    } catch (err) {
      console.error('Erro ao concluir fase:', err);
      alert('Erro ao concluir fase');
    }
  };

  const handleFinalizarAeronave = async () => {
    const todasConcluidas = etapas.every(e => e.status === 'CONCLUIDA');
    
    if (!todasConcluidas) {
      const confirmar = window.confirm(
        'Atenção: Nem todas as fases foram concluídas. Deseja realmente finalizar este veículo?'
      );
      if (!confirmar) return;
    } else {
      const confirmar = window.confirm(
        'Tem certeza que deseja marcar este veículo como CONCLUÍDO?'
      );
      if (!confirmar) return;
    }

    try {
      await aeronaveService.atualizar(aeronave.id, { status: 'CONCLUIDA' });
      alert('Veículo finalizado com sucesso!');
      await carregarDados();
    } catch (err) {
      console.error('Erro ao finalizar veículo:', err);
      alert('Erro ao finalizar veículo');
    }
  };

  const handleModalEtapaClose = () => {
    setShowEtapaModal(false);
    carregarDados();
  };

  const handleModalAssocClose = () => {
    setShowAssocModal(false);
    carregarDados();
  };

  const handleModalPecaClose = () => {
    setShowPecaModal(false);
    carregarDados();
  };

  const handleModalTesteClose = () => {
    setShowTesteModal(false);
    carregarDados();
  };

  const handleModalRelatorioClose = () => {
    setShowRelatorioModal(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        await aeronaveService.deletar(aeronave.id);
        alert('Veículo excluído com sucesso!');
        navigate('/aeronaves');
      } catch (err) {
        alert('Erro ao excluir veículo');
      }
    }
  };

  if (loading || !aeronave) {
    return (
      <div className="vehicle-detail-page">
        <div className="spinner"></div>
      </div>
    );
  }

  const isOperador = user.nivel === 'operador';
  const canManage = user.nivel === 'administrador' || user.nivel === 'engenheiro';

  const etapasOrdenadas = [...etapas].sort((a, b) => {
    if (a.status === 'ANDAMENTO' && b.status !== 'ANDAMENTO') return -1;
    if (b.status === 'ANDAMENTO' && a.status !== 'ANDAMENTO') return 1;
    if (a.status === 'PENDENTE' && b.status === 'CONCLUIDA') return -1;
    if (b.status === 'PENDENTE' && a.status === 'CONCLUIDA') return 1;
    return 0;
  });

  const primeiraPendente = etapasOrdenadas.find((e) => e.status === 'PENDENTE');
  const primeiraPendenteId = primeiraPendente?.id;

  const getStatusClass = (status) => {
    const map = {
      'EM_MANUTENCAO': 'status-maintenance',
      'EM_PRODUCAO': 'status-production',
      'CONCLUIDA': 'status-completed',
      'CANCELADA': 'status-cancelled'
    };
    return map[status] || '';
  };

  const podeFinalizar = canManage && (aeronave.status === 'EM_MANUTENCAO' || aeronave.status === 'EM_PRODUCAO');

  return (
    <div className="vehicle-detail-page">
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <MdArrowBack /> Voltar
        </button>

        <div className="detail-title-section">
          <div className="vehicle-main-info">
            <div className="vehicle-code-badge">{aeronave.codigo}</div>
            <h1>{aeronave.modelo}</h1>
            <div className="vehicle-manufacturer-info">{aeronave.fabricante}</div>
          </div>
          <div className="detail-actions">
            <button className="action-button btn-delete-vehicle" onClick={handleDelete}>
              Excluir
            </button>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <div className="section-title">
            <div className="section-icon"><MdSettings /></div>
            Especificações Técnicas
          </div>
          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">Empresa</span>
              <span className="spec-value">{aeronave.fabricante}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Ano de Criação</span>
              <span className="spec-value">{aeronave.anoFabricacao}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Lotação</span>
              <span className="spec-value">{aeronave.capacidade} pax</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Distância Máx</span>
              <span className="spec-value">{aeronave.alcance} km</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Categoria</span>
              <span className="spec-value">{aeronave.tipo}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Situação</span>
              <div className={`status-indicator ${getStatusClass(aeronave.status)}`}>
                <div className="status-dot"></div>
                {aeronave.status?.replace('_', ' ')}
              </div>
            </div>
          </div>
          
          {podeFinalizar && (
            <button 
              className="action-button" 
              style={{
                marginTop: '16px', 
                width: '100%',
                backgroundColor: '#10b981',
                borderColor: '#10b981'
              }}
              onClick={handleFinalizarAeronave}
            >
              <MdCheckCircle /> Finalizar Veículo
            </button>
          )}
        </div>

        <div className="detail-section">
          <div className="section-title">
            <div className="section-icon"><MdBuild /></div>
            Componentes Instalados
          </div>
          {pecas.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-text">Nenhum componente instalado</p>
              </div>
            ) : (
              <div className="components-list">
                {pecas.map(peca => (
                  <div key={peca.id} className="component-item">
                    <div>
                      <div className="component-name">{peca.nome}</div>
                      <div className="component-details">
                        <span className="component-supplier">Distribuidor: {peca.fornecedor}</span>
                      </div>
                    </div>
                    <span className={`origin-badge ${peca.tipo === 'NACIONAL' ? 'origin-domestic' : 'origin-imported'}`}>
                      {peca.tipo === 'NACIONAL' ? 'Nacional' : 'Importada'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          {canManage && (
            <button className="add-item-btn" onClick={() => setShowPecaModal(true)}>
              <MdAdd /> Adicionar Componente
            </button>
          )}
        </div>

        <div className="detail-section full-width-section">
          <div className="section-title">
            <div className="section-icon"><MdAssignment /></div>
            Cronograma de Fases
          </div>
          {canManage && (
            <div style={{display: 'flex', gap: '12px', marginBottom: '20px'}}>
              <button className="action-button" onClick={() => setShowAssocModal(true)}>
                <MdPerson /> Associar Colaborador
              </button>
              <button className="action-button" onClick={() => setShowEtapaModal(true)}>
                <MdAdd /> Nova Fase
              </button>
            </div>
          )}
          {etapasOrdenadas.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">Nenhuma fase cadastrada</p>
            </div>
          ) : (
            <div className="phases-timeline">
              {etapasOrdenadas.map((etapa, idx) => (
                <div key={etapa.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="phase-card">
                    <div className="phase-header">
                      <div className="phase-name">{etapa.nome}</div>
                      <span className={`phase-status status-${etapa.status.toLowerCase()}`}>
                        {etapa.status}
                      </span>
                    </div>
                    <div className="phase-deadline">
                      📅 Prazo: {new Date(etapa.prazo).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="phase-deadline">
                      👤 Responsáveis: {etapa.funcionarios && etapa.funcionarios.length > 0 
                        ? etapa.funcionarios.map(f => f.nome).join(', ') 
                        : 'Não atribuído'}
                    </div>
                    {etapa.status === 'ANDAMENTO' && (
                      <button 
                        className="action-button" 
                        style={{marginTop: '12px', width: '100%'}}
                        onClick={() => handleConcluir(etapa)}
                      >
                        <MdCheck /> Marcar como Finalizada
                      </button>
                    )}
                    {etapa.status === 'PENDENTE' && !temEmAndamento && etapa.id === primeiraPendenteId && (
                      <button 
                        className="action-button" 
                        style={{marginTop: '12px', width: '100%'}}
                        onClick={() => handleIniciar(etapa)}
                      >
                        <MdPlayArrow /> Iniciar Fase
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isOperador && (
          <div className="detail-section full-width-section">
            <div className="section-title">
              <div className="section-icon"><MdScience /></div>
              Ações Disponíveis
            </div>
            <div style={{display: 'flex', gap: '12px'}}>
              <button className="action-button" onClick={() => setShowTesteModal(true)}>
                <MdScience /> Registrar Validação
              </button>
              <button className="action-button" onClick={() => setShowRelatorioModal(true)}>
                <MdDescription /> Gerar Documento
              </button>
            </div>
          </div>
        )}
      </div>

      {showEtapaModal && (
        <ModalCadEtapa 
          onClose={handleModalEtapaClose} 
          aeronaveId={aeronave.id} 
        />
      )}
      {showAssocModal && (
        <ModalAssocFuncionario 
          onClose={handleModalAssocClose} 
          codigoAeronave={codigo} 
        />
      )}
      {showPecaModal && (
        <ModalCadPeca 
          onClose={handleModalPecaClose} 
          aeronaveId={aeronave.id} 
          codigoVisivel={aeronave.codigo} 
        />
      )}
      {showTesteModal && (
        <ModalRegistraTeste 
          onClose={handleModalTesteClose} 
          aeronaveId={aeronave.id} 
        />
      )}
      {showRelatorioModal && (
        <ModalGeraRelatorio 
          onClose={handleModalRelatorioClose} 
          aeronaveId={aeronave.id} 
        />
      )}
    </div>
  );
}

export default DetalheAeronave;
