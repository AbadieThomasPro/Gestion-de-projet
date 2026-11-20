# 🤝 Contribuer au projet

Ce guide décrit **comment travailler sur le projet** : de la prise d'une issue jusqu'à la fusion de la Pull Request.
Pour installer le projet, voir le [README](README.md#-installation).

## Sommaire

- [Cycle de vie d'une contribution](#-cycle-de-vie-dune-contribution)
- [Branches](#-branches)
- [Commits](#-commits)
- [Pull Requests](#-pull-requests)
- [Livrer une version](#-livrer-une-version)
- [Correctif urgent (hotfix)](#-correctif-urgent-hotfix)

---

## 🔁 Cycle de vie d'une contribution

1. **Prendre une issue** dans le [Project](https://github.com/users/Miisterone/projects/5) (colonne *À faire*), se l'assigner, la passer *En cours*. Noter son identifiant `LL-<id>` (dans le titre) et son numéro `#<n>`.
2. **Créer sa branche** depuis `develop` à jour :
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/LL-12-profile-page
   ```
3. **Développer** en faisant des commits cohérents (voir [Commits](#-commits)).
4. **Ouvrir une Pull Request** vers `develop` (voir [Pull Requests](#-pull-requests)).
5. **Faire valider** la review et les contrôles CI : lint, tests, build.
6. **Fusionner** la PR puis **supprimer** la branche.

---

## 🌿 Branches

Nous suivons **GitFlow**.

| Branche | Rôle | Créée depuis | Fusionnée vers |
|---|---|---|---|
| `main` | Versions stables livrées, taguées | — | — |
| `develop` | Intégration des développements | `main` à l'initialisation | — |
| `feature/LL-<id>-<desc>` | Nouvelle fonctionnalité | `develop` | `develop` |
| `fix/LL-<id>-<desc>` | Correction pendant le développement | `develop` | `develop` |
| `release/x.y.z` | Stabilisation d'une version | `develop` | `main` **et** `develop` |
| `hotfix/LL-<id>-<desc>` | Correction urgente en production | `main` | `main` **et** `develop` |

> `fix/*` est une convention complémentaire au GitFlow standard, propre à notre projet.

### Protection

`main` et `develop` sont **protégées** : aucun push direct, toute modification passe par une Pull Request.

### Nommage

- `LL-<id>` = identifiant présent dans le titre de l'issue (ex. `LL-125 Créer le schéma PostgreSQL`).
- `<desc>` : quelques mots **en anglais**, **en minuscules**, séparés par des **tirets**.

```text
feature/LL-12-profile-page
fix/LL-27-feed-pagination
hotfix/LL-31-login-crash
release/1.0.0
```

---

## ✍️ Commits

Nous suivons la convention [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Les messages sont rédigés **en anglais**.

```text
type(scope): description
```

### Types

| Type | Usage |
|---|---|
| `feat` | Ajout d'une fonctionnalité |
| `fix` | Correction d'un bug |
| `refactor` | Modification du code sans changement fonctionnel |
| `docs` | Modification de la documentation |
| `test` | Ajout ou modification de tests |
| `ci` | Modification des pipelines CI/CD |
| `chore` | Maintenance diverse (dépendances, configuration…) |

### Scopes

| Scope | Partie concernée |
|---|---|
| `frontend` | Application React |
| `backend` | API Next.js |
| `database` | Schéma, migrations, données |
| `infra` | Docker, déploiement, configuration |

Le scope est facultatif quand le changement est global (ex. `ci: add lint and test checks`).

### Exemples

```text
feat(frontend): create login page
fix(backend): handle expired authentication tokens
docs(infra): document docker setup
test(backend): add unit tests for post creation
ci: add lint and test checks
```

### Bonnes pratiques

- Un commit = **une modification cohérente**.
- Description à l'**impératif**, sans majuscule ni point final : `add`, `fix`, `remove`.
- Un changement cassant est signalé par `!` : `feat(backend)!: rename posts endpoint`.

---

## 🔀 Pull Requests

### Titre

Même format qu'un commit. La description de la PR contient **`Closes #<n>`** (numéro de l'issue) pour lier l'issue :

```text
feat(frontend): add profile page
```

### Avant d'ouvrir la PR

- [ ] La branche est à jour avec `develop`.
- [ ] `npm run lint` et `npm test` passent en local.
- [ ] Les nouveaux comportements sont testés.
- [ ] La documentation est à jour si besoin (README, Storybook, Swagger).

### Règles de fusion

- **1 review approuvée** minimum.
- **CI verte** : lint, tests, build.
- Fusion par **squash and merge**, puis suppression de la branche.

### Faire une review

- Être **précis** : pointer la ligne et proposer une solution.
- Être **bienveillant** : on commente le code, pas la personne.
- Distinguer le **bloquant** du **suggéré** (préfixe `nit:` pour un détail non bloquant).

---

## 📦 Livrer une version

Les versions suivent le **[Semantic Versioning](https://semver.org/lang/fr/)** : `MAJEUR.MINEUR.CORRECTIF`.

| Incrément | Quand | Exemple |
|---|---|---|
| **MAJEUR** | Changement incompatible (API cassée) | `1.4.2` → `2.0.0` |
| **MINEUR** | Nouvelle fonctionnalité compatible | `1.4.2` → `1.5.0` |
| **CORRECTIF** | Correction de bug | `1.4.2` → `1.4.3` |

Tant que le MVP n'est pas livré, les versions sont en `0.x.y`. Le MVP sera la `1.0.0`.

### Étapes

1. Créer `release/x.y.z` depuis `develop`. Aucune nouvelle fonctionnalité n'y est ajoutée, seulement des correctifs et la préparation de la livraison.
2. Fusionner la release dans `main`.
3. Ajouter le tag : `git tag v1.0.0 && git push origin v1.0.0`.
4. Reporter les changements dans `develop`.
5. Supprimer la branche de release.

---

## 🚑 Correctif urgent (hotfix)

1. Créer `hotfix/LL-<id>-<desc>` depuis `main`.
2. Corriger, ouvrir une PR vers `main`.
3. Après fusion, taguer une version **CORRECTIF** (ex. `v1.0.1`).
4. Reporter le correctif dans `develop` et, si besoin, dans la `release/*` en cours.

---

## 📖 Documenter une route dans Swagger

La doc Swagger (`/api/docs`) est générée par [`backend/lib/openapi.js`](backend/lib/openapi.js) à partir des schémas Zod de validation.

1. Écrire le schéma Zod du corps dans `backend/lib/schemas.js` (il sert à la fois à valider et à documenter).
2. Ajouter un appel `route({ method, path, tags, summary, request, responses, codes })` dans `backend/lib/openapi.js`, avec dans `codes` les erreurs possibles du [catalogue](ERRORS.md).
3. Lancer `npm test` : un test échoue si une route de `backend/app/api` n'est pas documentée.

## 🎨 Storybook et rendu 800×600

Chaque composant de `frontend/src/components` a un fichier `*.stories.jsx` à côté de lui. Storybook (`npm run storybook -w frontend`) s'ouvre sur le viewport **Gérard 800×600** : c'est l'écran de référence du persona Gérard, tout doit y être lisible sans défilement horizontal. Les données de démonstration communes sont dans `frontend/src/stories/fixtures.js`.
