import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Privacy Policy | APPTZO',
    description: 'Privacy Policy for APPTZO - Learn how we collect, use, and protect your data.',
}

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 md:px-8 py-12 max-w-4xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Marketplace
                </Link>

                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

                <div className="prose dark:prose-invert max-w-none space-y-6">
                    <p className="text-muted-foreground">
                        Last updated: December 2024
                    </p>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
                        <p>
                            When you use APPTZO, we may collect the following information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li><strong>Account Information:</strong> Your name and email address when you sign in with Google or email.</li>
                            <li><strong>Contact Information:</strong> Phone number if you choose to provide it when requesting an application.</li>
                            <li><strong>Usage Data:</strong> Information about how you interact with our website.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Process your application requests and contact you about them</li>
                            <li>Send you updates about your orders and our services</li>
                            <li>Improve our website and services</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Storage and Security</h2>
                        <p>
                            We use Supabase to securely store your data. Your information is protected using
                            industry-standard encryption and security practices. We do not sell or share your
                            personal information with third parties except as required to provide our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Google OAuth</h2>
                        <p>
                            When you sign in with Google, we receive your name and email address from Google.
                            We use this information solely to create and manage your account. We do not access
                            any other Google services or data on your behalf.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Access the personal data we hold about you</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Withdraw consent for data processing</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Cookies</h2>
                        <p>
                            We use essential cookies to maintain your session and preferences. These cookies
                            are necessary for the website to function properly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at{' '}
                            <a href="mailto:hello@apptzo.com" className="text-primary hover:underline">
                                hello@apptzo.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
