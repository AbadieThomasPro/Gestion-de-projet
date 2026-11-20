# Sprint 3 · Statistiques, modération et réseau

**Dates :** 12/01 → 12/02/2027
**Objectif :** statistiques sur le profil, modération des signalements, gestion des coupures réseau.
**Bloqué par :** Sprint 2 (réactions et commentaires LL-146, LL-150, `canView` LL-172) et Sprint 1 (signalements LL-222).

[← Sprint 2](sprint-2.md) · [Backlog](README.md) · [Sprint 4 →](sprint-4.md)

## Ordre de réalisation

### 1. Statistiques du profil

| # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
|---:|---|---|---|---|---:|---|---|
| 1 | LL-166 | Fonction `computeStreak` et tests unitaires | LL-158 | Dev Backend | 0,5 | LL-205 | ♻️ |
| 2 | LL-165 | Route API `GET /api/users/:id/stats` | LL-158 | Dev Backend | 0,75 | LL-166, LL-146, LL-150 | ♻️ |
| 3 | LL-167 | Composant StatsCard et stories Storybook | LL-158 | Dev Web | 0,5 | LL-202 | ♻️ |
| 4 | LL-168 | Intégrer StatsCard sur la page profil | LL-158 | Dev Web | 0,25 | LL-165, LL-167, LL-142 | ♻️ |
| 5 | LL-169 | Test E2E statistiques du profil (800×600) | LL-158 | Dev Web | 0,25 | LL-168, LL-187 | ⬜ |
| 6 | LL-170 | Documenter la route dans Swagger et ouvrir la PR | LL-158 | Dev Backend | 0,25 | LL-165, LL-203 | ⬜ |

### 2. Modération des signalements

| # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
|---:|---|---|---|---|---:|---|---|
| 7 | LL-225 | Rôle modérateur et routes de traitement | LL-214 | Dev Backend | 1 | LL-222 | ⬜ |
| 8 | LL-226 | Masquer un contenu dans `canView` | LL-214 | Dev Backend | 0,5 | LL-225, LL-172 | ⬜ |
| 9 | LL-227 | Page Modération (liste et actions) | LL-214 | Dev Web | 1 | LL-225 | ⬜ |

### 3. Erreurs réseau et reprise

| # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
|---:|---|---|---|---|---:|---|---|
| 10 | LL-184 | Timeout, relance des GET et bandeau hors ligne | LL-163 | Dev Web | 1 | LL-180 | ⬜ |
| 11 | LL-185 | Conserver le brouillon (publication, commentaire, événement) après erreur | LL-163 | Dev Web | 0,25 | LL-184 | ⬜ |
| 12 | LL-186 | Test E2E coupure réseau | LL-163 | Dev Web | 0,25 | LL-185 | ⬜ |

**Total :** 6,5 J/H.

## Structure

- **LL-155 EPIC Statistiques et gamification** (1/2)
  - LL-158 US Voir mes statistiques sur mon profil : LL-165 à LL-170
- **LL-210 EPIC Signalement et modération** (2/2)
  - LL-214 US Modérer les signalements : LL-225, LL-226, LL-227
- **LL-154 EPIC Error management** (3/3)
  - LL-163 US Erreurs réseau et reprise : LL-184, LL-185, LL-186

## Notes

- **♻️ Statistiques :** la PR #16 (`feature/FB-158-stats-profil`) a déjà fusionné `backend/lib/stats.js` (`computeStreak`, `getUserStats`), la route `/api/users/[id]/stats` et `StatsCard`. Il reste à les porter sur PostgreSQL et sur les réactions, à écrire les tests unitaires de `computeStreak` et les stories, puis LL-169 et LL-170.
