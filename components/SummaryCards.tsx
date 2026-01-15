import React from 'react';
import { DashboardStats } from '../types';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Props {
  stats: DashboardStats;
  currentFilter: Status | 'ALL';
  onFilterChange: (status: Status | 'ALL') => void;
}

export const SummaryCards: React.FC<Props> = ({ stats, currentFilter, onFilterChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Card */}
      <div
        className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onFilterChange('ALL')}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        <div className="flex flex-col h-full justify-between">
          <h3 className="text-gray-500 text-sm font-medium">Total Certidões</h3>
          <span className="text-4xl font-bold text-gray-800 mt-2">{stats.total}</span>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <div className="w-24 h-24 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      {/* No Prazo Card */}
      <div
        className={`bg-green-50 p-5 rounded-xl border border-green-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer ${
          currentFilter === Status.NO_PRAZO ? 'ring-2 ring-green-400' : ''
        }`}
        onClick={() => onFilterChange(Status.NO_PRAZO)}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-green-700 text-sm font-medium">No Prazo</h3>
        </div>
        <span className="text-4xl font-bold text-green-700 mt-2">{stats.noPrazo}</span>
      </div>

      {/* A Renovar Card */}
      <div
        className={`bg-yellow-50 p-5 rounded-xl border border-yellow-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative cursor-pointer ${
          currentFilter === Status.A_RENOVAR ? 'ring-2 ring-yellow-400' : ''
        }`}
        onClick={() => onFilterChange(Status.A_RENOVAR)}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-yellow-700 text-sm font-medium">A Renovar</h3>
          <AlertTriangle className="text-yellow-500 opacity-50" size={24} />
        </div>
        <span className="text-4xl font-bold text-yellow-700 mt-2">{stats.aRenovar}</span>
      </div>

      {/* Vencidos Card */}
      <div
        className={`bg-red-50 p-5 rounded-xl border border-red-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer ${
          currentFilter === Status.VENCIDO ? 'ring-2 ring-red-400' : ''
        }`}
        onClick={() => onFilterChange(Status.VENCIDO)}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-red-700 text-sm font-medium">Vencidos</h3>
          <AlertTriangle className="text-red-500 opacity-50" size={24} />
        </div>
        <span className="text-4xl font-bold text-red-700 mt-2">{stats.vencidos}</span>
      </div>
    </div>
  );
};
