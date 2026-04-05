import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HotelSignal — Inteligencia comercial para hoteles',
  description: 'Detecta oportunidades de venta directa y mejora tu propuesta comercial con IA.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
