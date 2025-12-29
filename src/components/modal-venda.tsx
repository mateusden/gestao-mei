'use client'

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"
import { X } from "lucide-react"

interface ModalVendaProps {
    isOpen: boolean
    onClose: () => void
}

export function ModalVenda({ isOpen, onClose }: ModalVendaProps) {
    const { user } = useUser()
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!user) return alert("Você precisa estar logado!")
        
        setLoading(true)
        const formData = new FormData(e.currentTarget)
    
        const { error } = await supabase.from('vendas').insert({
            user_id: user.id,
            descricao: formData.get('descricao'),
            valor: parseFloat(formData.get('valor') as string),
            data: formData.get('data'),
            forma_pagamento: formData.get('pagamento'),
        });

        if (error) {
            alert("Erro ao salvar: " + error.message)
        } else {
            // Sucesso!
            onClose()
            // Dica: Para a tabela atualizar sozinha, você precisaria de um estado global 
            // ou usar o router.refresh() do Next.js
            window.location.reload() 
        }
        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Nova Venda</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* ADICIONADO: onSubmit */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <input
                            name="descricao" // ADICIONADO
                            required
                            type="text"
                            placeholder="Ex: Consultoria de Marketing"
                            className="w-full px-4 py-2 border text-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                            <input
                                name="valor" // ADICIONADO
                                required
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                className="w-full px-4 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                            <input
                                name="data" // ADICIONADO
                                required
                                type="date"
                                className="w-full px-4 py-2 text-gray-400 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                        <select 
                            name="pagamento" // ADICIONADO
                            className="w-full px-4 py-2 text-gray-400 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Pix">Pix</option>
                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                            <option value="Boleto">Boleto</option>
                            <option value="Dinheiro">Dinheiro</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-4 disabled:bg-gray-400"
                    >   
                        {loading ? "Salvando..." : "Confirmar Receita"}
                    </button>
                </form>
            </div>
        </div>
    )
}