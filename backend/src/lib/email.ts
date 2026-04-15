import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'BotForge <noreply@botforge.app>'

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to BotForge 🎉',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#111827">
        <h1 style="font-size:24px;font-weight:700;color:#4f46e5;margin:0 0 8px">Welcome to BotForge, ${name}!</h1>
        <p style="color:#6b7280;margin:0 0 24px">You're all set to build AI-powered support bots for your business.</p>
        <p style="margin:0 0 12px">Here's what you can do right now:</p>
        <ul style="color:#374151;padding-left:20px;margin:0 0 24px">
          <li style="margin-bottom:8px">Create your first bot in under 5 minutes</li>
          <li style="margin-bottom:8px">Add your FAQs, URLs, or PDFs as knowledge</li>
          <li style="margin-bottom:8px">Embed the widget on your website with one line of code</li>
        </ul>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px">Go to dashboard →</a>
        <p style="margin:32px 0 0;font-size:12px;color:#9ca3af">BotForge · AI support bots for every business</p>
      </div>
    `,
  })
}

export async function sendUsageAlertEmail(
  to: string,
  name: string,
  used: number,
  limit: number,
  plan: string
): Promise<void> {
  const pct = Math.round((used / limit) * 100)
  await resend.emails.send({
    from: FROM,
    to,
    subject: `You've used ${pct}% of your BotForge message quota`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#111827">
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Running low on messages</h1>
        <p style="color:#6b7280;margin:0 0 24px">Hi ${name}, you've used <strong>${used.toLocaleString()} of ${limit.toLocaleString()}</strong> messages this month on your <strong>${plan}</strong> plan.</p>
        <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:16px;margin:0 0 24px">
          <p style="margin:0;color:#92400e;font-weight:500">⚠️ You only have ${(limit - used).toLocaleString()} messages left this month.</p>
        </div>
        <p style="color:#374151;margin:0 0 24px">Upgrade your plan to keep your bots running smoothly for your customers.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard/billing" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px">Upgrade plan →</a>
        <p style="margin:32px 0 0;font-size:12px;color:#9ca3af">BotForge · AI support bots for every business</p>
      </div>
    `,
  })
}

export async function sendReportEmail(
  fromName: string,
  fromEmail: string,
  category: string,
  subject: string,
  description: string,
  screenshotBase64?: string,
  screenshotName?: string
): Promise<void> {
  const supportEmail = process.env.SUPPORT_EMAIL ?? 'support@botforge.app'
  const { error } = await resend.emails.send({
    from: FROM,
    to: supportEmail,
    replyTo: fromEmail,
    subject: `[${category}] ${subject}`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#111827">
        <h1 style="font-size:20px;font-weight:700;color:#4f46e5;margin:0 0 4px">[${category}] ${subject}</h1>
        <p style="font-size:13px;color:#9ca3af;margin:0 0 24px">Reported by <strong>${fromName}</strong> (${fromEmail})</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:0 0 24px;white-space:pre-wrap;font-size:14px;color:#374151;line-height:1.6">${description.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        ${screenshotBase64 ? '<p style="color:#6b7280;font-size:13px">A screenshot is attached.</p>' : ''}
        <p style="margin:32px 0 0;font-size:12px;color:#9ca3af">BotForge · Issue Report</p>
      </div>
    `,
    attachments: screenshotBase64
      ? [{ filename: screenshotName ?? 'screenshot.png', content: screenshotBase64 }]
      : undefined,
  })
  if (error) throw new Error(error.message)
}

export async function sendPaymentReceiptEmail(
  to: string,
  name: string,
  plan: string,
  amountGhs: string
): Promise<void> {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Payment confirmed — ${plan} plan activated`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#111827">
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Payment confirmed ✓</h1>
        <p style="color:#6b7280;margin:0 0 24px">Hi ${name}, your payment was successful and your account has been upgraded.</p>
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:0 0 24px">
          <div style="display:flex;justify-content:space-between;margin-bottom:12px">
            <span style="color:#6b7280">Plan</span>
            <span style="font-weight:600;color:#111827">${plan}</span>
          </div>
          <div style="display:flex;justify-content:space-between;border-top:1px solid #f3f4f6;padding-top:12px">
            <span style="color:#6b7280">Amount paid</span>
            <span style="font-weight:700;color:#4f46e5">${amountGhs}</span>
          </div>
        </div>
        <a href="${process.env.FRONTEND_URL}/dashboard/billing" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px">View your plan →</a>
        <p style="margin:32px 0 0;font-size:12px;color:#9ca3af">BotForge · AI support bots for every business</p>
      </div>
    `,
  })
}
