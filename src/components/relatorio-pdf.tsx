'use client';

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { CardSim } from 'lucide-react';

// Estilos para o PDF
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#333' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderBottom: 2, 
    borderBottomColor: '#2563eb', 
    paddingBottom: 10, 
    marginBottom: 20 
  },
  companyInfo: { flex: 1 },
  reportTitle: { flex: 1, textAlign: 'right' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2563eb' },
  businessName: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  textMuted: { fontSize: 9, color: '#666' },
  
  cardGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  card: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: '#F3F4F6', 
    borderRadius: 4,
    borderLeft: 4,
    borderLeftColor: '#2563eb'
  },
  cardLabel: { fontSize: 8, textTransform: 'uppercase', color: '#666', marginBottom: 4 },
  cardValue: { fontSize: 14, fontWeight: 'bold' },

  table: { marginTop: 10 },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#2563eb', 
    color: 'white', 
    padding: 6, 
    fontWeight: 'bold',
    borderRadius: 2
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#E5E7EB', 
    padding: 6,
    alignItems: 'center'
  },
  colData: { width: '20%' },
  colDesc: { width: '50%' },
  colPgto: { width: '15%' },
  colValor: { width: '15%', textAlign: 'right' },

  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 40, 
    right: 40, 
    borderTopWidth: 0.5, 
    borderTopColor: '#CCC', 
    paddingTop: 10, 
    textAlign: 'center', 
    fontSize: 8, 
    color: '#999' 
  }
});

interface Props {
  vendas: any[];
  total: number;
  periodo: string;
  dadosEmpresa?: {
    nome_empresa: string
    cnpj: string
  }
}

export function RelatorioMensalPDF({ vendas, total, periodo, dadosEmpresa }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho Profissional */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.businessName}>{dadosEmpresa?.nome_empresa || 'Empresa não configurada'}</Text>
            <Text style={styles.textMuted}>CNPJ: {dadosEmpresa?.cnpj || '00.000.000/0000-00'}</Text>
          </View>
          <View style={styles.reportTitle}>
            <Text style={styles.title}>Relatório Mensal</Text>
            <Text style={styles.textMuted}>Referência: {periodo}</Text>
          </View>
        </View>

        {/* Cards de Resumo */}
        <View style={styles.cardGrid}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Faturamento Bruto</Text>
            <Text style={styles.cardValue}>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2})}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total de Vendas</Text>
            <Text style={styles.cardValue}>{vendas.length}</Text>
          </View>
        </View>

        {/* Tabela de Lançamentos */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colData}>Data</Text>
            <Text style={styles.colDesc}>Descrição</Text>
            <Text style={styles.colPgto}>Pagamento</Text>
            <Text style={styles.colValor}>Valor</Text>
          </View>

          {vendas.map((venda, i) => (
            <View key={i} style={styles.tableRow} wrap={false}>
              <Text style={styles.colData}>{new Date(venda.data).toLocaleDateString('pt-BR')}</Text>
              <Text style={styles.colDesc}>{venda.descricao}</Text>
              <Text style={styles.colPgto}>{venda.forma_pagamento || '-'}</Text>
              <Text style={styles.colValor}>R$ {Number(venda.valor).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Rodapé Legal */}
        <Text style={styles.footer}>
          Este documento é um relatório auxiliar de gestão. Verifique sempre sua declaração anual (DASN-SIMEI).
          Gerado via MEI Control em {new Date().toLocaleDateString('pt-BR')}
        </Text>        
      </Page>
    </Document>
  );
}