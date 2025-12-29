'use client'

import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { format } from 'date-fns'; // npm install date-fns (opcional, para formatar datas)
import { ptBR, tr } from 'date-fns/locale';

export function TabelaVendas() {
    const { user } = useUser()
    const [vendas, setVendas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true)

    async function buscarVendas() {
        if (!user) return

        const { data, error } = await supabase
        .from('vendas')
        .select('*')
        .eq('user_id', user.id)
        .order('data', { ascending: false });

        if (!error) setVendas(data)
        setLoading(false)
    }

    useEffect(() => {
        buscarVendas();
    }, [user])

    if (loading) return <p className='text-gray-500'>A carregar vendas...</p>

    return (
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
            <table className='w-full text-left'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                    <tr>
                        <th className='px-6 py-4 text-sm font-semibold text-gray-600'>Descrição</th>
                        <th className='px-6 py-4 text-sm font-semibold text-gray-600'>Data</th>
                        <th className='px-6 py-4 text-sm font-semibold text-gray-600'>Pagamento</th>
                        <th className='px-6 py-4 text-sm font-semibold text-gray-600'>Valor</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                    {vendas.length === 0 ? (
                        <tr>
                            <td colSpan={4} className='px-6 py-8 text-center text-gray-500'>
                                Nenhuma venda registrada ainda.
                            </td>
                        </tr>
                    ) : (
                        vendas.map((venda) => (
                            <tr key={venda.id} className='hover:bg-gray-50 transition-colors'>
                                <td className='px-6 py-4 text-sm text-gray-800 font-medium'>{venda.descricao}</td>
                                <td className='px-6 py-4 text-sm text-gray-800'>
                                    {new Date(venda.data).toLocaleDateString('pt-PT')}
                                </td>
                                <td className='px-6 py-4'>
                                    <span className='px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full'>
                                        {venda.forma_pagamento}
                                    </span>
                                </td>
                                <td className='px-6 py-4 text-sm font-bold text-green-800'>
                                    R$ {Number(venda.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}