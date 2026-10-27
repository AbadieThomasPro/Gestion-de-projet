# 📘 Facebook like

Réseau social inspiré de Facebook : **React** (frontend) + **Next.js** (API backend).

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white)
![Notion](https://img.shields.io/badge/Gestion-Notion-000000?logo=notion&logoColor=white)

📋 **Backlog Notion :** [Facebook like — Backlog](https://app.notion.com/p/TrustSign-be7f6c85647e452898f97fe4be416485?source=copy_link)

## Sommaire

- [Contexte](#-contexte)
- [Fonctionnalités](#-fonctionnalités)
- [Installation](#-installation)
- [Branching strategy](#-branching-strategy)
- [Workflow des tickets](#-workflow-des-tickets)
- [Documentation](#-documentation)

---

## 🎯 Contexte

Projet de groupe : concevoir un réseau social simplifié reprenant les usages clés de Facebook (compte, publications, fil d'actualité, interactions, amis).

| Rôle | Responsabilité |
|---|---|
| **Product Owner** | Rédige et priorise le backlog Notion, valide les tickets |
| **Dev Back** | API Next.js, base de données, sécurité |
| **Dev Front** | Interface React, intégration de l'API |

La gestion de projet se fait sur **Notion** : chaque EPIC contient des sous-tâches front et back. Chaque ticket a un identifiant unique **`FB-<id>`**, repris dans le nom des branches et des Pull Requests.

## ✨ Fonctionnalités

| EPIC | Contenu | Priorité |
|---|---|:-:|
| 🔐 Authentification | Inscription, connexion (JWT), déconnexion | P0 |
| 📰 Fil d'actualité | Publier, fil paginé, supprimer | P0 |
| 👤 Profil | Page profil, édition, avatar | P1 |
| 👍 Interactions | Likes, commentaires | P1 |
| 🤝 Amis | Recherche, demandes d'amis | P2 |

Le découpage en releases est détaillé dans la [story map](docs/STORYMAP.md).

## 🚀 Installation

### Prérequis

| Outil | Version | Vérification |
|---|---|---|
| Node.js | ≥ 20 (22 recommandé, cf. `.nvmrc`) | `node -v` |
| npm | ≥ 10 | `npm -v` |
| Git | ≥ 2.30 | `git --version` |

### Lancer le projet

```bash
git clone https://github.com/Miisterone/Gestion-de-projet.git
cd Gestion-de-projet
git checkout develop
nvm use                                    # optionnel : utilise la version de .nvmrc
npm install                                # installe front + back
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
npm run dev                                # lance front + back
```

### Vérifier que tout fonctionne

| Service | URL | Résultat attendu |
|---|---|---|
| Frontend | http://localhost:5173 | Page d'accueil |
| Backend | http://localhost:3001/api/health | `{ "status": "ok" }` |

### Structure

```text
Gestion-de-projet/
├── frontend/   # React + Vite
├── backend/    # Next.js (routes API dans app/api/)
├── docs/       # Personas, story map, error management…
└── .github/    # CI et automations
```

## 🌿 Branching strategy

Nous suivons **GitFlow** : deux branches permanentes (`main`, `develop`) et des branches courtes, une par ticket Notion.

| Branche | Rôle | Créée depuis | Fusionnée vers |
|---|---|---|---|
| `main` | Versions stables livrées, taguées | — | — |
| `develop` | Intégration des fonctionnalités du sprint | `main` | — |
| `feature/FB-<id>-<desc>` | Une fonctionnalité = un ticket Notion | `develop` | `develop` |
| `fix/FB-<id>-<desc>` | Correction pendant le développement | `develop` | `develop` |
| `release/x.y.z` | Stabilisation d'une version | `develop` | `main` + `develop` |
| `hotfix/FB-<id>-<desc>` | Correctif urgent en production | `main` | `main` + `develop` |

```mermaid
gitGraph
    commit id: "init"
    branch develop
    checkout develop
    branch feature/FB-7-login-page
    commit id: "feat(frontend): login page"
    checkout develop
    merge feature/FB-7-login-page
    branch release/0.1.0
    commit id: "chore: bump version"
    checkout main
    merge release/0.1.0 tag: "v0.1.0"
    checkout develop
    merge release/0.1.0
```

**Règles essentielles :**

- Pas de push direct sur `main` ni `develop` : **Pull Request + 1 review + CI verte** obligatoires.
- Commits au format [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), **en anglais** : `feat(frontend): add profile page`.
- Versions en **Semantic Versioning** `MAJEUR.MINEUR.CORRECTIF` (ex. `v1.2.0`).

👉 Toutes les conventions détaillées sont dans **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## 🔄 Workflow des tickets

```mermaid
flowchart LR
    A[Backlog] --> B[À faire] --> C[En cours] --> D[En review] --> E[À tester] --> F[Terminé]
    D -. changements demandés .-> C
    E -. recette KO .-> C
```

| Statut | Qui | Action |
|---|---|---|
| **Backlog** | PO | Crée le ticket, le rattache à son EPIC |
| **À faire** | Équipe | Ticket choisi en sprint planning |
| **En cours** | Dev | Crée sa branche `feature/FB-<id>-<desc>` |
| **En review** | Dev | Ouvre la PR vers `develop` 🤖 |
| **À tester** | PO | PR fusionnée, le PO vérifie 🤖 |
| **Terminé** | PO | Validé |

🤖 = statut mis à jour automatiquement par GitHub Actions.

## 📚 Documentation

| Document | Contenu |
|---|---|
| [CONTRIBUTING.md](CONTRIBUTING.md) | Branches, commits, Pull Requests, versions |
| [docs/PERSONAS.md](docs/PERSONAS.md) | Nos 3 personas et leurs besoins |
| [docs/STORYMAP.md](docs/STORYMAP.md) | Parcours utilisateur et découpage en releases |
