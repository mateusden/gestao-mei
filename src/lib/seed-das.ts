import { supabase } from "./supabase";

export async function gerarImpostos2025(userId: string, atividade: string = 'Serviços') {
    // Cálculo real: 5% do SM (R$ 75,70) + impostos da atividade
    const baseINSS = 75.70; 
    let adicional = 0;

    if (atividade === 'Comércio') adicional = 1.00; // ICMS
    if (atividade === 'Serviços') adicional = 5.00; // ISS
    if (atividade === 'Ambos') adicional = 6.00;    // ICMS + ISS

    const valorFinal = baseINSS + adicional;

    const meses = [
        { nome: 'Janeiro', vencimento: '2025-02-20' },
        { nome: 'Fevereiro', vencimento: '2025-03-20' },
        { nome: 'Março', vencimento: '2025-04-22' },
        { nome: 'Abril', vencimento: '2025-05-20' },
        { nome: 'Maio', vencimento: '2025-06-20' },
        { nome: 'Junho', vencimento: '2025-07-21' },
        { nome: 'Julho', vencimento: '2025-08-20' },
        { nome: 'Agosto', vencimento: '2025-09-22' },
        { nome: 'Setembro', vencimento: '2025-10-20' },
        { nome: 'Outubro', vencimento: '2025-11-20' },
        { nome: 'Novembro', vencimento: '2025-12-22' },
        { nome: 'Dezembro', vencimento: '2026-01-20' },
    ];

    const dadosParaInserir = meses.map(mes => ({
        user_id: userId,
        mes_referencia: `${mes.nome}/2025`,
        vencimento: mes.vencimento,
        valor: valorFinal,
        status: 'Pendente'
    }));

    const { error } = await supabase.from('impostos_das').insert(dadosParaInserir);
    return { error };
}