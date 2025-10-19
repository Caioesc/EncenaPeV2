import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

// Tipos para as respostas da API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Configuração da instância do axios
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor para adicionar token de autenticação
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para tratamento de respostas
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Sessão expirada. Faça login novamente.');
      } else if (error.response?.status === 403) {
        toast.error('Acesso negado. Você não tem permissão para esta ação.');
      } else if (error.response?.status >= 500) {
        toast.error('Erro interno do servidor. Tente novamente mais tarde.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error('Erro de conexão. Verifique sua internet.');
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// Instância da API
export const api = createApiInstance();

// Serviços específicos
export class AuthService {
  static async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, senha: password });
    return response.data;
  }

  static async register(data: {
    nome: string;
    email: string;
    senha: string;
  }) {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  static async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  static async resetPassword(data: {
    email: string;
    token: string;
    newPassword: string;
  }) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  }
}

export class UserService {
  static async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  }

  static async updateProfile(data: {
    nome?: string;
    email?: string;
    telefone?: string;
    avatarUrl?: string;
    bio?: string;
  }) {
    const response = await api.put('/users/me', data);
    return response.data;
  }

  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    const response = await api.put('/users/me/password', data);
    return response.data;
  }
}

export class EventService {
  static async getEvents(params?: {
    categoria?: string;
    cidade?: string;
    dataInicio?: string;
    dataFim?: string;
    search?: string;
    page?: number;
    size?: number;
  }) {
    const response = await api.get('/eventos', { params });
    return response.data;
  }

  static async getUpcomingEvents() {
    const response = await api.get('/eventos/proximos');
    return response.data;
  }

  static async getAvailableEvents() {
    const response = await api.get('/eventos/disponiveis');
    return response.data;
  }

  static async getEventById(id: number) {
    const response = await api.get(`/eventos/${id}`);
    return response.data;
  }

  static async getCategories() {
    const response = await api.get('/eventos/categorias');
    return response.data;
  }

  static async getCities() {
    const response = await api.get('/eventos/cidades');
    return response.data;
  }
}

export class TicketService {
  static async purchaseTicket(data: {
    usuarioId: number;
    eventoId: number;
    quantidade: number;
    paymentMethod?: string;
  }) {
    const response = await api.post('/ingressos', data);
    return response.data;
  }

  static async getMyTickets() {
    const response = await api.get('/ingressos/me');
    return response.data;
  }

  static async getMyTicketsPaginated(page: number = 0, size: number = 10) {
    const response = await api.get('/ingressos/me/paginado', {
      params: { page, size }
    });
    return response.data;
  }

  static async getActiveTickets() {
    const response = await api.get('/ingressos/me/ativos');
    return response.data;
  }

  static async getTicketByCode(code: string) {
    const response = await api.get(`/ingressos/codigo/${code}`);
    return response.data;
  }

  static async cancelTicket(id: number, motivo?: string) {
    const response = await api.post(`/ingressos/${id}/cancel`, null, {
      params: { motivo }
    });
    return response.data;
  }
}

export class FAQService {
  static async getFAQs() {
    const response = await api.get('/faq');
    return response.data;
  }

  static async getFAQsPaginated(page: number = 0, size: number = 10) {
    const response = await api.get('/faq/paginado', {
      params: { page, size }
    });
    return response.data;
  }

  static async getFAQsByCategory(category: string) {
    const response = await api.get(`/faq/categoria/${category}`);
    return response.data;
  }

  static async searchFAQs(query: string) {
    const response = await api.get('/faq/search', {
      params: { query }
    });
    return response.data;
  }

  static async getFAQCategories() {
    const response = await api.get('/faq/categorias');
    return response.data;
  }
}

export class MessageService {
  static async createMessage(data: {
    remetente?: string;
    texto: string;
    emailContato?: string;
  }) {
    const response = await api.post('/mensagens', data);
    return response.data;
  }

  static async getAllMessages() {
    const response = await api.get('/mensagens');
    return response.data;
  }

  static async getMessagesPaginated(page: number = 0, size: number = 10) {
    const response = await api.get('/mensagens/paginado', {
      params: { page, size }
    });
    return response.data;
  }

  static async getOpenMessages() {
    const response = await api.get('/mensagens/abertas');
    return response.data;
  }

  static async respondToMessage(id: number, resposta: string) {
    const response = await api.post(`/mensagens/${id}/responder`, resposta);
    return response.data;
  }
}

// Utilitários para tratamento de erros
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Erro desconhecido. Tente novamente.';
};

// Utilitário para fazer upload de arquivos
export const uploadFile = async (file: File, endpoint: string = '/upload'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.url;
};

export default api;
