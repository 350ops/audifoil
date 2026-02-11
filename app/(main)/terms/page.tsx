'use client';

import AnimatedDiv from '@/components/AnimatedDiv';

export default function TermsPage() {
    return (
        <div className="pb-20 pt-12">
            <div className="mx-auto max-w-4xl px-4 lg:px-8">
                <AnimatedDiv animation="fadeIn">
                    <h1 className="text-3xl font-bold lg:text-4xl">Terms of Service</h1>
                    <p className="mt-2 text-muted">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <div className="mt-8 space-y-8 text-foreground/90">
                        <section>
                            <h2 className="mb-3 text-xl font-bold">1. Agreement to Terms</h2>
                            <p className="leading-relaxed">
                                By accessing or using our website and services, you agree to be bound by these Terms of Service.
                                If you do not agree to agree to these Terms, you may not access or use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold">2. Booking & Cancellation Policy</h2>
                            <p className="leading-relaxed">
                                <strong>Booking:</strong> All bookings are subject to availability and confirmation. A booking is only confirmed once full payment has been received.
                            </p>
                            <p className="mt-2 leading-relaxed">
                                <strong>Cancellation:</strong> We offer a flexible cancellation policy.
                                You may cancel your booking for a full refund up to 24 hours before the scheduled start time of your trip.
                                Cancellations made within 24 hours of the trip are non-refundable, except in cases of documented medical emergencies or at our sole discretion.
                            </p>
                            <p className="mt-2 leading-relaxed">
                                <strong>Weather:</strong> Trips are subject to weather conditions. If we cancel a trip due to unsafe weather conditions,
                                you will be offered either an alternative date or a full refund.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold">3. Liability Waiver</h2>
                            <p className="leading-relaxed">
                                Participation in water sports and boat activities involves inherent risks.
                                By booking a trip with Boho Waves, you acknowledge these risks and agree to release Boho Waves, its employees, and agents from liability for any injury, loss, or damage arising from your participation, except where such injury or loss is caused by our gross negligence or willful misconduct.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold">4. User Conduct</h2>
                            <p className="leading-relaxed">
                                You agree not to use the website for any unlawful purpose or in any way that interrupts, damages, or impairs the service.
                                We reserve the right to refuse service to anyone for any reason at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold">5. Changes to Terms</h2>
                            <p className="leading-relaxed">
                                We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms of Service on this page.
                                Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold">6. Contact Information</h2>
                            <p className="leading-relaxed">
                                Questions about the Terms of Service should be sent to us at:
                                <a href="mailto:hello@bohowaves.com" className="ml-1 font-medium text-highlight hover:underline">hello@bohowaves.com</a>
                            </p>
                        </section>
                    </div>
                </AnimatedDiv>
            </div>
        </div>
    );
}
