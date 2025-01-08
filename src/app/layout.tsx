import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/app/components/theme-provider'
import { AuthProvider } from '@/app/contexts/auth-context'
import { Navbar } from '@/app/components/navbar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Orel - Full Stack Developer',
  description: 'Portfolio and blog of a full stack developer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>{children}</main>
           
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

