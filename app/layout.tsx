import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import StripePaymentProvider from '@/contexts/StripeContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maldives Tours',
  description: 'Day Trips. Snorkeling. Fishing. Diving. Island hopping. Surfing and more.',
  openGraph: {
    title: 'Maldives Tours',
    description: 'Day Trips. Snorkeling. Fishing. Diving. Island hopping. Surfing and more.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <StripePaymentProvider>
              {children}
            </StripePaymentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
