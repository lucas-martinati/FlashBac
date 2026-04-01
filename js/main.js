// === CONFIGURATION REVENUECAT ===
const RC_API_KEY = 'rcb_parWrLVMVqfOqyqUabVHYlIvsqOX';

let rcPurchases = null;

async function initRevenueCat() {
    try {
        const RC = window.Purchases;
        if (!RC) {
            console.error('RevenueCat SDK non chargé');
            return;
        }
        const appUserId = RC.Purchases.generateRevenueCatAnonymousAppUserId();
        rcPurchases = RC.Purchases.configure({
            apiKey: RC_API_KEY,
            appUserId: appUserId,
        });
    } catch (e) {
        console.error('Erreur init RevenueCat:', e);
    }
}

document.addEventListener('DOMContentLoaded', async () => {

    await initRevenueCat();

    // --- Génération des deux sections ---
    createDeckElements(decksDataTerminale, 'decks-list-terminale', 't');
    createDeckElements(decksDataPremiere, 'decks-list-premiere', 'p');

    // --- Gestion de l'événement pour dérouler les chapitres ---
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-toggle-chapters')) {
            const button = event.target;
            const deckId = button.dataset.deckId;
            const chaptersList = document.getElementById(`chapters-${deckId}`);

            if (chaptersList) {
                chaptersList.classList.toggle('open');
                button.textContent = chaptersList.classList.contains('open')
                    ? 'Masquer les chapitres'
                    : 'Voir les chapitres';
            }
        }
    });

    // --- Logique du Modal de Succès ---
    const successModal = document.getElementById('success-modal');
    const successCloseBtn = document.getElementById('success-close-btn');

    const closeSuccessModal = () => {
        successModal.classList.remove('active');
        setTimeout(() => successModal.style.display = 'none', 300);
    };

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', closeSuccessModal);
    }
    if (successModal) {
        successModal.addEventListener('click', (event) => {
            if (event.target === successModal) closeSuccessModal();
        });
    }

    const showSuccessModal = () => {
        successModal.style.display = 'flex';
        setTimeout(() => successModal.classList.add('active'), 10);
    };

    // --- Achat via RevenueCat ---
    document.body.addEventListener('click', async (event) => {
        const purchaseBtn = event.target.closest('.btn-purchase');
        if (!purchaseBtn) return;

        const productId = purchaseBtn.dataset.productId;
        if (!productId) {
            alert('Produit non configuré.');
            return;
        }

        if (!rcPurchases) {
            alert('Le système de paiement n\'est pas encore prêt. Veuillez réessayer.');
            return;
        }

        purchaseBtn.disabled = true;
        const originalText = purchaseBtn.textContent;
        purchaseBtn.textContent = 'Chargement...';

        try {
            // Récupérer l'offre disponible
            const offerings = await rcPurchases.getOfferings();
            if (!offerings.current || !offerings.current.availablePackages.length) {
                throw new Error('Aucune offre disponible');
            }

            // Trouver le package correspondant au produit
            let targetPackage = offerings.current.availablePackages.find(
                p => p.webBillingProduct && p.webBillingProduct.identifier === productId
            );

            // Si pas trouvé dans les packages, chercher dans toutes les offerings
            if (!targetPackage) {
                for (const key of Object.keys(offerings.all)) {
                    const offering = offerings.all[key];
                    targetPackage = offering.availablePackages.find(
                        p => p.webBillingProduct && p.webBillingProduct.identifier === productId
                    );
                    if (targetPackage) break;
                }
            }

            if (!targetPackage) {
                throw new Error('Produit non trouvé dans les offres');
            }

            // Lancer l'achat
            await rcPurchases.purchase({ rcPackage: targetPackage });

            // Afficher le modal de succès
            showSuccessModal();

        } catch (error) {
            const RC = window.Purchases;
            if (RC && error instanceof RC.PurchasesError && error.errorCode === RC.ErrorCode.UserCancelledError) {
                // L'utilisateur a annulé, pas d'erreur
            } else {
                console.error('Erreur d\'achat:', error);
                alert('Une erreur est survenue lors du paiement. Veuillez réessayer.');
            }
        } finally {
            purchaseBtn.disabled = false;
            purchaseBtn.textContent = originalText;
        }
    });

    // --- Effet 3D Hero Image ---
    const heroCards = document.querySelectorAll('.hero-card');
    const maxRotate = 8;

    heroCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const { width, height } = rect;
            const middleX = width / 2;
            const middleY = height / 2;

            const offsetX = (x - middleX) / middleX;
            const offsetY = (y - middleY) / middleY;

            const rotateY = offsetX * maxRotate;
            const rotateX = -1 * offsetY * maxRotate;

            window.requestAnimationFrame(() => {
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
                card.style.zIndex = '2';
            });
        });

        card.addEventListener('mouseleave', () => {
            window.requestAnimationFrame(() => {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
                card.style.zIndex = '1';
            });
        });
    });
});
