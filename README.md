# Management System – Self-Hosted Jenkins CI/CD on AWS EC2

A full-stack HR/employee management app, used here mainly as a hands-on setup for a **self-hosted Jenkins CI/CD pipeline** running entirely on AWS EC2 — as opposed to using a managed CI/CD service like GitHub Actions.

## Overview

- **App:** Basic HR management system (employee records, standard CRUD operations)
- **Focus of this repo:** DevOps setup — Jenkins installed and run directly on EC2, triggered automatically via GitHub webhook, building and deploying through Docker Compose

## Architecture

```
Developer
   │
   │ git push
   ▼
GitHub
   │
   │ Webhook
   ▼
Jenkins (self-hosted on AWS EC2)
   │
   ├── Build Backend
   │     ├── npm ci
   │     └── npm run build
   │
   ├── Build Frontend
   │     ├── npm ci
   │     └── npm run build
   │
   ├── Docker Build
   │     └── docker compose build
   │
   └── Deploy
         └── docker compose (up)
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
     Frontend              Backend
      Nginx                Node.js
      :5173                 :3000
```

## Why self-hosted Jenkins instead of GitHub Actions

The other projects in this portfolio use GitHub Actions (managed CI/CD). This project was built specifically to get hands-on with **running and maintaining Jenkins ourselves** — installing it on an EC2 instance, keeping it up, and wiring the trigger manually via webhook, rather than relying on a CI/CD service that's already fully managed.

## CI/CD Pipeline (Jenkinsfile)

1. **Trigger** — GitHub webhook fires on every push to `main`, no manual "Build Now"
2. **Build Backend** — `npm ci` + `npm run build`
3. **Build Frontend** — `npm ci` + `npm run build`
4. **Docker Build** — `docker compose build` for both services
5. **Deploy** — `docker compose` brings up the containers; environment secrets are injected through Jenkins credentials rather than hardcoded in the repo

## Stack

| Layer | Tech |
|---|---|
| CI/CD | Jenkins (self-hosted), GitHub Webhook |
| Containers | Docker, Docker Compose |
| Infrastructure | AWS EC2 (Ubuntu) |
| Web Server | Nginx (frontend) |
| Backend | Node.js |
| Frontend | React (served on :5173) |

## Notes

This repo is a fork, adapted to build out the Jenkins CI/CD pipeline and EC2 deployment setup described above.


