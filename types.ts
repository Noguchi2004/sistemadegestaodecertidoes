export enum Status {
  NO_PRAZO = 'NO PRAZO',
  A_RENOVAR = 'A RENOVAR',
  VENCIDO = 'VENCIDO'
}

export interface Certificate {
  id: string; // Unique ID for frontend handling
  empresa: string;
  cnpj: string;
  email: string;
  tipoDocumento: string;
  orgao: string;
  dataEmissao: string; // ISO Date string YYYY-MM-DD
  fimVigencia: string; // ISO Date string YYYY-MM-DD or 'INDETERMINADO'
  antecedenciaDias: number;
  statusNovoVenc: Status | string; // Can be calculated or from sheet
  gestor: string;
  responsavel: string;
  taxRenovacao: string; // string to handle currency formatting easily
  anexoUrl?: string;
}

export interface DashboardStats {
  total: number;
  noPrazo: number;
  aRenovar: number;
  vencidos: number;
}