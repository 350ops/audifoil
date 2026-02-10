import Link from 'next/link';
import Image from 'next/image';
import Icon from './Icon';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <Image src="/img/imagesmaldivesa/logoboho.png" alt="Boho Waves" width={40} height={40} className="rounded-md" />
              <h3 className="text-lg font-bold tracking-wider">Boho Waves</h3>
            </div>
            <p className="mt-2 text-sm text-muted">
              Your best day in the Maldives. Dolphins, snorkeling, sandbank, e-foil — all in one trip.
            </p>
          </div>

          {/* Experiences */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Experiences</h4>
            <div className="flex flex-col gap-2">
              <Link href="/activities/maldives-adventure" className="text-sm text-muted hover:text-foreground transition-colors">Maldives Adventure</Link>
              <Link href="/activities/efoil-session" className="text-sm text-muted hover:text-foreground transition-colors">E-Foil Experience</Link>
              <Link href="/activities" className="text-sm text-muted hover:text-foreground transition-colors">All Activities</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Company</h4>
            <div className="flex flex-col gap-2">
              <Link href="/how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">How It Works</Link>
              <Link href="/crew" className="text-sm text-muted hover:text-foreground transition-colors">For Airline Crew</Link>
              <Link href="/privacy" className="text-sm text-muted hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-muted hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/settings" className="text-sm text-muted hover:text-foreground transition-colors">Settings</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Contact</h4>
            <div className="flex flex-col gap-2">
              <a href="https://wa.me/960XXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
                <Icon name="MessageCircle" size={16} /> WhatsApp
              </a>
              <a href="mailto:hello@bohowaves.com" className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
                <Icon name="Mail" size={16} /> hello@bohowaves.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} Boho Waves Watersports. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
