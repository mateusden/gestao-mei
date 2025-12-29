'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function NotasFiscaisPage() {
  const { user } = useUser();
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarVendas() {
    if (!user) return
    const { data } = await supabase
      .from('vendas')
      .select('*')
      .eq('user_id', user.id)
      .order('data', {ascending: false })

    if (data) setVendas(data);
    setLoading(false);
    }

    async function toggleNF(id: string, statusAnual: boolean) {
      const { error } = await supabase
        .from('vendas')
        .update({ nf_emitida: !statusAnual })
        .eq('id', id)

      if (!error) {
      setVendas(vendas.map(v => v.id === id ? { ...v, nf_emitida: !statusAnual } : v));
      }
    }

    useEffect(() => {
    carregarVendas();
  }, [user]);

    if (loading) return <div className='flex justify-center p-10'><Loader2 className='animate-spin text-blue-600' /></div>

    const notasPendentes = vendas.filter(v => !v.nf_emitida).length

    return (
      <div className='max-w-7xl mx-auto'>
        <header className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-800'>Controle de Notas Fiscais</h1>
          <p className='text-gray-500'>Gerencie quais vendas já possuem nota emitida</p>
        </header>

        {/* Card de Resumo Rápido */}
        <div className='bg-orange-50 border border-orange-200 p-4 rounded-xl mb-8 flex items-center gap-4 text-orange-700'>
          <FileText size={24} />
          <div>
            <p className='text-sm font-medium'>Você tem <span className='font-bold'>{notasPendentes}</span> notas fiscais pendentes para emissão.</p>
          </div>
        </div>

        <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
          <table className='bg-gray-50 border-b border-gray-200'>
            <thead>
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Descrição</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Data</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Valor</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Status NF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {vendas.map((venda) => (
              <tr key={venda.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{venda.descricao}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(venda.data).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  R$ {Number(venda.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 flex justify-center">
                  <button 
                    onClick={() => toggleNF(venda.id, venda.nf_emitida)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      venda.nf_emitida 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500 hover:bg-orange-100 hover:text-orange-600'
                    }`}
                  >
                    {venda.nf_emitida ? (
                      <>
                        <CheckCircle size={14} /> Emitida
                      </>
                    ) : (
                      'Marcar como Emitida'
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    )
  }
