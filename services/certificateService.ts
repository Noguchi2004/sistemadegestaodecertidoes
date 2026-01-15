import { Certificate } from '../types';

// --- CONFIGURAÇÃO DA API ---
// Agora o front fala com a API da Vercel (que faz o proxy para o Apps Script)
const API_URL = '/api/certidao';

/**
 * Serviço para comunicação com o Google Sheets via Apps Script (via Vercel).
 * 
 * Estrutura esperada na API da Vercel:
 * - GET /api/certidao -> retorna lista de certidões (JSON).
 * - POST /api/certidao -> recebe { action: 'create'|'update'|'delete', data, id }
 */
export const certificateService = {
  // GET ALL
  getAll: async (): Promise<Certificate[]> => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar certidões:', error);
      throw error;
    }
  },

  // CREATE (action='create')
  create: async (cert: Omit<Certificate, 'id'>): Promise<Certificate> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          data: cert,
        }),
      });

      if (!response.ok) throw new Error('Erro ao criar registro');

      // API deve retornar o objeto criado (com id)
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar certidão:', error);
      throw error;
    }
  },

  // UPDATE (action='update')
  update: async (cert: Certificate): Promise<Certificate> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          data: cert,
        }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar registro');

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar certidão:', error);
      throw error;
    }
  },

  // DELETE (action='delete')
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          id,
        }),
      });

      if (!response.ok) throw new Error('Erro ao excluir registro');
    } catch (error) {
      console.error('Erro ao excluir certidão:', error);
      throw error;
    }
  },
};
