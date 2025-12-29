'use client';

import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { ModalVenda } from '@/components/modal-venda';
import { DashboardStats } from '@/components/dashboard-stats';
import { TabelaVendas } from '@/components/tabela-vendas';
import { BotaoExportar } from '@/components/botao-exportar';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Criamos os estados aqui na página pai para distribuir para os filhos
  const [vendas, setVendas] = useState<any[]>([]);
  const [faturamentoTotal, setFaturamentoTotal] = useState(0);

  const limiteMEI = 81000;
  const porcentagem = (faturamentoTotal / limiteMEI) * 100;

  // Função para buscar os dados que servirá para o PDF
  useEffect(() => {
    async function carregarDados() {
      if (!user) return;

      const { data } = await supabase
        .from('vendas')
        .select('*')
        .eq('user_id', user.id)
        .order('data', { ascending: false });

      if (data) {
        setVendas(data);
        const total = data.reduce((acc, curr) => acc + Number(curr.valor), 0);
        setFaturamentoTotal(total);
      }
    }

    carregarDados();
  }, [user]);

  return (
    <div className=" max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bem-vindo ao MEI Control</h1>
          <p className="text-gray-500">Gestão simplificada para o seu negócio.</p>
        </div>
        
        <div className="flex gap-3">
          {/* Agora o botão de exportar tem os dados necessários */}
          <BotaoExportar vendas={vendas} total={faturamentoTotal} />
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md"
          >
            <PlusCircle size={20} />
            Nova Venda
          </button>
        </div>
      </header>

      {/* Componentes de Visualização */}
      <div className="space-y-6">
        {/* Barra de Limite MEI */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Limite de Faturamento Anual (SIMEI)</h3>
              <p className="text-2xl font-bold text-gray-800">
                R$ {faturamentoTotal.toLocaleString('pt-BR')} <span className="text-gray-400 text-lg font-normal">/ R$ 81.000</span>
              </p>
            </div>
            <span className={`text-sm font-bold ${porcentagem > 80 ? 'text-red-600' : 'text-blue-600'}`}>
              {porcentagem.toFixed(1)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ${
                porcentagem > 90 ? 'bg-red-600' : porcentagem > 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(porcentagem, 100)}%` }}
            />
          </div>
        </div>

        <DashboardStats />
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Últimas Vendas</h2>
        <TabelaVendas />
      </div>

      <ModalVenda isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}