import { Resend } from 'resend'
import { contactSchema } from '@/lib/contact-schema'

const resend = new Resend(process.env.RESEND_API_KEY)
const CONTACT_EMAIL = process.env.REALTOR_CONTACT_EMAIL || 'abdulbasharmalrealtor@gmail.com'

// Simple rate limiter: max 5 requests per IP per minute
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
    const now = Date.now()

    // Evict expired entries periodically (when map gets large)
    if (rateMap.size > 1000) {
        for (const [key, val] of rateMap) {
            if (now > val.resetAt) rateMap.delete(key)
        }
    }

    const entry = rateMap.get(ip)
    if (!entry || now > entry.resetAt) {
        rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
        return false
    }
    entry.count++
    return entry.count > RATE_LIMIT
}

// HTML-escape user input to prevent injection in email templates
function esc(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

export async function POST(request: Request) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
        if (isRateLimited(ip)) {
            return Response.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 })
        }

        // Server-side validation
        const body = await request.json()
        const result = contactSchema.safeParse(body)
        if (!result.success) {
            return Response.json({ success: false, error: 'Invalid form data', details: result.error.flatten() }, { status: 400 })
        }

        const { firstName, lastName, email, phone, message, intent, language, listingAddress } = result.data

        // Escape all user values for HTML email
        const safeFirstName = esc(firstName)
        const safeLastName = esc(lastName)
        const safeEmail = esc(email)
        const safePhone = phone ? esc(phone) : ''
        const safeMessage = esc(message)
        const safeIntent = intent ? esc(intent) : ''
        const safeLanguage = language ? esc(language) : ''
        const safeListingAddress = listingAddress ? esc(listingAddress) : ''

        const { error } = await resend.emails.send({
            from: 'Abdul Basharmal <no-reply@abdulsellshomes.com>',
            to: CONTACT_EMAIL,
            replyTo: email,
            subject: `New ${safeIntent || 'Contact'} Inquiry from ${safeFirstName} ${safeLastName}`,
            html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:Georgia,'Times New Roman',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:2px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

<!-- Header -->
<tr>
<td style="background-color:#1a1a1a;padding:32px 40px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:400;letter-spacing:2px;">ABDUL BASHARMAL</h1>
<p style="margin:6px 0 0;color:#b8a88a;font-size:11px;letter-spacing:3px;font-family:Arial,Helvetica,sans-serif;">REALTOR&reg; &middot; RE/MAX TWIN CITY</p>
</td>
</tr>

<!-- Gold accent line -->
<tr><td style="background-color:#b8a88a;height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>

<!-- Title -->
<tr>
<td style="padding:32px 40px 16px;">
<h2 style="margin:0;color:#1a1a1a;font-size:18px;font-weight:400;letter-spacing:1px;">New ${safeIntent || 'Contact'} Inquiry</h2>
<p style="margin:8px 0 0;color:#888;font-size:12px;font-family:Arial,Helvetica,sans-serif;">Received from your website</p>
</td>
</tr>

<!-- Divider -->
<tr><td style="padding:0 40px;"><div style="border-top:1px solid #e8e4dc;"></div></td></tr>

<!-- Contact Details -->
<tr>
<td style="padding:24px 40px;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="padding:8px 0;vertical-align:top;">
<span style="color:#999;font-size:11px;letter-spacing:1px;font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;">Name</span><br>
<span style="color:#1a1a1a;font-size:15px;">${safeFirstName} ${safeLastName}</span>
</td>
</tr>
<tr>
<td style="padding:8px 0;vertical-align:top;">
<span style="color:#999;font-size:11px;letter-spacing:1px;font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;">Email</span><br>
<a href="mailto:${safeEmail}" style="color:#1a1a1a;font-size:15px;text-decoration:none;">${safeEmail}</a>
</td>
</tr>
${safePhone ? `<tr>
<td style="padding:8px 0;vertical-align:top;">
<span style="color:#999;font-size:11px;letter-spacing:1px;font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;">Phone</span><br>
<a href="tel:${safePhone}" style="color:#1a1a1a;font-size:15px;text-decoration:none;">${safePhone}</a>
</td>
</tr>` : ''}
${safeIntent ? `<tr>
<td style="padding:8px 0;vertical-align:top;">
<span style="color:#999;font-size:11px;letter-spacing:1px;font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;">Interest</span><br>
<span style="color:#1a1a1a;font-size:15px;">${safeIntent}</span>
</td>
</tr>` : ''}
${safeLanguage ? `<tr>
<td style="padding:8px 0;vertical-align:top;">
<span style="color:#999;font-size:11px;letter-spacing:1px;font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;">Preferred Language</span><br>
<span style="color:#1a1a1a;font-size:15px;">${safeLanguage}</span>
</td>
</tr>` : ''}
${safeListingAddress ? `<tr>
<td style="padding:8px 0;vertical-align:top;">
<span style="color:#999;font-size:11px;letter-spacing:1px;font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;">Listing Address</span><br>
<span style="color:#1a1a1a;font-size:15px;">${safeListingAddress}</span>
</td>
</tr>` : ''}
</table>
</td>
</tr>

<!-- Divider -->
<tr><td style="padding:0 40px;"><div style="border-top:1px solid #e8e4dc;"></div></td></tr>

<!-- Message -->
<tr>
<td style="padding:24px 40px 32px;">
<span style="color:#999;font-size:11px;letter-spacing:1px;font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;">Message</span>
<p style="margin:10px 0 0;color:#1a1a1a;font-size:15px;line-height:1.7;">${safeMessage}</p>
</td>
</tr>

<!-- Reply CTA -->
<tr>
<td style="padding:0 40px 36px;" align="center">
<a href="mailto:${safeEmail}" style="display:inline-block;background-color:#1a1a1a;color:#ffffff;font-size:13px;font-family:Arial,Helvetica,sans-serif;letter-spacing:2px;text-decoration:none;padding:14px 36px;border-radius:2px;">REPLY TO ${esc(firstName.toUpperCase())}</a>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="background-color:#f9f8f5;padding:24px 40px;text-align:center;border-top:1px solid #e8e4dc;">
<p style="margin:0;color:#aaa;font-size:11px;font-family:Arial,Helvetica,sans-serif;letter-spacing:1px;">ABDULSELLSHOMES.COM</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>
            `,
        })

        if (error) {
            console.error('Resend error:', error)
            return Response.json({ success: false, error: 'Failed to send email' }, { status: 500 })
        }

        return Response.json({ success: true })
    } catch (error) {
        console.error('Error in contact form submission:', error)
        return Response.json({ success: false, error: 'Failed to submit' }, { status: 500 })
    }
}
