import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Terms of Service | APPTZO',
    description: 'Terms of Service for APPTZO - Read our terms and conditions.',
}

export default function TermsOfServicePage() {
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

                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

                <div className="prose dark:prose-invert max-w-none space-y-6">
                    <p className="text-muted-foreground">
                        Last updated: December 2024
                    </p>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using APPTZO, you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Products and Services</h2>
                        <p>
                            APPTZO provides production-ready application source code for purchase. Each purchase includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Complete source code of the application</li>
                            <li>Documentation for setup and deployment</li>
                            <li>Free lifetime updates for the purchased version</li>
                            <li>Direct support from the development team</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">3. License</h2>
                        <p>
                            Upon purchase, you receive a non-exclusive, non-transferable license to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Use the source code for personal or commercial projects</li>
                            <li>Modify the code to suit your needs</li>
                            <li>Deploy the application on your own infrastructure</li>
                        </ul>
                        <p className="mt-4">
                            <strong>You may NOT:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Resell or redistribute the source code</li>
                            <li>Use the code to create competing products for sale</li>
                            <li>Share your purchase with others who have not purchased a license</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Payment and Refunds</h2>
                        <p>
                            All payments are processed securely. Due to the digital nature of our products,
                            refunds are handled on a case-by-case basis. Please contact us if you experience
                            any issues with your purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Disclaimer</h2>
                        <p>
                            The applications are provided "as is" without warranty of any kind. While we strive
                            to provide high-quality, production-ready code, you are responsible for testing and
                            validating the applications for your specific use case.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
                        <p>
                            APPTZO shall not be liable for any indirect, incidental, special, consequential,
                            or punitive damages resulting from your use of our products or services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Changes will be effective
                            immediately upon posting to this page. Your continued use of our services constitutes
                            acceptance of the updated terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact</h2>
                        <p>
                            For any questions regarding these Terms of Service, please contact us at{' '}
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
