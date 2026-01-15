import React, { useState, useEffect } from 'react';
import { Certificate, Status } from '../types';
import { X, CloudUpload, Calendar } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cert: Omit<Certificate, 'id'>) => Promise<void>;
  initialData?: Certificate | null;
}

const EMPTY_CERT: Omit<Certificate, 'id'> = {
  empresa: '',
  cnpj: '',
  email: '',
  tipoDocumento: '',
  orgao: '',
  dataEmissao: '',
  fimVigencia: '',
  antecedenciaDias: 30,
  statusNovoVenc: Status.NO_PRAZO,
  gestor: '',
  responsavel: '',
  taxRenovacao: 'R$ 0,00'
};

export const CertificateModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Omit<Certificate, 'id'>>(EMPTY_CERT);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = initialData;
        setFormData(rest);
        setIsIndeterminate(rest.fimVigencia === 'INDETERMINADO');
      } else {
        setFormData(EMPTY_CERT);
        setIsIndeterminate(false);
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Logic to calculate status simply for the demo/frontend optimistically
    // Ideally, the backend (GAS) should also recalculate this status
    let status = Status.NO_PRAZO;
    if (!isIndeterminate && formData.fimVigencia) {
        const today = new Date();
        const expiry = new Date(formData.fimVigencia);
        const warningDate = new Date(expiry);
        warningDate.setDate(warningDate.getDate() - Number(formData.antecedenciaDias));

        if (today > expiry) status = Status.VENCIDO;
        else if (today >= warningDate) status = Status.A_RENOVAR;
    }

    try {
      await onSave({
        ...formData,
        fimVigencia: isIndeterminate ? 'INDETERMINADO' : formData.fimVigencia,
        statusNovoVenc: status
      });
      onClose();
    } catch (error) {
      console.error("Failed to save", error);
      alert("Erro ao salvar. Verifique o console ou a conexão com a API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Editar Certidão' : 'Nova Certidão'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <form id="cert-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section: Dados da Empresa */}
            <div>
              <h3 className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wide">Dados da Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Empresa <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="empresa"
                    required
                    value={formData.empresa}
                    onChange={handleChange}
                    placeholder="Nome da Empresa"
                    className="w-full bg-gray-900 text-white placeholder-gray-400 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">CNPJ</label>
                  <input 
                    type="text" 
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section: Dados do Documento */}
            <div>
              <h3 className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wide">Documento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Tipo de Documento <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="tipoDocumento" 
                    required
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                    placeholder="Ex: CND Federal"
                    className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Órgão Emissor</label>
                  <input 
                    type="text" 
                    name="orgao" 
                    value={formData.orgao}
                    onChange={handleChange}
                    placeholder="Ex: Receita Federal"
                    className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                
                {/* Dates */}
                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-700">Data de Emissão</label>
                   <div className="relative">
                     <input 
                        type="date" 
                        name="dataEmissao"
                        value={formData.dataEmissao}
                        onChange={handleChange}
                        className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none [color-scheme:dark]"
                      />
                      <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                   </div>
                </div>
                
                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-700">Fim da Vigência</label>
                   <div className="flex gap-2">
                     <div className="relative flex-1">
                        <input 
                            type="date" 
                            name="fimVigencia"
                            disabled={isIndeterminate}
                            value={isIndeterminate ? '' : formData.fimVigencia}
                            onChange={handleChange}
                            className={`w-full rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none [color-scheme:dark] ${isIndeterminate ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-white'}`}
                        />
                         <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                     </div>
                     <button
                        type="button"
                        onClick={() => setIsIndeterminate(!isIndeterminate)}
                        className={`px-3 py-1 text-xs font-medium rounded border transition-colors ${isIndeterminate ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                     >
                        INDETERMINADO
                     </button>
                   </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section: Alertas e Responsável */}
            <div>
              <h3 className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wide">Alertas e Responsáveis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Antecedência (Dias)</label>
                  <input 
                    type="number" 
                    name="antecedenciaDias" 
                    value={formData.antecedenciaDias}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-500">Dias antes do vencimento para alertar.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">E-mail Responsável</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nome@empresa.com.br"
                    className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Gestor</label>
                  <input 
                    type="text" 
                    name="gestor" 
                    value={formData.gestor}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Responsável Interno</label>
                  <input 
                    type="text" 
                    name="responsavel" 
                    value={formData.responsavel}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

             <hr className="border-gray-100" />

            {/* Section: Valores */}
            <div>
              <h3 className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wide">Financeiro</h3>
               <div className="w-full md:w-1/2 pr-0 md:pr-2">
                 <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Taxa Renovação</label>
                  <input 
                    type="text" 
                    name="taxRenovacao" 
                    value={formData.taxRenovacao}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
               </div>
            </div>

             {/* Section: Anexo */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Anexar Documento</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <CloudUpload className="text-gray-400 mb-3" size={48} />
                <p className="text-sm text-blue-600 font-medium">Carregar um arquivo <span className="text-gray-500 font-normal">ou arraste e solte</span></p>
                <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG até 4MB</p>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="cert-form"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Certidão'}
          </button>
        </div>
      </div>
    </div>
  );
};