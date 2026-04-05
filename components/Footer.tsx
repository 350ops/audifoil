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
              <Image src="/img/imagesmaldivesa/logoboho.png" alt="eFoil Maldives" width={40} height={40} className="rounded-md" />
              <h3 className="text-lg font-bold tracking-wider">eFoil Maldives</h3>
            </div>
            <p className="mt-2 text-sm text-muted">
              Fly over paradise. The future of water sports in the Maldives — for riders and partners alike.
            </p>
          </div>

          {/* Lessons */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Book a Lesson</h4>
            <div className="flex flex-col gap-2">
              <Link href="/book/efoil-hulhumale" className="text-sm text-muted hover:text-foreground transition-colors">eFoil at Hulhumale</Link>
              <Link href="/book/efoil-maafushi" className="text-sm text-muted hover:text-foreground transition-colors">eFoil at Maafushi</Link>
              <Link href="/book" className="text-sm text-muted hover:text-foreground transition-colors">All Locations</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Company</h4>
            <div className="flex flex-col gap-2">
              <Link href="/partners" className="text-sm text-muted hover:text-foreground transition-colors">For Partners</Link>
              <Link href="/how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">How It Works</Link>
              <Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">About Us</Link>
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
                <Icon name="MapPin" size={16} /> Hulhumale, Maldives
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} eFoil Maldives. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
