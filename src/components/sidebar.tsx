'use client'

import Link from "next/link"
import { 
  LayoutDashboard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  FileText, 
  Receipt, 
  BarChart3 
} from 'lucide-react';
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: 'Visão Geral', href: '/' },
  { icon: ArrowUpCircle, label: 'Receitas', href: '/receitas' },
  { icon: ArrowDownCircle, label: 'Despesas', href: '/despesas' },
  { icon: FileText, label: 'Notas Fiscais', href: '/notas' },
  { icon: Receipt, label: 'Imposto DAS', href: '/das' },
  { icon: BarChart3, label: 'Relatórios', href: '/relatorios' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-600">MEI Control</h2>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Rodapé da Sidebar com Link de Configurações */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <Link 
          href="/configuracoes"
          className={`flex items-center gap-3 px-4 py-2 mb-4 rounded-lg text-sm transition-colors ${
            pathname === '/configuracoes' 
              ? 'bg-gray-100 text-blue-600 font-bold' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          {/* Importe o icon Building2 ou Settings da lucide-react se quiser trocar */}
          <LayoutDashboard size={18} className="opacity-70" /> 
          Configurações da Empresa
        </Link>

        <div className="flex items-center gap-3 px-2">
          <UserButton afterSignOutUrl="/sign-in" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-gray-700 truncate">Perfil</span>
            <span className="text-xs text-gray-500">MEI Ativo</span>
          </div>
        </div>
      </div>
    </aside>
    )
}