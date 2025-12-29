import { ClerkProvider } from "@clerk/nextjs";
import { Sidebar } from "@/components/sidebar";
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="pt-br">
        <body className="bg-gray-50 flex min-h-screen text-gray-900">
          <Sidebar />
          {/* O flex-1 faz o main ocupar o resto da largura, e o bg-gray-50 tira o preto */}
          <main className="flex-1 p-4 md:p-8 bg-gray-50 ml-64">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}