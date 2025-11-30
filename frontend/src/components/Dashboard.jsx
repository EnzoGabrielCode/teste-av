import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import axios from 'axios';
import '../styles/dashboard.css';

export default function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(user || { nome: 'Colaborador', nivelPermissao: 'Visitante' });

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('aerocodeUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUsuarioLogado(parsedUser);
        } catch (error) {
          console.error('Erro ao ler dados do usuário:', error);
        }
      }
    } else {
      setUsuarioLogado(user);
    }
    carregarDashboard();
  }, [user]);

  const carregarDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/relatorios/dashboard', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setStats(response.data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const formatarCargo = (cargo) => {
    if (!cargo) return '';
    return cargo.charAt(0).toUpperCase() + cargo.slice(1).toLowerCase();
  };

  const chartData = useMemo(() => {
    if (!stats?.aeronaves || !Array.isArray(stats.aeronaves)) return [];
    return stats.aeronaves.map((a) => ({
      name: a.modelo,
      etapasAtuais: Number(a.etapasConcluidas || 0),
      etapasTotais: Number(a.etapasTotais || 0),
    }));
  }, [stats]);

  const totalAeronaves = stats?.totalAeronaves || 0;
  const etapasConcluidas = stats?.etapasConcluidas || 0;

  const values = chartData.map((item) => item.etapasAtuais);
  const minEtapas = values.length ? Math.min(...values) : 0;
  const maxEtapas = values.length ? Math.max(...values) : 0;

  const getBarColor = (value) => {
    const minLightness = 80;
    const maxLightness = 50;
    const HUE = 260;
    const SATURATION = 85;

    if (maxEtapas === minEtapas) {
      return `hsl(${HUE}, ${SATURATION}%, 60%)`;
    }

    const percent = (value - minEtapas) / (maxEtapas - minEtapas || 1);
    const lightness = minLightness - percent * (minLightness - maxLightness);
    return `hsl(${HUE}, ${SATURATION}%, ${lightness}%)`;
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Painel de Controle</h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total de Veículos</div>
          <div className="metric-value">{totalAeronaves}</div>
          <div className="metric-subtitle">Cadastrados no sistema</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Fases Finalizadas</div>
          <div className="metric-value">{etapasConcluidas}</div>
          <div className="metric-subtitle">Processos completos</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Validações Aprovadas</div>
          <div className="metric-value">{stats.testesAprovados || 0}</div>
          <div className="metric-subtitle">Testes com sucesso</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Validações Reprovadas</div>
          <div className="metric-value">{stats.testesReprovados || 0}</div>
          <div className="metric-subtitle">Necessitam revisão</div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-panel">
          <div className="panel-header">
            <h2 className="panel-title">Progresso dos Veículos</h2>
            <span className="badge badge-info">{chartData.length} modelos</span>
          </div>

          {chartData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <p className="empty-state-text">Nenhum veículo com fases cadastradas</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#4a5568" tick={{ fontSize: 12 }} />
                <YAxis stroke="#4a5568" tick={{ fontSize: 12 }} />
                <Tooltip
                  wrapperStyle={{
                    backgroundColor: '#1a202c',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  }}
                  contentStyle={{
                    backgroundColor: 'transparent',
                    border: 'none',
                  }}
                  labelStyle={{
                    color: '#e5e7eb',
                    fontWeight: 'bold',
                    marginBottom: 4,
                  }}
                  itemStyle={{
                    color: '#e5e7eb',
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value}`, 'Fases concluídas']}
                />
                <Bar dataKey="etapasAtuais" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry.etapasAtuais)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="info-panel">
          <div className="panel-header">
            <h2 className="panel-title">Resumo de Fases</h2>
          </div>

          <ul className="data-list">
            <li className="list-item">
              <div>
                <div className="item-name">Aguardando</div>
                <div className="item-description">Fases pendentes</div>
              </div>
              <span className="status-badge status-pending">{stats.etapasPendentes || 0}</span>
            </li>
            <li className="list-item">
              <div>
                <div className="item-name">Processando</div>
                <div className="item-description">Em andamento</div>
              </div>
              <span className="status-badge status-active">{stats.etapasAndamento || 0}</span>
            </li>
            <li className="list-item">
              <div>
                <div className="item-name">Finalizadas</div>
                <div className="item-description">Concluídas</div>
              </div>
              <span className="status-badge status-active">{stats.etapasConcluidas || 0}</span>
            </li>
          </ul>

          <div className="panel-header" style={{marginTop: '24px'}}>
            <h2 className="panel-title">Equipe</h2>
          </div>

          <ul className="data-list">
            <li className="list-item">
              <div>
                <div className="item-name">Total de Colaboradores</div>
                <div className="item-description">Cadastrados no sistema</div>
              </div>
              <span className="status-badge status-info">{stats.totalFuncionarios}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
