'use client';

import { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FileDown, Loader2 } from 'lucide-react';
import { RelatorioMensalPDF } from '@/components/relatorio-pdf';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';

interface BotaoExportarProps {
  vendas: any[];
  total: number;
}

export function BotaoExportar({ vendas, total }: BotaoExportarProps) {
  const { user } = useUser();
  const [dadosEmpresa, setDadosEmpresa] = useState<any>(null);
  const [carregandoDados, setCarregandoDados] = useState(true);

  // Busca os dados da empresa salvos na página de configurações
  useEffect(() => {
    async function buscarPerfil() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('perfis_empresa')
        .select('nome_empresa, cnpj')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setDadosEmpresa(data);
      }
      setCarregandoDados(false);
    }

    buscarPerfil();
  }, [user]);

  // Se ainda estiver buscando os dados do banco, mostra um estado de carregamento simples
  if (carregandoDados) {
    return (
      <button disabled className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold cursor-not-allowed">
        <Loader2 className="animate-spin" size={20} />
        Carregando...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={
        <RelatorioMensalPDF 
          vendas={vendas} 
          total={total} 
          periodo="Dezembro/2025" 
          dadosEmpresa={dadosEmpresa} // Passa os dados buscados para o PDF
        />
      }
      fileName={`relatorio-mei-${dadosEmpresa?.nome_empresa || 'gestao'}.pdf`}
      className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition-all shadow-md"
    >
      {({ loading }) => (
        <>
          <FileDown size={20} />
          {loading ? 'Gerando arquivo...' : 'Exportar PDF'}
        </>
      )}
    </PDFDownloadLink>
  );
}