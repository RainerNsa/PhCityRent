# Real Estate Platform – Project Overview

## Table of Contents
- [About](#about)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Migration Plans](#migration-plans)
- [Team Guides](#team-guides)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## About
This project is a modern, full-featured real estate platform designed to streamline property search, discovery, and management for users in Port Harcourt and beyond. It supports multiple user roles (tenants, landlords, agents, admins) and provides advanced tools for property listing, application, messaging, payments, analytics, and more.

---

## Key Features
- **Advanced Property Search & Discovery:**
  - Filter by location, price, amenities, verification, and more
  - Grid/list views, progressive loading, and real-time updates
- **User Roles & Dashboards:**
  - Dedicated dashboards for tenants, landlords, agents, and admins
- **Authentication & Authorization:**
  - Secure login, registration, and role-based access
- **Property Management:**
  - Listing, editing, comparison, and management tools
- **Application & Screening:**
  - Rental application forms, status tracking, and tenant screening
- **Messaging & Notifications:**
  - Real-time messaging, notification centers, and alerts
- **Payments & Escrow:**
  - Payment dashboards, escrow forms, and payment provider integration
- **Analytics & Reporting:**
  - Admin and agent analytics, performance tracking, and advanced reporting
- **Localization & Accessibility:**
  - Language management and mobile-optimized components
- **AI & Automation:**
  - Property recommendations and automated workflows
- **Seed Data & Testing:**
  - Tools for seeding sample data for development/testing

---

## Architecture

### High-Level Diagram
```mermaid
flowchart TD
  subgraph Frontend [Frontend (React)]
    A1[User Interface]
    A2[Hooks & State]
    A3[Component Library]
    A4[Auth, Messaging, Search]
  end

  subgraph Backend [Backend API]
    B1[Node.js/Express or NestJS]
    B2[PostgreSQL]
    B3[File Storage (S3/Local)]
    B4[WebSockets]
    B5[Payments]
  end

  subgraph DevOps [DevOps]
    C1[Docker, CI/CD]
    C2[Nginx/Traefik]
    C3[Monitoring]
    C4[Backups]
  end

  A1 -->|API Calls| Backend
  A2 -->|Hooks| A1
  A3 -->|UI| A1
  A4 -->|Features| A1
  Backend -->|REST/GraphQL| A1
  C1 -->|Build/Deploy| Backend
  C2 -->|Proxy| Backend
  C3 -->|Monitor| Backend
  C4 -->|Backup| B2
```

---

## Tech Stack
- **Frontend:** React (TypeScript), Vite, Tailwind CSS, Lucide-react
- **Backend:** Node.js (Express or NestJS), PostgreSQL, Socket.IO, REST/GraphQL APIs
- **Authentication:** JWT-based, role-based access
- **File Storage:** S3-compatible or local disk
- **Payments:** Paystack, Stripe, or similar
- **DevOps:** Docker, Nginx/Traefik, GitHub Actions, Prometheus, Grafana, Sentry

---

## Migration Plans
This project is transitioning from a Supabase/serverless backend to a traditional, self-hosted backend. The migration is organized into three main tracks:

- **[Backend Migration Plan](./backend.md):**
  - API, database, features, and integration
- **[Frontend Migration Plan](./frontend.md):**
  - API integration, refactoring, and testing
- **[DevOps Migration Plan](./devops.md):**
  - Infrastructure, CI/CD, deployment, and monitoring

Each plan includes a detailed week-by-week timeline and deliverables.

---

## Team Guides
To ensure project success, each team has a dedicated success guide:

- **[Backend Success Guide](./backend-success-guide.md):**
  - Responsibilities, best practices, and critical steps for backend developers
- **[Frontend Success Guide](./frontend-success-guide.md):**
  - Responsibilities, best practices, and critical steps for frontend developers
- **[DevOps Success Guide](./devops-success-guide.md):**
  - Responsibilities, best practices, and critical steps for DevOps engineers

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL
- Docker (for local development and deployment)
- Yarn or npm

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual credentials (never commit this file!)
   ```
   📖 **See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed setup instructions**

   ⚠️ **Security Notice:** Never commit `.env` files to version control
4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Database & Backend
- See [backend.md](./backend.md) for backend setup and migration instructions.

### DevOps & Deployment
- See [devops.md](./devops.md) for infrastructure and deployment instructions.

---

## Contributing
We welcome contributions from the community! Please read our [contributing guidelines](./CONTRIBUTING.md) before submitting a pull request.

---

## License
This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
