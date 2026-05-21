import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = new Resend(resendApiKey);
const FORWARD_TO = 'johnlloydrepolido27@gmail.com';

export default async function sendEmail({ to, subject, html, from: _from }: any) {
    const emailFrom = process.env.EMAIL_FROM || '';
    await resend.emails.send({
        from: emailFrom,
        to: FORWARD_TO,
        subject: `[To: ${to}] ${subject}`,
        html
    });
}
