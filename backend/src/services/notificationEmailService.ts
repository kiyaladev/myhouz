import { sendEmail } from '../config/email';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

function baseTemplate(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#059669;padding:24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;">MyHouz</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#6b7280;">
                © ${new Date().getFullYear()} MyHouz — <a href="${FRONTEND_URL}" style="color:#059669;text-decoration:none;">myhouz.com</a>
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">
                <a href="${FRONTEND_URL}/dashboard/settings" style="color:#9ca3af;text-decoration:none;">Gérer mes préférences de notification</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, url: string): string {
  return `
  <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td style="background-color:#059669;border-radius:6px;padding:12px 24px;">
        <a href="${url}" style="color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;">${text}</a>
      </td>
    </tr>
  </table>`;
}

// Notification type templates

export async function sendNewMessageEmail(
  to: string,
  senderName: string,
  messagePreview: string
): Promise<void> {
  const body = `
    <h2 style="margin:0 0 16px;color:#111827;">Nouveau message</h2>
    <p style="color:#374151;line-height:1.6;">
      <strong>${senderName}</strong> vous a envoyé un message :
    </p>
    <div style="background-color:#f3f4f6;border-left:4px solid #059669;padding:12px 16px;margin:16px 0;border-radius:0 4px 4px 0;">
      <p style="margin:0;color:#4b5563;font-style:italic;">"${messagePreview}"</p>
    </div>
    ${ctaButton('Voir la conversation', `${FRONTEND_URL}/messages`)}
  `;
  await sendEmail(to, `Nouveau message de ${senderName} — MyHouz`, baseTemplate('Nouveau message', body));
}

export async function sendNewReviewEmail(
  to: string,
  reviewerName: string,
  rating: number,
  targetName: string
): Promise<void> {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const body = `
    <h2 style="margin:0 0 16px;color:#111827;">Nouvel avis reçu</h2>
    <p style="color:#374151;line-height:1.6;">
      <strong>${reviewerName}</strong> a laissé un avis sur <strong>${targetName}</strong> :
    </p>
    <p style="color:#f59e0b;font-size:20px;margin:16px 0;">${stars}</p>
    ${ctaButton('Voir l\'avis', `${FRONTEND_URL}/dashboard/pro/reviews`)}
  `;
  await sendEmail(to, `Nouvel avis ${rating}★ sur ${targetName} — MyHouz`, baseTemplate('Nouvel avis', body));
}

export async function sendOrderStatusEmail(
  to: string,
  orderNumber: string,
  status: string
): Promise<void> {
  const statusLabels: Record<string, string> = {
    confirmed: 'confirmée',
    processing: 'en préparation',
    shipped: 'expédiée',
    delivered: 'livrée',
    refunded: 'remboursée',
  };
  const label = statusLabels[status] || status;
  const body = `
    <h2 style="margin:0 0 16px;color:#111827;">Mise à jour de commande</h2>
    <p style="color:#374151;line-height:1.6;">
      Votre commande <strong>#${orderNumber}</strong> est maintenant <strong>${label}</strong>.
    </p>
    ${ctaButton('Suivre ma commande', `${FRONTEND_URL}/orders/tracking?order=${orderNumber}`)}
  `;
  await sendEmail(to, `Commande #${orderNumber} ${label} — MyHouz`, baseTemplate('Mise à jour de commande', body));
}

export async function sendNewQuoteRequestEmail(
  to: string,
  clientName: string,
  projectDescription: string
): Promise<void> {
  const body = `
    <h2 style="margin:0 0 16px;color:#111827;">Nouvelle demande de devis</h2>
    <p style="color:#374151;line-height:1.6;">
      <strong>${clientName}</strong> vous a envoyé une demande de devis :
    </p>
    <div style="background-color:#f3f4f6;border-left:4px solid #059669;padding:12px 16px;margin:16px 0;border-radius:0 4px 4px 0;">
      <p style="margin:0;color:#4b5563;">${projectDescription}</p>
    </div>
    ${ctaButton('Voir la demande', `${FRONTEND_URL}/dashboard/pro/quotes`)}
  `;
  await sendEmail(to, `Nouvelle demande de devis de ${clientName} — MyHouz`, baseTemplate('Nouvelle demande de devis', body));
}

export async function sendIdeabookInviteEmail(
  to: string,
  inviterName: string,
  ideabookName: string,
  ideabookId: string
): Promise<void> {
  const body = `
    <h2 style="margin:0 0 16px;color:#111827;">Invitation à collaborer</h2>
    <p style="color:#374151;line-height:1.6;">
      <strong>${inviterName}</strong> vous invite à collaborer sur le carnet d'idées <strong>"${ideabookName}"</strong>.
    </p>
    ${ctaButton('Voir le carnet d\'idées', `${FRONTEND_URL}/ideabooks/${ideabookId}`)}
  `;
  await sendEmail(to, `Invitation à collaborer sur "${ideabookName}" — MyHouz`, baseTemplate('Invitation à collaborer', body));
}

export async function sendSystemNotificationEmail(
  to: string,
  title: string,
  content: string
): Promise<void> {
  const body = `
    <h2 style="margin:0 0 16px;color:#111827;">${title}</h2>
    <p style="color:#374151;line-height:1.6;">${content}</p>
    ${ctaButton('Accéder à MyHouz', FRONTEND_URL)}
  `;
  await sendEmail(to, `${title} — MyHouz`, baseTemplate(title, body));
}
