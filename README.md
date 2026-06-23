#💰 FinTrack — Application web de gestion de budget personnel

## 📌 Présentation du projet

FinTrack est une application web full-stack de gestion de budget personnel, conçue pour aider les utilisateurs à suivre leurs revenus et dépenses, définir des budgets par catégorie, planifier des transactions récurrentes et visualiser leur santé financière en temps réel.

## ❓ Problème

Gérer ses finances personnelles au quotidien est un défi pour beaucoup de personnes. Les problèmes les plus fréquents sont :

* **Manque de visibilité** — On ne sait pas exactement où part son argent chaque mois
* **Dépassements de budget** — On dépense plus que prévu dans certaines catégories sans s'en rendre compte
* **Oubli des charges récurrentes** — Loyer, abonnements et autres dépenses fixes sont souvent mal anticipés
* **Absence de planification** — Il est difficile d'épargner sans objectif clair et sans suivi régulier
* **Outils inadaptés** — Les tableurs Excel sont fastidieux et les apps bancaires ne permettent pas d'analyse fine

**FinTrack répond** à ces problèmes en centralisant toutes les informations financières dans une interface simple, claire et accessible depuis n'importe quel navigateur.

## ✨ Fonctionnalités

* 📊 Tableau de bord avec graphiques (revenus vs dépenses, répartition par catégorie)
* ➕ Ajout de transactions (revenus & dépenses) avec catégories personnalisées
* 🎯 Budgets mensuels par catégorie avec alertes de dépassement
* 🔁 Transactions récurrentes automatiques (loyer, salaire, abonnements)
* 📅 Rapport mensuel détaillé
* 🏆 Objectifs d'épargne avec suivi de progression
* 📤 Export des données en CSV


## 🚀 Installation & lancement

### Prérequis

* Node.js v24+ 
* Docker Desktop

1. Cloner le projet

```bash
git clone https://github.com/idriss-enone/fintrack.git

cd fintrack
```

2. Configurer les variables d'environnement

```bash
cp .env.example .env

# Édite .env avec tes valeurs
```

3. Lancer la base de données

```bash
docker compose up -d

```

4. Installer les dépendances

```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..

```

5. Lancer l'application

```bash
npm run dev

```

L'application sera disponible sur :

* Frontend → http://localhost:5173
* Backend → http://localhost:5000
* pgAdmin → http://localhost:8080


## 🗺️ Roadmap

### ✅ Phase 1 — Mise en place du projet

- [x] Initialisation du monorepo (React + Express + Tailwind)
- [x] Configuration de PostgreSQL via Docker
- [x] Mise en place de pgAdmin
- [x] Initialisation Git et publication sur GitHub
- [x] README, Licence, Roadmap


### 🎨 Phase 2 — Frontend avec données fictives *(en cours)*

> L'objectif est de construire toute l'interface React avec des données mock
> sans se soucier du backend. Chaque page est fonctionnelle visuellement.

- [ ] Configuration du routing avec React Router
- [ ] Mise en place des données mock (fichier `mockData.js`)
- [ ] Layout principal (sidebar, navbar, responsive)
- [ ] Page — Tableau de bord (graphiques Recharts, métriques)
- [ ] Page — Transactions (liste, filtres, ajout, suppression)
- [ ] Page — Catégories (ajout, suppression)
- [ ] Page — Budgets mensuels (barres de progression, alertes visuelles)
- [ ] Page — Transactions récurrentes
- [ ] Page — Objectifs d'épargne
- [ ] Page — Rapport mensuel
- [ ] Export CSV (côté frontend)
- [ ] Page — Connexion / Inscription (formulaires uniquement)
- [ ] Responsive design (mobile & tablette)


### ⚙️ Phase 3 — Backend & Base de données

> Une fois le frontend stable, on construit l'API Express et le schéma
> PostgreSQL qui correspondent exactement aux besoins du frontend.

- [ ] Schéma de la base de données (tables & relations)
- [ ] Migrations SQL
- [ ] Authentification (inscription, connexion, JWT, bcrypt)
- [ ] Middleware de protection des routes
- [ ] API — Catégories (CRUD)
- [ ] API — Transactions (CRUD + filtres)
- [ ] API — Budgets mensuels (CRUD)
- [ ] API — Transactions récurrentes (CRUD + application auto)
- [ ] API — Objectifs d'épargne (CRUD)
- [ ] API — Rapport mensuel (agrégations SQL)
- [ ] Validation des données entrantes
- [ ] Gestion des erreurs globale


### 🔗 Phase 4 — Connexion Frontend ↔ Backend

> On remplace les données mock par les vrais appels API.

- [ ] Configuration d'Axios + intercepteurs (token JWT)
- [ ] Mise en place du Context API (auth + état global)
- [ ] Remplacement du mock data par les appels API page par page
- [ ] Gestion des états de chargement (loaders, skeletons)
- [ ] Gestion des erreurs (messages utilisateur)
- [ ] Protection des routes privées côté React


### 🚀 Phase 5 — Tests & Déploiement

- [ ] Tests de l'API avec Postman
- [ ] Correction des bugs & optimisations
- [ ] Déploiement du frontend (Vercel ou Netlify)
- [ ] Déploiement du backend (Railway ou Render)
- [ ] Déploiement de la base de données (Railway PostgreSQL)
- [ ] Variables d'environnement de production



---

## 👤 Auteur


<table>
  <tr>
    <td align="center">
      <b>Idriss ENONE</b><br/>
      <br/>
      <a href="https://github.com/idriss-enone">
        <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
      </a>
      <a href="https://www.linkedin.com/in/idriss-enone-437479229">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
      </a>
      <a href="https://portfolio-4e632.firebaseapp.com/">
        <img src="https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=firefox&logoColor=white" alt="Portfolio"/>
      </a>
    </td>
  </tr>
</table>

--- 

## 📄 Licence

Ce projet est distribué sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.