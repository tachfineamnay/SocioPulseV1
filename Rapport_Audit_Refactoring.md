# Rapport Technique : Audit et Refactoring des Extras V2

Date : 5 Décembre 2025

Ce document détaille les interventions techniques réalisées lors de la session de refactoring. L'objectif était de transformer une codebase fonctionnelle en une architecture professionnelle, sécurisée et performante.

---

## 1. Architecture et Gestion des Types

### Ce qui a été fait

Nous avons restructuré le projet pour qu'il fonctionne comme un vrai "monorepo" (dépôt unique contenant plusieurs projets).

- **Création du dossier `packages/shared-types`** : Ce dossier contient désormais toutes les définitions de données (les "types") qui sont communes au site web et à l'API.
- **Mise en place des "Workspaces"** : Nous avons configuré NPM pour qu'il comprenne que le dossier `shared-types` est une librairie interne utilisable par `apps/web` et `apps/api`.

### Analyse étape par étape

Avant, le frontend (Next.js) et le backend (NestJS) redéfinissaient souvent les mêmes formats de données (ex: qu'est-ce qu'un "Utilisateur" ?). Si on changeait le backend, le frontend cassait sans prévenir.
Maintenant, le backend génère les types depuis la base de données (Prisma), les exporte dans `shared-types`, et le frontend les consomme.

> **Note de l'expert** : Cette approche implémente le principe de "Single Source of Truth" (Source Unique de Vérité). En architecture distribuée, c'est la seule façon de garantir la cohérence des données à long terme. Cela élimine une classe entière de bugs appelés "runtime type errors".

---

## 2. Optimisation de la Base de Données (Prisma)

### Ce qui a été fait

Nous avons ajouté des "index composites" dans le fichier de définition de base de données (`schema.prisma`).

- Pour les Missions : Index sur `[status, urgencyLevel]`
- Pour les Posts : Index sur `[city, isActive]` et `[type, isActive]`
- Pour les Utilisateurs : Index sur `[role, status]`

### Analyse étape par étape

Une base de données sans index est comme un livre sans table des matières : pour trouver une info, il faut lire toutes les pages.
Avant, pour trouver "toutes les missions urgentes à Lyon", la base devait scanner toutes les missions une par une.
Avec les index composites, la base crée un "raccourci" combinant ces deux critères.

> **Note de l'expert** : Les index composites sont cruciaux pour les performances. Un index simple sur "Ville" ne suffit pas si on filtre toujours par "Ville + Statut". L'ordre des champs dans l'index est aussi vital (appelé "cardinalité") : on met toujours le champ qui filtre le plus en premier.

---

## 3. Performance Frontend (Next.js & SSR)

### Ce qui a été fait

Nous avons totalement réécrit la page `/wall` (le fil d'actualité).

- **Avant** : Le fichier `page.tsx` contenait `use client`. Tout le code (logique, affichage, données) était envoyé au navigateur de l'utilisateur. Le moteur de recherche (Google) voyait une page vide qui se remplissait après.
- **Après** : Le fichier `page.tsx` est maintenant un composant serveur. Il récupère les données sur le serveur et envoie du HTML pur. La partie interactive (filtres, boutons) a été isolée dans un petit composant client `WallFeedClient`.

### Analyse étape par étape

C'est le changement le plus impactant pour l'utilisateur.

1. Le serveur reçoit la requête `/wall`.
2. Il va chercher les posts en base de données (très rapide car sur le même réseau).
3. Il génère le HTML complet avec les titres, descriptions, etc.
4. Il envoie ce HTML au navigateur.
L'utilisateur voit le contenu immédiatement, sans attendre que le JavaScript ne se charge.

> **Note de l'expert** : C'est le pattern "Server Component with Client Island". Pour le SEO (référencement), c'est indispensable car les robots d'indexation lisent le HTML initial. Pour la performance, cela améliore le "First Contentful Paint" (FCP), métrique clé de Google.

---

## 4. Sécurité Backend (NestJS)

### Ce qui a été fait

Nous avons durci la sécurité de l'API sur trois fronts :

1. **Filtres d'Exception Globaux** : Création d'un système qui attrape toutes les erreurs.
2. **Nettoyage des types `any`** : Suppression des types "fourre-tout" dans le service du Wall.
3. **Limitation de débit (Rate Limiting)** : Protection de la connexion.

### Analyse étape par étape

- **Filtres** : Avant, si le serveur crashait, il pouvait renvoyer des détails techniques (stack trace) à l'utilisateur. C'est une faille de sécurité. Maintenant, le filtre intercepte l'erreur et renvoie un message générique "Erreur interne" en production, tout en enregistrant le vrai problème dans les logs.
- **Rate Limiting** : Nous avons configuré une limite de 3 tentatives de connexion par minute sur la route `/auth/login`. Cela empêche les robots de tester des milliers de mots de passe (Brute Force).

> **Note de l'expert** : L'utilisation de `any` en TypeScript est un "code smell" majeur. Cela désactive littéralement le compilateur sur cette partie du code. En remplaçant les `any` par des types Prisma stricts (`Prisma.PostWhereInput`), nous avons rendu le code autodocumenté et résistant aux refactorings futurs.

---

## Conclusion

Le projet est passé d'un état "prototype fonctionnel" à un état "production-grade".

- **Structure** : Saine et évolutive.
- **Performance** : Optimisée pour le SEO et la charge.
- **Sécurité** : Les bases industrielles sont posées.

La dette technique a été considérablement réduite, ce qui rendra les futurs développements plus rapides et plus sûrs.
