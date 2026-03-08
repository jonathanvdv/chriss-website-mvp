import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email().max(320),
    phone: z.string().max(30).optional(),
    message: z.string().min(10).max(5000),
    intent: z.enum(['Buy', 'Sell', 'Both', 'Just Curious']).optional(),
    language: z.enum(['English', 'Farsi', 'Dari', 'Persian', 'Hindi', 'Urdu']).optional(),
    listingAddress: z.string().max(500).optional(),
})

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = contactSchema.safeParse(body)

        if (!result.success) {
            return Response.json(
                { success: false, error: 'Invalid form data', details: result.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const { firstName, lastName, email, phone, message, intent, language, listingAddress } = result.data

        const safeFirstName = escapeHtml(firstName)
        const safeLastName = escapeHtml(lastName)
        const safeEmail = escapeHtml(email)
        const safePhone = phone ? escapeHtml(phone) : ''
        const safeMessage = escapeHtml(message)
        const safeIntent = intent ? escapeHtml(intent) : ''
        const safeLanguage = language ? escapeHtml(language) : ''
        const safeListingAddress = listingAddress ? escapeHtml(listingAddress) : ''

        const { error } = await resend.emails.send({
            from: 'Abdul Basharmal <no-reply@abdulsellshomes.com>',
            to: 'abdulbashrealtor@gmail.com',
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
<a href="mailto:${safeEmail}" style="display:inline-block;background-color:#1a1a1a;color:#ffffff;font-size:13px;font-family:Arial,Helvetica,sans-serif;letter-spacing:2px;text-decoration:none;padding:14px 36px;border-radius:2px;">REPLY TO ${safeFirstName.toUpperCase()}</a>
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
