'use client'

import Link from 'next/link'
import { Sparkles, Mail, Twitter, Github, Linkedin } from 'lucide-react'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border/50 bg-muted/30">
            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl">APPTZO</span>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-md mb-4">
                            Premium production-ready applications. 100% source code included.
                            Built with modern tech stacks. Free lifetime updates.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <a
                                href="mailto:hello@apptzo.com"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com/apptzo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://github.com/apptzo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="https://linkedin.com/company/apptzo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Browse Apps
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                                    My Requests
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p>© {currentYear} APPTZO — All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
