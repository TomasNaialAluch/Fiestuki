import { Inter } from 'next/font/google'
import './globals.css'
import { AppProviders } from '../src/context/AppProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Fiestuki',
  description: 'Tu tienda de fiestas online',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
