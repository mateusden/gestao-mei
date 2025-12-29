'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { ModalDespesa } from '@/components/modal-despesa';
import { TabelaDespesas } from '@/components/tabela-despesas';

export default function DespesasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Despesas</h1>
          <p className="text-gray-500">Controle seus custos e matéria-prima.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md"
        >
          <PlusCircle size={20} />
          Registrar Gasto
        </button>
      </header>
      
      <TabelaDespesas />

      <ModalDespesa isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}