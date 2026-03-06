import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import StripePaymentProvider from '@/contexts/StripeContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maldives Water Sports — World-Class Ocean Activities',
  description: 'Excursions, water sports & island adventures in the Maldives. Dolphins, snorkeling, sunset cruises, fishing, jet ski & more. Book via WhatsApp.',
  openGraph: {
    title: 'Maldives Water Sports — World-Class Ocean Activities',
    description: 'Your trusted partner for world-class ocean activities, unforgettable memories, and unmatched service in the heart of paradise.',
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
