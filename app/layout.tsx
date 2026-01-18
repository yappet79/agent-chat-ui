import './globals.css'

export const metadata = {
  title: 'AI Software House',
  description: 'Multi-agent dev platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
