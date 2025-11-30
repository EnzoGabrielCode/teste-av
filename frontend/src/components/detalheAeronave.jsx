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
  MdSettings 
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
      console.error('Erro ao carregar dados da aeronave:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIniciar = async (etapa) => {
    try {
      await etapaService.atualizarStatus(etapa.id, 'ANDAMENTO');
      await carregarDados();
    } catch (err) {
      console.error('Erro ao iniciar etapa:', err);
      alert('Erro ao iniciar etapa');
    }
  };

  const handleConcluir = async (etapa) => {
    try {
      await etapaService.atualizarStatus(etapa.id, 'CONCLUIDA');
      await carregarDados();
    } catch (err) {
      console.error('Erro ao concluir etapa:', err);
      alert('Erro ao concluir etapa');
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

  if (loading || !aeronave) return <div className="detalhe-container"><div className="loading" style={{color:'#fff'}}>Carregando...</div></div>;

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

  return (
    <div className="detalhe-container">
      
      <button className="btn-voltar" onClick={() => navigate(-1)}>
        <MdArrowBack /> Voltar
      </button>

      <header className="detalhe-header">
        <div className="header-info">
          <h1>
            {aeronave.modelo} 
            <span className="codigo-badge">{aeronave.codigo}</span>
          </h1>
        </div>
        <div className="header-actions">
          <span className={`status-badge-lg status-${aeronave.status?.toLowerCase()}`}>
            {aeronave.status?.replace('_', ' ')}
          </span>
        </div>
      </header>

      <div className="detalhe-grid">
        
        <div className="main-column" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          
          <section className="detalhe-card">
            <div className="card-header">
              <h3><MdSettings /> Especificações</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Fabricante</span>
                <span className="info-value">{aeronave.fabricante}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Ano</span>
                <span className="info-value">{aeronave.anoFabricacao}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Capacidade</span>
                <span className="info-value">{aeronave.capacidade} pax</span>
              </div>
              <div className="info-item">
                <span className="info-label">Alcance</span>
                <span className="info-value">{aeronave.alcance} km</span>
              </div>
            </div>
          </section>

          <section className="detalhe-card">
            <div className="card-header">
              <h3><MdAssignment /> Cronograma</h3>
              {canManage && (
                <div style={{display:'flex', gap: 8}}>
                  <button className="btn-timeline btn-start" onClick={() => setShowAssocModal(true)} title="Associar Funcionário">
                    <MdPerson size={16}/> Associar
                  </button>
                  <button className="btn-timeline btn-start" onClick={() => setShowEtapaModal(true)} title="Nova Etapa">
                    <MdAdd size={16}/> Nova Etapa
                  </button>
                </div>
              )}
            </div>

            <div className="timeline">
              {etapasOrdenadas.length === 0 ? (
                <p style={{color: '#94a3b8', fontStyle: 'italic', padding: '10px'}}>Nenhuma etapa cadastrada.</p>
              ) : (
                etapasOrdenadas.map((etapa, idx) => (
                  <div key={etapa.id} className={`etapa-row status-${etapa.status.toLowerCase()}`}>
                    <div className="etapa-icon">{idx + 1}</div>
                    <div className="etapa-content">
                      <div className="etapa-title">
                        {etapa.nome}
                        <span style={{fontSize: '0.75rem', opacity: 0.7, border: '1px solid white', padding: '2px 6px', borderRadius: '4px'}}>
                          {etapa.status}
                        </span>
                      </div>
                      <div className="etapa-meta">
                        <span>Prazo: {new Date(etapa.prazo).toLocaleDateString('pt-BR')}</span>
                        <span>Resp: {etapa.funcionarios && etapa.funcionarios.length > 0 
                          ? etapa.funcionarios.map(f => f.nome).join(', ') 
                          : 'Não atribuído'}
                        </span>
                      </div>
                    </div>
                    <div className="etapa-actions">
                      {etapa.status === 'ANDAMENTO' && (
                        <button className="btn-timeline btn-finish" onClick={() => handleConcluir(etapa)}>
                          <MdCheck /> Concluir
                        </button>
                      )}
                      {etapa.status === 'PENDENTE' && !temEmAndamento && etapa.id === primeiraPendenteId && (
                        <button className="btn-timeline btn-start" onClick={() => handleIniciar(etapa)}>
                          <MdPlayArrow /> Iniciar
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <aside className="sidebar-stack">
          {!isOperador && (
            <section className="detalhe-card">
              <div className="card-header"><h3><MdBuild /> Ações</h3></div>
              <div className="painel-controle">
                <button className="btn-controle primary" onClick={() => setShowTesteModal(true)}>
                  <MdScience size={20} /> Registrar Teste
                </button>
                <button className="btn-controle" onClick={() => setShowRelatorioModal(true)}>
                  <MdDescription size={20} /> Gerar Relatório
                </button>
              </div>
            </section>
          )}

          <section className="detalhe-card">
            <div className="card-header">
              <h3><MdSettings /> Peças</h3>
              {canManage && (
                <button className="btn-voltar" style={{margin:0, color:'#f97316'}} onClick={() => setShowPecaModal(true)}>
                  <MdAdd size={20} />
                </button>
              )}
            </div>
            
            <div className="pecas-list">
              {pecas.length === 0 ? (
                <p style={{color: '#94a3b8', fontSize: '0.9rem', padding:'10px'}}>Nenhuma peça instalada.</p>
              ) : (
                pecas.map(peca => (
                  <div key={peca.id} className="peca-item">
                    <div>
                      <strong>{peca.nome}</strong>
                      <small>Fornec: {peca.fornecedor}</small>
                    </div>
                    <span className="peca-tag">{peca.tipo}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
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