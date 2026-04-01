import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET;

const LINKS = {
    "physique_terminale": {
        url: process.env.LINK_PHYSIQUE_TERMINALE,
        label: "Physique-Chimie Terminale"
    },
    "math_terminale": {
        url: process.env.LINK_MATH_TERMINALE,
        label: "Mathématiques Terminale"
    },
    "math_expertes": {
        url: process.env.LINK_MATH_EXPERTES,
        label: "Maths Expertes Terminale"
    },
    "histoire_terminale": {
        url: process.env.LINK_HISTOIRE_TERMINALE,
        label: "Histoire Terminale"
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Vérifier le secret webhook
    const authHeader = req.headers['authorization'];
    if (WEBHOOK_SECRET && authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const event = req.body;
    const eventType = event.event?.type;

    // On traite uniquement les nouveaux achats
    if (eventType !== 'INITIAL_PURCHASE') {
        return res.status(200).json({ status: 'ignored', type: eventType });
    }

    // L'email est stocké dans les subscriber attributes (attribué automatiquement par RevenueCat Web Billing)
    const customerEmail = event.event?.subscriber_attributes?.['$email']?.value;
    const productId = event.event?.product_id;

    if (!customerEmail || !productId) {
        return res.status(400).json({ error: 'Missing data', email: customerEmail, productId });
    }

    const link = LINKS[productId];
    if (!link || !link.url) {
        return res.status(200).json({ status: 'no link or missing URL for product', productId });
    }

    try {
        await resend.emails.send({
            from: 'FlashBac <onboarding@resend.dev>',
            to: customerEmail,
            subject: `⚡️ Vos flashcards ${link.label} sont prêtes !`,
            html: `
                <div style="background-color: #02040a; margin: 0; padding: 40px 0; font-family: 'Poppins', Helvetica, Arial, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #0a1128; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 40px; text-align: center; color: #eaf0ff;">
                        
                        <h1 style="color: #ffffff; font-size: 32px; margin-bottom: 20px;">Félicitations ! 🎉</h1>
                        <p style="font-size: 18px; line-height: 1.6; color: #b0c4de; margin-bottom: 30px;">
                            Votre accès aux flashcards <strong>${link.label}</strong> est maintenant actif. Préparez-vous à exceller pour votre Bac !
                        </p>

                        <div style="margin: 40px 0;">
                            <a href="${link.url}" 
                               style="display: inline-block; padding: 18px 36px; background-color: #4a90e2; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; box-shadow: 0 0 20px rgba(74, 144, 226, 0.4);">
                                Ouvrir mes Flashcards
                            </a>
                        </div>

                        <p style="font-size: 14px; color: #8899ac; margin-top: 20px;">
                            Si le bouton ne fonctionne pas, copiez ce lien :<br>
                            <a href="${link.url}" style="color: #4a90e2; text-decoration: none;">${link.url}</a>
                        </p>

                        <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 40px 0;">

                        <p style="font-size: 12px; color: #667788; line-height: 1.5;">
                            <strong>Note :</strong> Un compte gratuit sur <a href="https://www.studysmarter.fr/" style="color: #4a90e2;">StudySmarter</a> est nécessaire pour accéder au contenu.<br>
                            © 2024 FlashBac. Tous droits réservés.
                        </p>
                    </div>
                </div>
            `
        });

        return res.status(200).json({ status: 'email sent', productId, email: customerEmail });
    } catch (error) {
        console.error('Erreur envoi email:', error);
        return res.status(500).json({ error: 'Email failed' });
    }
}
