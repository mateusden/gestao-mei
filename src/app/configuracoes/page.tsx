'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"
import { Save, Building2, Mail, Fingerprint, Loader2 } from "lucide-react"

export default function ConfiguracoesPage() {
    const { isLoaded, user } = useUser(); // Adicionado isLoaded
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        nome_empresa: '',
        cnpj: '',
        email_contato: '',
        atividade: 'Serviços' // Valor padrão para não vir vazio
    });

    useEffect(() => {
        async function carregarPerfil() {
            // Só tenta buscar se o Clerk terminou de carregar e o usuário existe
            if (!isLoaded || !user) return;

            try {
                const { data, error } = await supabase
                    .from('perfis_empresa')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (data) {
                    setFormData({
                        nome_empresa: data.nome_empresa || '',
                        cnpj: data.cnpj || '',
                        email_contato: data.email_contato || '',
                        atividade: data.atividade || 'Serviços'
                    });
                }
            } catch (err) {
                console.error("Erro ao carregar perfil:", err);
            } finally {
                setLoading(false);
            }
        }
        carregarPerfil();
    }, [isLoaded, user]); // Dependências corrigidas

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;
        
        setSaving(true);

        const { error } = await supabase
            .from('perfis_empresa')
            .upsert({
                user_id: user.id,
                nome_empresa: formData.nome_empresa,
                cnpj: formData.cnpj,
                email_contato: formData.email_contato,
                atividade: formData.atividade,
                updated_at: new Date()
            }, { onConflict: 'user_id' });

        if (!error) {
            alert('Configurações salvas com sucesso!');
        } else {
            alert('Erro ao salvar: ' + error.message);
        }
        setSaving(false); // Liberar o botão
    }

    // Se o Clerk ainda está carregando a sessão, mostra o loader
    if (!isLoaded || loading) {
        return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Configurações da Empresa</h1>
                <p className="text-gray-500">Mantenha os dados da sua empresa atualizados para os relatórios</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa / Razão Social</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={formData.nome_empresa}
                                onChange={(e) => setFormData({ ...formData, nome_empresa: e.target.value })}
                                className="w-full pl-10 text-gray-500 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Ex: Souza Serviços Digitais LTDA"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                            <div className="relative">
                                <Fingerprint className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.cnpj}
                                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                    className="w-full text-gray-500 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="12.345.678/0001-00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Contato</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={formData.email_contato}
                                    onChange={(e) => setFormData({ ...formData, email_contato: e.target.value })}
                                    className="w-full pl-10 pr-4 text-gray-500 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="contato@empresa.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Atividade MEI</label>
                            <select
                                value={formData.atividade}
                                onChange={(e) => setFormData({ ...formData, atividade: e.target.value })}
                                className="w-full px-4 py-2 text-sm text-gray-500 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="Comércio">Comércio / Indústria (ICMS)</option>
                                <option value="Serviços">Prestação de Serviços (ISS)</option>
                                <option value="Ambos">Comércio e Serviços (ICMS + ISS)</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Salvar Alterações
                </button>
            </form>
        </div>
    )
}