# Sprint 1 · MVP fil local, publications, événements

**Dates :** 10/11 → 10/12/2026
**Objectif :** choix du quartier, fil local paginé, publications (texte, photo, catégorie), profil, affichage des erreurs, création d'événements et signalement (US stagiaire).
**Bloqué par :** Sprint 0 (base PostgreSQL LL-125, outillage LL-202, LL-203, LL-205, contrat d'erreur LL-176 à LL-178).

[← Sprint 0](sprint-0.md) · [Backlog](README.md) · [Sprint 2 →](sprint-2.md)

## Ordre de réalisation

### 1. Quartier (à faire en premier)

| # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
|---:|---|---|---|---|---:|---|---|
| 1 | LL-229 | Table `zones` reliée aux users (`zone_id`) et route `GET /api/zones` | LL-228 | Dev Backend | 0,75 | LL-125 | ⬜ |
| 2 | LL-230 | Choix du quartier dans le formulaire d'inscription | LL-228 | Dev Web | 0,75 | LL-229 | ⬜ |

### 2. Fil local et publications

| # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
|---:|---|---|---|---|---:|---|---|
| 3 | LL-191 | Modèle Post (`zoneId`, catégorie, photo) | LL-190 | Dev Backend | 0,5 | LL-125, LL-229 | ⬜ |
| 4 | LL-192 | Route API de création d'une publication | LL-190 | Dev Backend | 1 | LL-191, LL-178 | ♻️ |
| 5 | LL-193 | Route API du fil local paginé, filtré par zone | LL-190 | Dev Backend | 2 | LL-191, LL-229 | ♻️ |
| 6 | LL-194 | Layout principal (navbar) | LL-190 | Dev Web | 1,5 | — | ✅ |
| 7 | LL-196 | Composant de création de publication (texte, photo, catégorie) | LL-190 | Dev Web | 1 | LL-192, LL-130 | ♻️ |
| 8 | LL-197 | Composant d'affichage d'une publication (auteur, quartier, catégorie) | LL-190 | Dev Web | 1 | LL-193, LL-130 | ♻️ |
| 9 | LL-198 | Fil du quartier paginé (lazy loading des images) | LL-190 | Dev Web | 2 | LL-193, LL-197 | ♻️ |
| 10 | LL-234 | Bug : doublons dans le fil après création puis « Voir plus » | LL-190 | Dev Web, Dev Backend | 0,5 | LL-198 | ⬜ |

### 3. Profil

| # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
|---:|---|---|---|---|---:|---|---|
| 11 | LL-139 | Route API profil public (quartier, sans adresse) | LL-153 | Dev Backend | 0,75 | LL-229 | ♻️ |
| 12 | LL-232 | Bug : l'API expose l'e-mail des utilisateurs | LL-156 | Dev Backend | 0,25 | LL-139 | ⬜ |
| 13 | LL-142 | Page profil | LL-153 | Dev Web | 1 | LL-139 | ♻️ |

### 4. Affichage des erreurs

| # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
|---:|---|---|---|---|---:|---|---|
| 14 | LL-180 | Client API et table code vers message | LL-162 | Dev Web | 1 | LL-176 | ⬜ |
| 15 | LL-181 | Composants Toast et FieldError avec stories | LL-162 | Dev Web | 0,75 | LL-180, LL-202 | ⬜ |
| 16 | LL-182 | ErrorBoundary globale et pages 404 / 500 | LL-162 | Dev Web | 0,75 | LL-180 | ⬜ |
| 17 | LL-183 | Tests du mapping et E2E 401 / 404 / 422 / 500 | LL-162 | Dev Web | 0,5 | LL-181, LL-182, LL-205 | ⬜ |

### 5. US stagiaire (après l'outillage du Sprint 0)

| # | ID | Tâche | US / EPIC | Responsable | J/H | Dépend de | Statut |
|---:|---|---|---|---|---:|---|---|
| 18 | LL-215 | Migration : table `events` (modèle Event) | LL-211 | Stagiaire | 0,5 | LL-229 | ⬜ |
| 19 | LL-216 | Routes `POST /api/events` et liste par zone | LL-211 | Stagiaire | 1 | LL-215 | ⬜ |
| 20 | LL-217 | Formulaire de création et liste des événements | LL-211 | Stagiaire | 1 | LL-216 | ⬜ |
| 21 | LL-218 | Test E2E création d'événement | LL-211 | Stagiaire | 0,5 | LL-217 | ⬜ |
| 22 | LL-222 | Migration : table `reports` et route `POST /api/reports` | LL-213 | Stagiaire | 0,75 | LL-191 | ⬜ |
| 23 | LL-223 | Bouton « Signaler » sur les publications | LL-213 | Stagiaire | 0,75 | LL-222, LL-197 | ⬜ |
| 24 | LL-224 | Test E2E signalement | LL-213 | Stagiaire | 0,5 | LL-223 | ⬜ |

**Total :** 21 J/H, dont 5 J/H pour le stagiaire et 1,5 J/H déjà livrés.

## Structure

- **LL-190 EPIC Fil d'actualité local et publications**
  - LL-228 US Choisir mon quartier à l'inscription : LL-229, LL-230
  - LL-191, LL-192, LL-193, LL-194, LL-196, LL-197, LL-198, LL-234
- **LL-153 EPIC Profil utilisateur** (1/2) : LL-139, LL-142
- **LL-156 EPIC Confidentialité des publications** (1/2) : LL-232
- **LL-154 EPIC Error management** (2/3)
  - LL-162 US Affichage des erreurs (front) : LL-180 à LL-183
- **LL-209 EPIC Événements locaux** (1/3)
  - LL-211 US Stagiaire Créer un événement local : LL-215 à LL-218
- **LL-210 EPIC Signalement et modération** (1/2)
  - LL-213 US Stagiaire Signaler un contenu : LL-222 à LL-224

## Notes

- **Sortis de ce sprint :** LL-235 et LL-233 (vers le Sprint 0), la US LL-160 Visibilité et ses tâches LL-171 à LL-175 (vers le Sprint 2), et LL-231, supprimé car doublon de LL-193.
- **♻️ À reprendre :** le MVP a déjà la création, le fil paginé (10 par page, `?page=`), les composants `PostForm` et `Post`, et la page et la route profil. Tout est sur le fichier JSON et sans notion de quartier.
- **Stage :** le stagiaire ne commence LL-211 et LL-213 qu'une fois LL-202, LL-203 et LL-129 livrés (prérequis de l'EPIC LL-199).
