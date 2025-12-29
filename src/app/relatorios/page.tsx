'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BotaoExportar } from '@/components/botao-exportar';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function RelatoriosPage() {
  const { user } = useUser()
  const [dadosPizza, setDadosPizza] = useState<any[]>([])
  const [vendas, setVendas] = useState<any[]>([])
  const [totalVendas, setTotalVendas] = useState(0)

  useEffect(() => {
    async function carregarDados() {
      if (!user) return

      //Buscar Vendas para o botão de exportar
      const { data: vData } = await supabase.from('vendas').select('*').eq('user_id', user.id)
      if (vData) {
        setVendas(vData)
        setTotalVendas(vData.reduce((acc, curr) => acc + Number(curr.valor), 0))
      }

      // Buscar Despesas para o gráfico de pizza
      const { data: dData } = await supabase.from('despesas').select('valor, categoria').eq('user_id', user.id);
      
      if (dData) {
        const agrupar = dData.reduce((acc: any, curr) => {
          acc[curr.categoria] = (acc[curr.categoria] || 0) + Number(curr.valor);
          return acc;
        }, {});

        const formatado = Object.keys(agrupar).map(key => ({
          name: key,
          value: agrupar[key]
        }));
        setDadosPizza(formatado);
      }
    }
    carregarDados()
  }, [user])

  return (
    <div className='max-w-7xl mx-auto'>
      <header className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Relatórios e Inteligência</h1>
          <p className='text-gray-500'>Analisa a saúde financeirs do seu negócio.</p>
        </div>
        <BotaoExportar vendas={vendas} total={totalVendas} />
      </header>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Card do Gráfico de Pizza*/}
        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
          <h3 className='font-bold text-gray-800 mb-4'>Distribuição de Despesas</h3>
          <div className='h-[350px] w-full'>
            {dadosPizza.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosPizza}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dadosPizza.map((entry, index) => (
                      <Cell key={`cell--${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className='h-full flex items-center justify-center text-gray-400'>
                Cadastre despesas para ver o gráfico.
              </div>
            )}
          </div>
        </div>

        {/* Card de Dica de Gestão (Isso aqui vende muito!) */}
        <div className='bg-blue-600 p-8 rounded-xl text-white flex flex-col justify-center'>
            <h3 className='text-xl font-bold mb-4'>Dica do Especialista 💡</h3>
            <p className='text-blue-100 mb-6'>
              Para um MEI saudável, suas despesas fixas (Aluguel, Luz, Internet) não devem ultrapassar 20% do seu faturamento bruto.
            </p>
            <div className='bbg-blue-500/50 p-4 rounded-lg'>
              <p className='text-sm font-medium'>Status Atual:</p>
              <p className='text-2xl font-black'>
                {totalVendas > 0
                  ? `${((dadosPizza.reduce((a, b) => a + b.value, 0) / totalVendas) * 100).toFixed(1)}% de gastos`
                : 'Aguardando dados...'}
              </p>
            </div>
        </div>
      </div>
    </div>
  )
}