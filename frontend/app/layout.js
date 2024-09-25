import './globals.css'
import { Providers } from "./providers";

export const metadata = {
  title: 'Trip Planning App',
  description: 'Plan your perfect trip with our AI-powered app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}