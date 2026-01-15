import React, { useEffect, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { CertificateTable } from './components/CertificateTable';
import { CertificateModal } from './components/CertificateModal';
import { certificateService } from './services/certificateService';
import { Certificate, DashboardStats, Status } from './types';
import { Plus, Search } from 'lucide-react';

function App() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState<Certificate | null>(null);

  // Fetch Data
// Fetch Data
const fetchData = async () => {
  setLoading(true);
  try {
    const data = await certificateService.getAll();

    const arrayData = Array.isArray(data) ? data : [];

    const normalizeStatus = (raw: string | Status): Status => {
      const value = String(raw).trim().toUpperCase();

      if (value.includes('NO PRAZO')) return Status.NO_PRAZO;
      if (value.includes('A RENOVAR')) return Status.A_RENOVAR;
      if (value.includes('VENCIDO')) return Status.VENCIDO;

      return Status.NO_PRAZO;
    };

    const normalized = arrayData.map(c => ({
      ...c,
      statusNovoVenc: normalizeStatus((c as any).statusNovoVenc),
    }));

    console.log('exemplo status:', normalized[0]?.statusNovoVenc); // <= AQUI
    setCertificates(normalized);
  } catch (error) {
    console.error('Failed to fetch data', error);
    setCertificates([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleOpenNew = () => {
    setCurrentCertificate(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: Certificate) => {
    setCurrentCertificate(cert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCertificate(null);
  };

  const handleSave = async (data: Omit<Certificate, 'id'>) => {
    if (currentCertificate) {
      // Edit
      const updated = await certificateService.update({ ...data, id: currentCertificate.id });
      setCertificates(prev => prev.map(c => c.id === updated.id ? updated : c));
    } else {
      // Create
      const created = await certificateService.create(data);
      setCertificates(prev => [...prev, created]);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta certidão?")) {
      await certificateService.delete(id);
      setCertificates(prev => prev.filter(c => c.id !== id));
    }
  };

  // Derived State: Filtered List & Stats
 const filteredCertificates = useMemo(() => {
  return certificates.filter(cert => {
    // filtro por status (card)
    if (statusFilter !== 'ALL' && cert.statusNovoVenc !== statusFilter) {
      return false;
    }

    // filtro de busca
    const searchLower = searchTerm.toLowerCase();
    return (
      cert.empresa.toLowerCase().includes(searchLower) ||
      cert.cnpj.includes(searchTerm) ||
      cert.tipoDocumento.toLowerCase().includes(searchLower) ||
      cert.orgao.toLowerCase().includes(searchLower)
    );
  });
}, [certificates, searchTerm, statusFilter]);

  const stats: DashboardStats = useMemo(() => {
    return {
      total: certificates.length,
      noPrazo: certificates.filter(c => c.statusNovoVenc === Status.NO_PRAZO).length,
      aRenovar: certificates.filter(c => c.statusNovoVenc === Status.A_RENOVAR).length,
      vencidos: certificates.filter(c => c.statusNovoVenc === Status.VENCIDO).length,
    };
  }, [certificates]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />

      <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full">
        
        {/* Dashboard Stats */}
        <SummaryCards 
        stats={stats} 
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />
    
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Buscar empresa, CNPJ, órgão..."
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleOpenNew}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium shadow-sm transition-all"
          >
            <Plus size={18} />
            Nova Certidão
          </button>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <CertificateTable 
            certificates={filteredCertificates} 
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      <CertificateModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={currentCertificate}
      />
    </div>
  );
}

export default App;
