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
              <Image src="/img/imagesmaldivesa/logoboho.png" alt="Maldives Water Sports" width={40} height={40} className="rounded-md" />
              <h3 className="text-lg font-bold tracking-wider">Maldives Water Sports</h3>
            </div>
            <p className="mt-2 text-sm text-muted">
              Your trusted partner for world-class ocean activities, unforgettable memories, and unmatched service in the heart of paradise.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Services</h4>
            <div className="flex flex-col gap-2">
              <Link href="/activities/south-ari-atoll" className="text-sm text-muted hover:text-foreground transition-colors">South Ari Atoll Adventure</Link>
              <Link href="/activities/sunset-cruise" className="text-sm text-muted hover:text-foreground transition-colors">Sunset Cruise</Link>
              <Link href="/activities" className="text-sm text-muted hover:text-foreground transition-colors">All Excursions</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Company</h4>
            <div className="flex flex-col gap-2">
              <Link href="/how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">How It Works</Link>
              <Link href="/crew" className="text-sm text-muted hover:text-foreground transition-colors">About Us</Link>
              <Link href="/settings" className="text-sm text-muted hover:text-foreground transition-colors">Settings</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Contact</h4>
            <div className="flex flex-col gap-2">
              <a href="https://wa.me/9607772241" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
                <Icon name="MessageCircle" size={16} /> +960 7772241
              </a>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Icon name="MapPin" size={16} /> Nirolu magu 11, Hulhumalé
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} Maldives Water Sports. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
