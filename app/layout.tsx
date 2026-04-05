import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import StripePaymentProvider from '@/contexts/StripeContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'eFoil Maldives — Fly Over Paradise',
  description: 'Book 60-minute eFoil lessons in Hulhumale and Maafushi. Revenue share partnerships for resorts, yachts, guesthouses & watersport centers. No investment needed.',
  openGraph: {
    title: 'eFoil Maldives — Fly Over Paradise',
    description: 'The future of water sports in the Maldives. Book eFoil lessons or become a partner — zero investment, instant revenue.',
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
