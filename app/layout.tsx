import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import StripePaymentProvider from '@/contexts/StripeContext';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://maldivian.tours'),
  title: 'maldivian.tours — Local Boats, Real Maldivian Experiences',
  description: 'Book directly with verified Hulhumalé captains. Snorkeling, sandbank visits, dolphin watching, fishing — half-day and full-day experiences on local boats.',
  openGraph: {
    title: 'maldivian.tours — Local Boats, Real Maldivian Experiences',
    description: 'A curated marketplace connecting Hulhumalé captains with travellers, expats and crew looking for authentic days at sea.',
    type: 'website',
    url: 'https://maldivian.tours',
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
