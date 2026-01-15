import React from 'react';
import { Certificate, Status } from '../types';
import { Pencil, Trash2, Paperclip, MailWarning, ArrowUpDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Props {
  certificates: Certificate[];
  onEdit: (cert: Certificate) => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy');
  } catch (e) {
    return dateString;
  }
};

export const CertificateTable: React.FC<Props> = ({ certificates, onEdit, onDelete }) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case Status.NO_PRAZO:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">NO PRAZO</span>;
      case Status.A_RENOVAR:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">A RENOVAR</span>;
      case Status.VENCIDO:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">VENCIDO</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                <div className="flex items-center gap-1">Empresa / CNPJ <ArrowUpDown size={12}/></div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                <div className="flex items-center gap-1">Documento <ArrowUpDown size={12}/></div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                <div className="flex items-center gap-1">Vencimento <ArrowUpDown size={12}/></div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                <div className="flex items-center gap-1">Status <ArrowUpDown size={12}/></div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Antecedência
              </th>
               <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Responsável
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Anexo
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {certificates.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500 text-sm">
                  Nenhuma certidão encontrada para os filtros aplicados.
                </td>
              </tr>
            ) : certificates.map((cert) => (
              <tr key={cert.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{cert.empresa}</div>
                  <div className="text-xs text-gray-500">{cert.cnpj}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 line-clamp-1" title={cert.tipoDocumento}>{cert.tipoDocumento}</div>
                  <div className="text-xs text-gray-500 line-clamp-1" title={cert.orgao}>{cert.orgao}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{cert.fimVigencia === 'INDETERMINADO' ? 'Indet.' : formatDate(cert.fimVigencia)}</div>
                  <div className="text-[10px] text-gray-500">Emitido: {formatDate(cert.dataEmissao)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(cert.statusNovoVenc)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {cert.antecedenciaDias} dias
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100 w-max mb-1 flex items-center gap-1">
                      <MailWarning size={10} /> Sem email
                    </span>
                    <span className="text-xs text-gray-700">{cert.gestor}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded hover:bg-blue-50">
                    <Paperclip size={16} />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(cert)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded hover:bg-blue-100"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(cert.id)}
                      className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <span>Mostrando {certificates.length} registros</span>
        <span className="italic">* Dados sincronizados com o Google Sheets</span>
      </div>
    </div>
  );
};