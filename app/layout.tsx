import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import StripePaymentProvider from '@/contexts/StripeContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Boho Waves — Your Best Day in the Maldives',
  description: '5-hour Maldives adventure: dolphins, snorkeling, private sandbank, e-foil, sunset cruise. From $80/person.',
  openGraph: {
    title: 'Boho Waves — Your Best Day in the Maldives',
    description: 'Dolphins, snorkeling, sandbank, e-foil, sunset cruise. All in one unforgettable day.',
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
