# 🚀 Guide de Déploiement Intégral - Coolify V4

**Projet : Les Extras V2 (Monorepo Hybride)**

Ce guide vous accompagne étape par étape pour déployer votre application Next.js (Web) et NestJS (API) sur Coolify V4.

---

## 📋 Prérequis

* Avoir une instance Coolify V4 installée sur votre VPS.
* Avoir poussé les derniers fichiers (`Dockerfile.api`, `package.json`, etc.) sur GitHub/GitLab.

---

## 🏗️ Étape 1 : Préparation du Projet (Déjà fait)

Nous avons préparé le terrain en créant deux Dockerfiles distincts :

1. **`Dockerfile` (Racine)** : Pour le Frontend Next.js.
2. **`Dockerfile.api` (Racine)** : Pour l'API NestJS.

> **Note importante** : Comme c'est un monorepo, nous construisons l'API depuis la **racine** du projet pour qu'elle puisse accéder au dossier `packages/shared-types`.

---

## 🗄️ Étape 2 : Base de Données (PostgreSQL)

1. Dans Coolify, allez dans votre Projet > Environment.
2. Cliquez sur **+ Add Resource** > **Databases** > **PostgreSQL**.
3. Nommez-la (ex: `lesextras-db`) et déployez.
4. Une fois démarrée, copiez l'**Internal Connection URL** (ex: `postgresql://postgres:password@uuid:5432/postgres`).

---

## ⚙️ Étape 3 : Déployer l'API (Backend)

1. **Ajouter la ressource** :
    * **+ Add Resource** > **Public Repository** (ou Private).
    * URL du repo : `https://github.com/votre-user/votre-repo`.
    * Branch : `main`.

2. **Configuration (Build Pack)** :
    * Coolify va détecter le projet. **Ne validez pas tout de suite.**
    * Choisissez **Dockerfile** comme "Build Pack".

3. **Paramètres Avancés** (Section "General" ou "Build") :
    * **Build Context** : `/` (Racine du repo).
    * **Dockerfile Path** : `/Dockerfile.api` (Notre fichier spécifique).
    * **Port Exposed** : `4000`.

4. **Variables d'Environnement** (.env) :
    Ajoutez les clés suivantes :
    * `DATABASE_URL` : Collez l'URL interne de PostgreSQL copiée à l'étape 2.
        * *Astuce* : Si besoin, ajoutez `?schema=public` à la fin.
    * `JWT_SECRET` : Votre secret de production.
    * `FRONTEND_URL` : L'URL publique de votre futur frontend (ex: `https://lesextras.com`).
    * `PORT` : `4000`.

5. **Déployer** : Cliquez sur **Deploy**.

---

## 🌐 Étape 4 : Déployer le Web (Frontend)

1. **Ajouter la ressource** :
    * Même procédure : **+ Add Resource** > **Repository**.

2. **Configuration** :
    * Build Pack : **Dockerfile**.
    * **Build Context** : `/`.
    * **Dockerfile Path** : `/Dockerfile` (Le fichier par défaut).
    * **Port Exposed** : `3000`.

3. **Variables d'Environnement** (.env) :
    * `NEXT_PUBLIC_API_URL` : L'URL **Publique** de votre API (ex: `https://api.lesextras.com/api/v1`).
    * `DATABASE_URL` : Même si le front n'accède pas à la DB, Prisma peut en avoir besoin au build. Mettez la même URL interne.

4. **Domaines** :
    * Dans l'onglet "Settings" (ou "General"), configurez votre nom de domaine (ex: `https://lesextras.com`).

5. **Déployer** : Cliquez sur **Deploy**.

---

## 🔄 Étape 5 : Migrations Prisma (Post-Deploy)

Pour que la base de données soit à jour, il faut lancer les migrations.

1. Allez dans la console de l'API sur Coolify (Terminal / Command).
2. Exécutez :

    ```bash
    npx prisma migrate deploy
    ```

    *(Assurez-vous que la variable DATABASE_URL est bien chargée)*.

---

## ✅ Vérification Finale

1. Ouvrez votre URL Web (`https://lesextras.com`).
2. Essayez de vous connecter (`/auth/login`).
3. Si tout fonctionne, bravo ! Votre architecture Monorepo est en ligne.

### 🆘 Dépannage Rapide

* **Erreur Build API** : Vérifiez que `packages/shared-types` est bien copié (voir `Dockerfile.api` lignes 10-11).
* **Erreur Connexion DB** : Vérifiez que l'API et la DB sont dans le même "Network" Coolify (par défaut c'est le cas).
