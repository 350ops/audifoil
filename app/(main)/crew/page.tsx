'use client';

import Image from 'next/image';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { LOCAL_IMAGES, ACTIVITIES, MALDIVES_ADVENTURE_ID } from '@/data/activities';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

const AIRLINES = [
  { code: 'EK', name: 'Emirates', color: '#D71920' },
  { code: 'QR', name: 'Qatar Airways', color: '#5C0632' },
  { code: 'EY', name: 'Etihad Airways', color: '#BD8B40' },
  { code: 'TK', name: 'Turkish Airlines', color: '#C8102E' },
  { code: 'FZ', name: 'Flydubai', color: '#E31837' },
  { code: 'SQ', name: 'Singapore Airlines', color: '#F7B500' },
  { code: 'UL', name: 'SriLankan Airlines', color: '#003366' },
  { code: 'BA', name: 'British Airways', color: '#0055A4' },
  { code: 'LH', name: 'Lufthansa', color: '#05164D' },
  { code: 'G9', name: 'Air Arabia', color: '#ED1C24' },
];

export default function CrewPage() {
  const router = useRouter();
  const { setSelectedActivity } = useStore();

  const handleBookNow = () => {
    const adventure = ACTIVITIES.find((a) => a.id === MALDIVES_ADVENTURE_ID);
    if (adventure) {
      setSelectedActivity(adventure);
      router.push('/booking/select-time');
    }
  };

  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[350px]">
        <Image src={LOCAL_IMAGES.crewOnABoat} alt="Crew on a boat" fill className="object-cover" priority />
        <div className="gradient-hero absolute inset-0" />
        <div className="relative flex h-full flex-col justify-end p-6 lg:p-12">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex items-center gap-3">
              <Icon name="Plane" size={28} color="white" />
              <h1 className="text-4xl font-bold text-white lg:text-5xl">For Airline Crew</h1>
            </div>
            <p className="mt-3 max-w-2xl text-lg text-white/90">
              On a layover in Malé? Make it the best day of your trip.
              Boho Waves was built by a crew member, for crew members.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* How crew book */}
        <section className="mt-12">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-2xl font-bold">How Crew Book</h2>
            <p className="mt-2 text-muted">Fill your group, pay less. Simple.</p>
          </AnimatedDiv>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', title: 'Pick a date', desc: 'One person picks a trip date and taps "Join Trip"', icon: 'Calendar' },
              { step: '2', title: 'Share with crew', desc: 'Share the link in your crew WhatsApp group', icon: 'Share2' },
              { step: '3', title: 'Fill the group', desc: 'Once 4-5 people join, everyone locks in $80/person', icon: 'Users' },
              { step: '4', title: 'Enjoy the day', desc: 'We pick you up. Best day of your layover.', icon: 'Smile' },
            ].map((item, i) => (
              <AnimatedDiv key={item.step} animation="scaleIn" delay={100 + i * 60}>
                <div className="rounded-2xl border border-border bg-secondary p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-highlight text-sm font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.desc}</p>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </section>

        {/* Airlines that fly to MLE */}
        <section className="mt-12">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-2xl font-bold">Airlines Flying to Malé</h2>
            <p className="mt-2 text-muted">Crew from these airlines regularly join our trips</p>
          </AnimatedDiv>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {AIRLINES.map((airline) => (
              <AnimatedDiv key={airline.code} animation="scaleIn" delay={50}>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary p-3 transition-shadow hover:shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: airline.color }}>
                    {airline.code}
                  </div>
                  <span className="text-sm font-medium truncate">{airline.name}</span>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </section>

        {/* Pricing for crew */}
        <section className="mt-12">
          <AnimatedDiv animation="fadeIn">
            <div className="gradient-cta rounded-2xl p-8 text-white lg:p-10">
              <h2 className="text-2xl font-bold">Crew Special: $80/person</h2>
              <p className="mt-3 text-white/90 max-w-2xl leading-relaxed">
                For $80, you and your crew get dolphins, snorkeling, a private sandbank, picnic lunch,
                an e-foil session, and a sunset cruise — all in 5 hours, with hotel pickup.
              </p>
              <p className="mt-4 text-white/80 text-sm">
                That&apos;s less than a resort snorkeling excursion. And we include an e-foil session worth $150+.
              </p>
              <div className="mt-6">
                <Button title="Book Your Trip" variant="ghost" size="large" rounded="full"
                  className="border-2 border-white text-white hover:bg-white/10"
                  iconEnd="ArrowRight" onPress={handleBookNow} />
              </div>
            </div>
          </AnimatedDiv>
        </section>

        {/* Testimonials */}
        <section className="mt-12">
          <AnimatedDiv animation="fadeIn">
            <h2 className="text-2xl font-bold">What Crew Say</h2>
          </AnimatedDiv>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { quote: 'Best layover activity ever. The e-foil alone was worth it!', airline: 'Emirates crew', code: 'EK' },
              { quote: 'We go every time we have a long Malé layover. The team knows us by name now.', airline: 'Qatar crew', code: 'QR' },
              { quote: 'Swimming with dolphins and snorkeling reefs — all for $80. Absolute steal.', airline: 'Turkish crew', code: 'TK' },
            ].map((t, i) => (
              <AnimatedDiv key={i} animation="scaleIn" delay={100 + i * 60}>
                <div className="rounded-2xl border border-border bg-secondary p-5 shadow-sm">
                  <Icon name="Quote" size={20} className="text-highlight mb-3" />
                  <p className="text-sm text-muted italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: AIRLINES.find((a) => a.code === t.code)?.color || '#666' }}>
                      {t.code}
                    </div>
                    <span className="text-sm font-medium">{t.airline}</span>
                  </div>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
