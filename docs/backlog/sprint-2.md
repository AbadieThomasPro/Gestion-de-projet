# Sprint 2 · Interactions et participation

**Dates :** 11/12/2026 → 11/01/2027
**Objectif :** visibilité des publications, réactions et commentaires, suppression de publication, édition du profil et avatar, bouton « Je participe ».
**Bloqué par :** Sprint 1 (Post avec zone LL-191, fil LL-193, profil LL-139, événements LL-215).

[← Sprint 1](sprint-1.md) · [Backlog](README.md) · [Sprint 3 →](sprint-3.md)

## Ordre de réalisation

### 1. Visibilité des publications (venue du Sprint 1)

| # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
|---:|---|---|---|---|---:|---|---|
| 1 | LL-171 | Migration : colonne `visibility` sur `posts` | LL-160 | Dev Backend | 0,5 | LL-191 | ⬜ |
| 2 | LL-172 | Fonction `canView` et tests unitaires | LL-160 | Dev Backend | 1 | LL-171 | ⬜ |
| 3 | LL-173 | Routes posts : visibilité en création, modification et filtre du fil | LL-160 | Dev Backend | 1 | LL-172, LL-193 | ⬜ |
| 4 | LL-174 | Composant VisibilitySelect et indicateur de visibilité | LL-160 | Dev Web | 1 | LL-173 | ⬜ |
| 5 | LL-175 | Test E2E visibilité entre deux comptes | LL-160 | Dev Web | 0,5 | LL-174 | ⬜ |

### 2. Réactions, commentaires, suppression

| # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
|---:|---|---|---|---|---:|---|---|
| 6 | LL-146 | Route API réagir / retirer sa réaction | LL-145 | Dev Backend | 0,75 | LL-125 | ♻️ |
| 7 | LL-149 | Bouton de réaction | LL-145 | Dev Web | 0,5 | LL-146 | ♻️ |
| 8 | LL-150 | Commentaires : route API et section sous chaque publication | LL-145 | Dev Web, Dev Backend | 1,5 | LL-125, LL-172 | ♻️ |
| 9 | LL-195 | Route API de suppression d'une publication (cascade) | LL-190 | Dev Backend | 1 | LL-146, LL-150 | ♻️ |

### 3. Édition du profil

| # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
|---:|---|---|---|---|---:|---|---|
| 10 | LL-140 | Route API modification du profil (champs masquables) | LL-153 | Dev Backend | 0,75 | LL-139 | ♻️ |
| 11 | LL-141 | Upload de l'avatar | LL-153 | Dev Backend | 0,5 | LL-140 | ⬜ |
| 12 | LL-143 | Formulaire d'édition du profil | LL-153 | Dev Web | 0,75 | LL-140 | ♻️ |
| 13 | LL-144 | Composant d'upload d'avatar | LL-153 | Dev Web | 0,5 | LL-141 | ⬜ |

### 4. Participation aux événements

| # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
|---:|---|---|---|---|---:|---|---|
| 14 | LL-219 | Table `event_participants` et routes de participation | LL-212 | Dev Backend | 0,75 | LL-216 | ⬜ |
| 15 | LL-220 | Bouton « Je participe » et compteur | LL-212 | Dev Web | 0,75 | LL-219, LL-217 | ⬜ |

**Total :** 11,75 J/H.

## Structure

- **LL-156 EPIC Confidentialité des publications** (2/2)
  - LL-160 US Choisir la visibilité d'une publication : LL-171 à LL-175
- **LL-145 EPIC Réactions et commentaires** (1/2) : LL-146, LL-149, LL-150
- **LL-190 EPIC Fil d'actualité local et publications** (2/2) : LL-195
- **LL-153 EPIC Profil utilisateur** (2/2) : LL-140, LL-141, LL-143, LL-144
- **LL-209 EPIC Événements locaux** (2/3)
  - LL-212 US Participer à un événement : LL-219, LL-220

## Notes

- **♻️ À reprendre :** le MVP a déjà les likes (`/api/posts/[id]/like`), les commentaires, la suppression et l'édition du profil (`PUT /api/users/me`, avatar sous forme d'URL). Les likes du MVP deviennent des réactions, et la suppression doit supprimer en cascade les réactions et commentaires.
- **LL-150** dépend de `canView` (LL-172) : on ne commente pas une publication qu'on ne peut pas voir.
