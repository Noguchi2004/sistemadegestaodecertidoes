import { Certificate } from '../types';

// --- CONFIGURAÇÃO DA API ---
// Insira aqui a URL do seu Web App do Google Apps Script
// Exemplo: 'https://script.google.com/macros/s/SEU_ID_DO_SCRIPT/exec'
const API_URL = '/api/certidao';

/**
 * Serviço para comunicação com o Google Sheets via Apps Script.
 * 
 * Estrutura esperada no Apps Script:
 * - doGet(e): Retorna a lista de certidões (JSON).
 * - doPost(e): Recebe { action: 'create'|'update'|'delete', data: {...}, id: ... }
 */
export const certificateService = {
  // GET ALL (doGet)
  getAll: async (): Promise<Certificate[]> => {
    try {
      // Se a URL não estiver configurada, retorna array vazio para não quebrar a UI
      if (API_URL === '/api/certidao') {
        console.warn("URL da API não configurada no services/certificateService.ts");
        return []; 
      }

      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar certidões:", error);
      throw error;
    }
  },

  // CREATE (doPost action='create')
  create: async (cert: Omit<Certificate, 'id'>): Promise<Certificate> => {
    try {
      // O Google Apps Script lida melhor com text/plain para evitar preflight CORS complexos
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ 
          action: 'create', 
          data: cert 
        })
      });

      if (!response.ok) throw new Error('Erro ao criar registro');
      
      // Espera-se que a API retorne o objeto criado com o ID gerado pelo script/planilha
      return await response.json();
    } catch (error) {
      console.error("Erro ao criar certidão:", error);
      throw error;
    }
  },

  // UPDATE (doPost action='update')
  update: async (cert: Certificate): Promise<Certificate> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ 
          action: 'update', 
          data: cert 
        })
      });

      if (!response.ok) throw new Error('Erro ao atualizar registro');
      
      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar certidão:", error);
      throw error;
    }
  },

  // DELETE (doPost action='delete')
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ 
          action: 'delete', 
          id: id 
        })
      });

      if (!response.ok) throw new Error('Erro ao excluir registro');
    } catch (error) {
      console.error("Erro ao excluir certidão:", error);
      throw error;
    }
  }
};