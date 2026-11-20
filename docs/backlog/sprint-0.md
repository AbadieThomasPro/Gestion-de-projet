# Sprint 0 · Socle technique

**Dates :** 09/10 → 09/11/2026 (en retard : seules 3 tâches sont livrées)
**Objectif :** base PostgreSQL, outillage (Storybook, Swagger, tests, CI), contrat d'erreur API et vérification du rendu 800×600.
**Bloque :** Sprint 1, et le début du stage (Storybook, Swagger et la CI doivent être en place).

[← Backlog](README.md) · [Sprint 1 →](sprint-1.md)

## Ordre de réalisation

| # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
|---:|---|---|---|---|---:|---|---|
| 1 | LL-236 | Renommer le projet en LocalLoop (README, UI, identifiants `LL-`, script Notion) | LL-199 | Chef de projet | 0,25 | — | ⬜ |
| 2 | LL-235 | Retirer le module Amis et reporter les notifications en V2 | LL-199 | Dev Web, Dev Backend | 0,5 | — | ⬜ |
| 3 | LL-128 | Initialiser le projet Next.js (API) | LL-199 | Dev Backend | 1 | — | ✅ |
| 4 | LL-131 | Mettre en place le routing (React Router) | LL-199 | Dev Web | 0,5 | — | ✅ |
| 5 | LL-130 | Maquettes des écrans principaux, avec une version 800×600 | — | Designer | 2 | — | ⬜ |
| 6 | LL-123 | Modéliser la base de données (MCD, MLD, dictionnaire) | LL-120 | Dev Backend | 2,5 | LL-235 | ⬜ |
| 7 | LL-125 | Créer le schéma PostgreSQL, les migrations et le seed des zones | LL-120 | Dev Backend | 2 | LL-123 | ⬜ |
| 8 | LL-207 | Docker Compose : `depends_on`, healthchecks, limites de ressources | LL-201 | Dev Backend | 0,75 | — | ✅ |
| 9 | LL-127 | Tester et documenter la base (`docs/DATABASE.md`) | LL-120 | Dev Backend | 0,5 | LL-125 | ⬜ |
| 10 | LL-205 | Configurer Vitest et Playwright | LL-201 | Dev Web | 0,75 | — | ⬜ |
| 11 | LL-129 | CI GitHub Actions : lint, build, Vitest, Playwright, doc | LL-201 | Dev Backend | 0,75 | LL-205 | 🟡 |
| 12 | LL-203 | Mettre en place Swagger (OpenAPI) sur l'API | LL-200 | Dev Backend | 0,75 | — | ⬜ |
| 13 | LL-202 | Mettre en place Storybook (viewport 800×600) | LL-200 | Dev Web | 0,5 | — | ⬜ |
| 14 | LL-176 | Classe `AppError`, catalogue des codes et `ERRORS.md` | LL-161 | Dev Backend | 0,5 | — | ⬜ |
| 15 | LL-177 | Wrapper `withErrorHandler` et `traceId` dans les logs | LL-161 | Dev Backend | 1 | LL-176 | ⬜ |
| 16 | LL-178 | Validation Zod vers erreurs 422 par champ | LL-161 | Dev Backend | 0,5 | LL-177 | ⬜ |
| 17 | LL-233 | Bug : secret JWT par défaut et erreurs 500 sur entrées invalides | LL-161 | Dev Backend | 0,5 | LL-178 | ⬜ |
| 18 | LL-179 | Réponses d'erreur dans Swagger et tests d'intégration | LL-161 | Dev Backend | 0,5 | LL-203, LL-205, LL-178 | ⬜ |
| 19 | LL-187 | Projet Playwright `crt-800x600` dans la CI | LL-164 | Dev Web | 0,75 | LL-205, LL-129 | ⬜ |
| 20 | LL-188 | Viewport 800×600 dans Storybook et case dans le modèle de PR | LL-164 | Dev Web | 0,25 | LL-202 | ⬜ |
| 21 | LL-189 | Auditer et corriger les pages existantes en 800×600 | LL-164 | Dev Web | 0,5 | LL-187 | ⬜ |
| 22 | LL-204 | Publier automatiquement Storybook et Swagger depuis la CI | LL-200 | Dev Backend | 0,75 | LL-202, LL-203, LL-129 | ⬜ |
| 23 | LL-206 | Déployer `develop` en recette depuis la CI | LL-201 | Dev Backend | 1 | LL-129 | ⬜ |

**Total :** 19 J/H, dont 2,25 J/H livrés.

## Structure

- **LL-199 EPIC Outillage et automatisation**
  - LL-200 US Documentation front et back : LL-202, LL-203, LL-204
  - LL-201 US Tests, CI/CD et orchestration : LL-205, LL-129, LL-206, LL-207
  - LL-128, LL-131, LL-235, LL-236
- **LL-120 Conception DB** : LL-123, LL-125, LL-127
- **LL-154 EPIC Error management**
  - LL-161 US Contrat d'erreur API (back) : LL-176, LL-177, LL-178, LL-233, LL-179
- **LL-157 EPIC Compatibilité 800×600**
  - LL-164 US Vérifier automatiquement le rendu 800×600 : LL-187, LL-188, LL-189
- LL-130 Maquettes

## Notes

- **LL-125** ne crée que `zones` (avec 3 à 5 quartiers pilotes de Toulouse), `users`, `posts`, `reactions` et `comments`, puis branche les routes existantes dessus. Les autres tables arrivent avec les sprints qui en ont besoin (voir [le schéma par sprint](README.md#schéma-de-base--qui-crée-quelle-table)).
- **LL-129** : `.github/workflows/ci.yml` ne vérifie aujourd'hui que `docs/API.md`, avec l'annulation du run précédent. Il manque lint, build, tests et cache npm.
- **LL-203** : `docs/API.md` est un tableau Markdown généré, pas une spec OpenAPI.
- **LL-207** : le service `db` sera ajouté par LL-125.
- **LL-236** : le script `.github/scripts/notion-status.mjs` cherche encore `FB-` dans les noms de branches.
- **LL-189** : la police de base fait 15 px, l'EPIC 800×600 demande 16 px minimum.
