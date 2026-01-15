import React from 'react';
import { Bell, RefreshCcw, FileSpreadsheet, LayoutGrid } from 'lucide-react';

export const Header: React.FC = () => {
  const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <LayoutGrid size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 leading-tight">Certidões</h1>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Controle de Vencimentos</span>
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Conectado
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right hidden md:block">
          <p className="text-xs text-gray-500">Última atualização</p>
          <p className="font-mono text-sm font-medium text-gray-700">{currentTime}</p>
        </div>
        
        <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
          <button className="p-2 hover:bg-gray-100 rounded-full text-blue-600 relative transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors" title="Atualizar dados">
            <RefreshCcw size={20} />
          </button>
          <a 
            href="https://docs.google.com/spreadsheets" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium border border-green-200"
          >
            <FileSpreadsheet size={18} />
            <span>Planilha</span>
          </a>
        </div>
      </div>
    </header>
  );
};