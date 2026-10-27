# Commits

Pour les messages de commit, nous suivons la convention [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

Format retenu pour le projet :

```text
type(scope): description
```

Le `scope` indique la partie concernée : `frontend`, `backend`, `database` ou `infra`. Les descriptions sont rédigées en anglais.

Types utilisés :

- `feat` : ajout d’une fonctionnalité.
- `fix` : correction d’un bug.
- `refactor` : modification du code sans changement fonctionnel.
- `docs` : modification de la documentation.
- `test` : ajout ou modification de tests.
- `ci` : modification des pipelines CI/CD.
- `chore` : maintenance diverse.

Exemples :

```text
feat(frontend): create login page
fix(backend): handle expired authentication tokens
docs(infra): document docker setup
ci: add lint and test checks
```

Chaque commit doit correspondre à une modification cohérente.

# Branches

Nous retenons **GitFlow** pour organiser le développement et préparer les versions avant leur mise en production.

## Organisation

| Branche | Rôle | Créée depuis | Fusionnée vers |
| --- | --- | --- | --- |
| `main` | Versions stables livrées | — | — |
| `develop` | Intégration des développements | `main` à l’initialisation | — |
| `feature/*` | Nouvelle fonctionnalité | `develop` | `develop` |
| `fix/*` | Correction pendant le développement | `develop` | `develop` |
| `release/*` | Stabilisation d’une version | `develop` | `main` et `develop` |
| `hotfix/*` | Correction urgente en production | `main` | `main` et `develop` |

Le préfixe `fix/*` est une convention complémentaire retenue pour le projet.

## Nommage

Les branches de travail utilisent des noms en anglais, en minuscules et séparés par des tirets :

```text
feature/nom de la feature
etc
```

## Processus de développement

1. Créer une branche depuis `develop` à jour.
2. Développer et réaliser des commits cohérents.
3. Ouvrir une Pull Request vers `develop`.
4. Faire valider la revue de code et les contrôles CI : lint, tests et build.
5. Fusionner la Pull Request puis supprimer la branche de travail.

Les branches `main` et `develop` sont protégées : les modifications passent par une Pull Request.

## Livraison d’une version

Lorsqu’une version est prête, créer une branche `release/x.y.z` depuis `develop`. Cette branche sert aux derniers correctifs et à la préparation de la livraison ; aucune nouvelle fonctionnalité n’y est ajoutée.

Après validation :

1. Fusionner la release dans `main`.
2. Ajouter un tag de version, par exemple `v1.0.0`.
3. Reporter les changements dans `develop`.
4. Supprimer la branche de release.

Une correction urgente suit le même principe avec une branche `hotfix/*` créée depuis `main`. Elle est ensuite reportée dans `develop` et, si nécessaire, dans la release en cours.
