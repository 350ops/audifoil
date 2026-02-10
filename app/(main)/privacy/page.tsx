'use client';

import AnimatedDiv from '@/components/AnimatedDiv';

export default function PrivacyPage() {
    return (
        <div className="pb-20 pt-12">
            <div className="mx-auto max-w-4xl px-4 lg:px-8">
                <AnimatedDiv animation="fadeIn">
                    <h1 className="text-3xl font-bold lg:text-4xl">Privacy Policy</h1>
                    <p className="mt-2 text-muted">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <div className="mt-8 space-y-8 text-foreground/90">
                        <section>
                            <h2 className="mb-3 text-xl font-bold">1. Introduction</h2>
                            <p className="leading-relaxed">
                                Boho Waves ("we," "our," or "us") respects your privacy and is committed to protecting your personal data.
                                This privacy policy will inform you as to how we look after your personal data when you visit our website
                                (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold">2. Data We Collect</h2>
                            <p className="leading-relaxed">
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                                <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold">3. How We Use Your Data</h2>
                            <p className="leading-relaxed">
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., booking a trip).</li>
                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal or regulatory obligation.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold">4. Data Security</h2>
                            <p className="leading-relaxed">
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                                In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold">5. Third-Party Services</h2>
                            <p className="leading-relaxed">
                                We use Stripe for payment processing. We do not store your credit card information on our servers.
                                The processing of payments will be subject to the terms, conditions and privacy policies of Stripe in addition to this privacy policy.
                                We also use Google and Apple for authentication services.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-xl font-bold">6. Contact Us</h2>
                            <p className="leading-relaxed">
                                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                                <a href="mailto:hello@bohowaves.com" className="ml-1 font-medium text-highlight hover:underline">hello@bohowaves.com</a>
                            </p>
                        </section>
                    </div>
                </AnimatedDiv>
            </div>
        </div>
    );
}
