import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aeronaveService } from '../services/api';
import ModalCadAero from '../components/modals/ModalCadAero'; 
import '../styles/aeronaves.css';
import { MdAdd, MdVisibility, MdDelete } from 'react-icons/md';

function Aeronaves({ user }) {
  const navigate = useNavigate();
  const [aeronaves, setAeronaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarAeronaves();
  }, []);

  const carregarAeronaves = async () => {
    try {
      setLoading(true);
      const response = await aeronaveService.listar();
      setAeronaves(response.data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar aeronaves');
    } finally {
      setLoading(false);
    }
  };

  const excluirAeronave = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta aeronave?')) return;
    try {
      await aeronaveService.deletar(id);
      setAeronaves(aeronaves.filter((a) => a.id !== id));
    } catch (err) {
      alert('Erro ao excluir aeronave');
    }
  };

  const handleModalClose = (novaAeronave) => {
    setShowModal(false);
    if (novaAeronave) carregarAeronaves();
  };

  const podeAdicionar = user?.nivel === 'administrador' || user?.nivel === 'engenheiro';
  const podeExcluir = user?.nivel === 'administrador';

  if (loading) return <div className="aeronaves-container"><div className="loading">Carregando...</div></div>;
  if (error) return <div className="aeronaves-container"><div className="error">{error}</div></div>;

  return (
    <div className="aeronaves-container">
      <div className="page-header">
        <div>
          <h1>Gestão de Aeronaves</h1>
          <p style={{color: '#9ca3af', margin: 0}}>Frota completa registrada no sistema.</p>
        </div>
        {podeAdicionar && (
          <button className="btn-adicionar" onClick={() => setShowModal(true)}>
            <MdAdd size={20}/>
            <span>Adicionar</span>
          </button>
        )}
      </div>

      {aeronaves.length === 0 ? (
        <div className="no-data">Nenhuma aeronave cadastrada</div>
      ) : (
        <table className="aeronaves-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Modelo</th>
              <th>Fabricante</th>
              <th>Tipo</th>
              <th>Status</th>
              <th style={{textAlign: 'right'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {aeronaves.map((aeronave) => (
              <tr key={aeronave.id}>
                <td style={{fontWeight: 'bold', color: '#fff'}}>{aeronave.codigo}</td>
                <td>{aeronave.modelo}</td>
                <td>{aeronave.fabricante}</td>
                <td>{aeronave.tipo}</td>
                <td>
                  <span className={`status-badge status-${aeronave.status?.toLowerCase()}`}>
                    {aeronave.status?.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <div className="actions" style={{justifyContent: 'flex-end'}}>
                    <button className="btn-visualizar" onClick={() => navigate(`/detalheAeronave/${aeronave.codigo}`)} title="Ver detalhes">
                      <MdVisibility size={18} />
                    </button>
                    {podeExcluir && (
                      <button className="btn-excluir" onClick={() => excluirAeronave(aeronave.id)} title="Excluir">
                        <MdDelete size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && <ModalCadAero onClose={handleModalClose} />}
    </div>
  );
}

export default Aeronaves;