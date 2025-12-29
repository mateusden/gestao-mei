'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"
import { Trash2 } from "lucide-react"
import { tr } from "date-fns/locale"

export function TabelaDespesas() {
    const { user } = useUser()
    const [despesas, setDespesas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    async function buscarDespesas() {
        if (!user) return

        const { data, error } = await supabase
            .from('despesas')
            .select('*')
            .eq('user_id', user.id)
            .order('data', { ascending: false })

        if (!error) setDespesas(data)
        setLoading(false)
    }

    useEffect(() => {
        buscarDespesas()
    }, [user])

    if (loading) return <p className="text-gray-500">Carregando despesas...</p>

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Descrição</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Categoria</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Data</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Valor</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {despesas.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Nenhuma despesa registrada.</td>
                        </tr>
                    ) : (
                        despesas.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{item.descricao}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full">
                                        {item.categoria}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(item.data).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-red-600">
                                    - R$ {Number(item.valor).toLocaleString('pt-BR', {minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}