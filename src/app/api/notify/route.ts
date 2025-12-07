import { NextRequest, NextResponse } from 'next/server'

interface NotifyRequest {
    appName: string
    email: string
    phone?: string
}

export async function POST(request: NextRequest) {
    try {
        const data: NotifyRequest = await request.json()

        const { appName, email, phone } = data
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

        // Environment variables for notifications
        const adminEmail = process.env.ADMIN_EMAIL
        const adminWhatsApp = process.env.ADMIN_WHATSAPP
        const resendApiKey = process.env.RESEND_API_KEY
        const whatsappWebhookUrl = process.env.WHATSAPP_WEBHOOK_URL

        const results: { email?: boolean; whatsapp?: boolean } = {}

        // Send Email Notification via Resend
        if (resendApiKey && adminEmail) {
            try {
                const emailResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: 'Marketplace <noreply@resend.dev>',
                        to: [adminEmail],
                        subject: `📱 New Application Request – ${appName}`,
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #1a1a1a;">📱 New Application Request Received</h2>
                                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                    <p style="margin: 8px 0;"><strong>Application:</strong> ${appName}</p>
                                    <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
                                    <p style="margin: 8px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                                    <p style="margin: 8px 0;"><strong>Timestamp:</strong> ${timestamp}</p>
                                </div>
                                <p style="color: #666;">Please reach out to this lead immediately.</p>
                            </div>
                        `,
                    }),
                })

                results.email = emailResponse.ok
            } catch (emailError) {
                console.error('Email notification failed:', emailError)
                results.email = false
            }
        }

        // Send WhatsApp Notification via webhook (Zapier/Make.com)
        if (whatsappWebhookUrl) {
            try {
                const whatsappMessage = `📱 New Application Request Received

Application: ${appName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Timestamp: ${timestamp}

Please reach out immediately.`

                const whatsappResponse = await fetch(whatsappWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: whatsappMessage,
                        phone: adminWhatsApp,
                        appName,
                        email,
                        userPhone: phone,
                        timestamp,
                    }),
                })

                results.whatsapp = whatsappResponse.ok
            } catch (whatsappError) {
                console.error('WhatsApp notification failed:', whatsappError)
                results.whatsapp = false
            }
        }

        return NextResponse.json({
            success: true,
            notifications: results,
        })
    } catch (error: any) {
        console.error('Notification API error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
