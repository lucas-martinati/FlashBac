# FlashBac ⚡️

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com/)

> **Révisez efficacement. Mémorisez durablement.**

**FlashBac** est une plateforme de flashcards premium conçue spécifiquement pour les lycéens français (Première et Terminale). Elle propose des contenus de haute qualité pour les matières scientifiques et littéraires afin de maximiser les chances de réussite au Baccalauréat.

---

## 🚀 Fonctionnalités

- **Contenu Rigoureux** : Flashcards couvrant l'intégralité du programme, démonstrations exigibles au Bac et cours numériques détaillés.
- **Support Multi-Matières** : Physique-Chimie, Mathématiques, Maths Expertes et Histoire.
- **Expérience Premium** : Une interface moderne en "Dark Mode" optimisée pour la concentration.
- **Paiement Sécurisé** : Intégration fluide avec **RevenueCat** pour un achat rapide et fiable.
- **Livraison Automatique** : Réception immédiate de vos liens d'accès par email via **Resend** dès la confirmation du paiement.
- **Hébergé sur StudySmarter** : Accès direct aux dossiers sur la plateforme de révision leader du secteur.

## 🛠 Stack Technique

- **Frontend** : HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Backend (API)** : Node.js (Vercel Serverless Functions).
- **Paiements** : [RevenueCat](https://www.revenuecat.com/) Web Billing SDK.
- **Emails** : [Resend](https://resend.com/).
- **Hébergement** : GitHub Pages (Static Hosting) & Vercel (Backend API).

## 💻 Développement Local

### Prérequis
- Node.js installé.
- Un compte Vercel pour tester les fonctions API.

### Installation

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/lucas-martinati/FlashBac.git
   cd FlashBac
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Variables d'environnement** :
   Créez un fichier `.env` à la racine du projet en vous basant sur le modèle `.env.example` :
   ```bash
   cp .env.example .env
   ```
   *Remplissez-le avec vos clés API RevenueCat et Resend.*

### Lancer le projet
Pour tester le site et les fonctions API simultanément :
```bash
npx vercel dev
```
Le projet sera accessible sur `http://localhost:3000`.

## 🔒 Sécurité et Confidentialité

La sécurité de vos contenus est une priorité :
- **Protection des Liens** : Les liens payants StudySmarter ne sont jamais exposés dans le code frontend.
- **Architecture Serveur** : Les secrets sont stockés en tant que variables d'environnement et gérés par le Webhook sécurisé de RevenueCat via une fonction serverless Vercel.
- **Zéro fuite** : L'historique Git a été nettoyé pour garantir qu'aucune donnée sensible ne soit accessible publiquement.

## 📄 Crédits
© 2024 **FlashBac**. Développé pour la réussite de tous les lycéens.
