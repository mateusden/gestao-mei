'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { ModalVenda } from '@/components/modal-venda';
import { TabelaVendas } from '@/components/tabela-vendas';

export default function ReceitasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Minhas Receitas</h1>
          <p className="text-gray-500">Histórico detalhado de todas as suas vendas.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md"
        >
          <PlusCircle size={20} />
          Nova Venda
        </button>
      </header>

      {/* Reutilizamos o componente que você já criou */}
      <TabelaVendas />

      <ModalVenda isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}