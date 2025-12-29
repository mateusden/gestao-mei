'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';

export function DashboardStats() {
  const { user } = useUser();
  
  // 1. Declarando todos os estados corretamente
  const [faturamentoTotal, setFaturamentoTotal] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      if (!user) return;

      try {
        // Buscar Vendas
        const { data: vendas, error: erroVendas } = await supabase
          .from('vendas')
          .select('valor, data')
          .eq('user_id', user.id);

        // Buscar Despesas
        const { data: despesas, error: erroDespesas } = await supabase
          .from('despesas')
          .select('valor')
          .eq('user_id', user.id);

        if (erroVendas || erroDespesas) throw new Error("Erro ao buscar dados");

        // Cálculos Totais (usando short-circuit [] para evitar o erro de 'null')
        const totalVendas = (vendas || []).reduce((acc, curr) => acc + Number(curr.valor), 0);
        const totalGeralDespesas = (despesas || []).reduce((acc, curr) => acc + Number(curr.valor), 0);

        setFaturamentoTotal(totalVendas);
        setTotalDespesas(totalGeralDespesas);

        // Agrupar dados para o Gráfico
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const agrupado = meses.map((mes, index) => {
          const totalMes = (vendas || [])
            .filter(v => new Date(v.data).getMonth() === index)
            .reduce((acc, curr) => acc + Number(curr.valor), 0);
          return { name: mes, total: totalMes };
        });
        
        setDadosGrafico(agrupado);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [user]);

  if (loading) return <div className="py-10 text-center">Carregando estatísticas...</div>;

  return (
    <div className="space-y-8">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <ArrowUpCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Faturamento Total</p>
              <h3 className="text-2xl font-bold text-gray-800">
                R$ {faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <ArrowDownCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Despesas</p>
              <h3 className="text-2xl font-bold text-gray-800">
                R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Lucro Líquido</p>
              <h3 className="text-2xl font-bold text-gray-800">
                R$ {(faturamentoTotal - totalDespesas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-6">Evolução de Vendas</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}