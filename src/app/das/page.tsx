'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { CheckCircle2, Circle, Loader2, ExternalLink } from 'lucide-react';
import { gerarImpostos2025 } from '@/lib/seed-das';

export default function DasPage() {
  const { user } = useUser();
  const [impostos, setImpostos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function buscarOuGerarImpostos() {
    if (!user) return;

    let { data } = await supabase
      .from('impostos_das')
      .select('*')
      .eq('user_id', user.id)
      .order('vencimento', { ascending: true });

    if (data && data.length === 0) {
      // 1. Busca a atividade do perfil antes de gerar
      const { data: perfil } = await supabase
        .from('perfis_empresa')
        .select('atividade')
        .eq('user_id', user.id)
        .single();

      // 2. Gera com a atividade real ou 'Serviços' como padrão
  await gerarImpostos2025(user.id, perfil?.atividade || 'Serviços');

      
      const { data: novosDados } = await supabase
        .from('impostos_das')
        .select('*')
        .eq('user_id', user.id)
        .order('vencimento', { ascending: true });
      data = novosDados;
    }

    if (data) setImpostos(data);
    setLoading(false);
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'Pago' ? 'Pendente' : 'Pago';
    const { error } = await supabase
      .from('impostos_das')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setImpostos(impostos.map(i => i.id === id ? { ...i, status: newStatus } : i));
    }
  }

  useEffect(() => {
    buscarOuGerarImpostos();
  }, [user]);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Guia DAS (Mensal)</h1>
        <p className="text-gray-500">Acompanhe seus pagamentos e emita seus boletos oficiais.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {impostos.map((das) => (
          <div key={das.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{das.mes_referencia}</h3>
                <p className="text-sm text-gray-500">Vence em: {new Date(das.vencimento).toLocaleDateString('pt-BR')}</p>
                <p className="text-blue-600 font-bold text-lg mt-1">
                    R$ {Number(das.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              <button 
                onClick={() => toggleStatus(das.id, das.status)}
                className={`flex flex-col items-center transition-all ${das.status === 'Pago' ? 'text-green-600' : 'text-gray-200 hover:text-orange-500'}`}
                title="Marcar como pago"
              >
                <CheckCircle2 size={32} fill={das.status === 'Pago' ? 'currentColor' : 'none'} />
                <span className="text-[10px] font-black mt-1 uppercase">{das.status}</span>
              </button>
            </div>
            
            {/* O BOTÃO OFICIAL QUE VOCÊ PEDIU */}
            <a 
              href="https://www10.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all group"
            >
              <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
              Emitir Boleto Oficial
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}