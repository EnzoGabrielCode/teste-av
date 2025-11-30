import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('aerocodeUser');
    if (user) {
      try {
        const { token } = JSON.parse(user);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Erro ao processar token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aerocodeUser');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (usuario, senha) => api.post('/auth/login', { usuario, senha }),
  verify: () => api.get('/auth/verify'),
};

export const aeronaveService = {
  listar: () => api.get('/aeronaves'),
  buscarPorId: (id) => api.get(`/aeronaves/${id}`),
  buscarPorCodigo: (codigo) => api.get(`/aeronaves/codigo/${codigo}`),
  listarPorTipo: (tipo) => api.get(`/aeronaves/tipo/${tipo}`),
  criar: (data) => api.post('/aeronaves', data),
  atualizar: (id, data) => api.put(`/aeronaves/${id}`, data),
  deletar: (id) => api.delete(`/aeronaves/${id}`),
};

export const funcionarioService = {
  listar: () => api.get('/funcionarios'),
  buscarPorId: (id) => api.get(`/funcionarios/${id}`),
  listarPorNivel: (nivel) => api.get(`/funcionarios/nivel/${nivel}`),
  criar: (data) => api.post('/funcionarios', data),
  atualizar: (id, data) => api.put(`/funcionarios/${id}`, data),
  deletar: (id) => api.delete(`/funcionarios/${id}`),
};

export const pecaService = {
  listar: () => api.get('/pecas'),
  buscarPorId: (id) => api.get(`/pecas/${id}`),
  listarPorAeronave: (aeronaveId) => api.get(`/pecas/aeronave/${aeronaveId}`),
  listarPorTipo: (tipo) => api.get(`/pecas/tipo/${tipo}`),
  criar: (data) => api.post('/pecas', data),
  deletar: (id) => api.delete(`/pecas/${id}`),
};

export const etapaService = {
  listar: () => api.get('/etapas'),
  listarPorAeronaveId: (aeronaveId) => api.get(`/etapas/aeronave/${aeronaveId}`),
  listarPorAeronaveCodigo: (codigo) => api.get(`/etapas/aeronave/codigo/${codigo}`),
  
  criar: (data) => api.post('/etapas', data),
  
  associarFuncionario: (etapaId, funcionarioId) =>
    api.post(`/etapas/${etapaId}/funcionario/${funcionarioId}`),
    
  atualizarStatus: (etapaId, status) =>
    api.patch(`/etapas/${etapaId}`, { status }),
    
  deletar: (etapaId) => api.delete(`/etapas/${etapaId}`),
};

export const testeService = {
  listar: () => api.get('/testes'),
  buscarPorId: (id) => api.get(`/testes/${id}`),
  listarPorAeronave: (aeronaveId) => api.get(`/testes/aeronave/${aeronaveId}`),
  listarPorResultado: (resultado) => api.get(`/testes/resultado/${resultado}`),
  criar: (data) => api.post('/testes', data),
  deletar: (id) => api.delete(`/testes/${id}`),
};

export const relatorioService = {
  listar: () => api.get('/relatorios'),
  dashboard: () => api.get('/relatorios/dashboard'),
  criar: (data) => api.post('/relatorios', data),
  buscarPorId: (id) => api.get(`/relatorios/${id}`),
  downloadPDF: (id) => api.get(`/relatorios/${id}/download`, { responseType: 'blob' }),
  
  deletar: (id) => api.delete(`/relatorios/${id}`),
  listarPorAeronave: (aeronaveId) => api.get(`/relatorios/aeronave/${aeronaveId}`),
};

export default api;