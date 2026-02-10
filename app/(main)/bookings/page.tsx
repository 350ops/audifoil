'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import AnimatedDiv from '@/components/AnimatedDiv';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: 'bg-green-500/10', text: 'text-green-600', label: 'Confirmed' },
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-600', label: 'Pending' },
  completed: { bg: 'bg-blue-500/10', text: 'text-blue-600', label: 'Completed' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-600', label: 'Cancelled' },
};

export default function BookingsPage() {
  const { activityBookings, loadActivityBookings } = useStore();

  useEffect(() => { loadActivityBookings(); }, []);

  const upcomingBookings = activityBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = activityBookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="pb-20">
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <AnimatedDiv animation="fadeIn">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="mt-2 text-muted">Your upcoming and past adventures</p>
        </AnimatedDiv>

        {activityBookings.length === 0 ? (
          <AnimatedDiv animation="scaleIn" delay={100} className="mt-12">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
              <Icon name="CalendarX" size={48} className="text-muted mb-4" />
              <h2 className="text-xl font-semibold">No bookings yet</h2>
              <p className="mt-2 text-muted">Your adventures will appear here once you book</p>
              <Button href="/activities" title="Browse Activities" variant="cta" rounded="full" className="mt-6" iconEnd="ArrowRight" />
            </div>
          </AnimatedDiv>
        ) : (
          <>
            {/* Upcoming */}
            {upcomingBookings.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-4 text-lg font-semibold">Upcoming</h2>
                <div className="space-y-4">
                  {upcomingBookings.map((booking, i) => {
                    const status = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
                    return (
                      <AnimatedDiv key={booking.id} animation="slideInBottom" delay={i * 60}>
                        <div className="rounded-2xl border border-border bg-secondary p-5 shadow-sm transition-shadow hover:shadow-md">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{booking.activity.title}</h3>
                              <div className="mt-1 flex items-center gap-3 text-sm text-muted">
                                <span className="flex items-center gap-1"><Icon name="Calendar" size={14} /> {booking.slot.dateLabel}</span>
                                <span className="flex items-center gap-1"><Icon name="Clock" size={14} /> {booking.slot.startTime}</span>
                                <span className="flex items-center gap-1"><Icon name="Users" size={14} /> {booking.guests}</span>
                              </div>
                            </div>
                            <span className={cn('rounded-full px-3 py-1 text-xs font-medium', status.bg, status.text)}>
                              {status.label}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                            <span className="text-xs text-muted">Code: <span className="font-mono font-medium text-foreground">{booking.confirmationCode}</span></span>
                            <span className="font-bold">${booking.totalPrice}</span>
                          </div>
                        </div>
                      </AnimatedDiv>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Past */}
            {pastBookings.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-4 text-lg font-semibold">Past</h2>
                <div className="space-y-4">
                  {pastBookings.map((booking, i) => {
                    const status = STATUS_STYLES[booking.status] || STATUS_STYLES.completed;
                    return (
                      <AnimatedDiv key={booking.id} animation="fadeIn" delay={i * 40}>
                        <div className="rounded-2xl border border-border bg-secondary p-5 opacity-70">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{booking.activity.title}</h3>
                              <p className="mt-1 text-sm text-muted">{booking.slot.dateLabel} · {booking.slot.startTime}</p>
                            </div>
                            <span className={cn('rounded-full px-3 py-1 text-xs font-medium', status.bg, status.text)}>
                              {status.label}
                            </span>
                          </div>
                        </div>
                      </AnimatedDiv>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
