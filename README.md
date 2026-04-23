# 👻 Ghostmail

[![Node](https://img.shields.io/badge/node-%3E=24-brightgreen)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-workspaces-f69220)](https://pnpm.io/)
[![architecture](https://img.shields.io/badge/architecture-monorepo-blue)](#-monorepo-structure)
[![license](https://img.shields.io/badge/license-MIT-lightgrey)](./LICENSE)

**Ghostmail** is a modern, high-performance ephemeral email system architecture. It handles everything from SMTP ingestion to a polished React Router v7 frontend, all within a robust TypeScript monorepo.

---

## ✨ Features

- 📨 **SMTP Ingestion**: Custom SMTP server built with `smtp-server` and `mailparser` to receive and process emails.
- ⏳ **Ephemeral by Design**: Automatic email and mailbox expiration powered by MongoDB TTL indexes.
- 🔒 **Authenticated Mailboxes**: Secure user management with both ephemeral (1-hour) and persistent mailbox options.
- ⚡ **Modern Frontend**: Built with React Router v7 (Framework Mode), Vite, Tailwind CSS, and DaisyUI.
- 🏗️ **DAL Abstraction**: Centralized Data Access Layer using `DataLoader` for efficient batching and caching.
- 🧪 **TDD First**: Comprehensive testing suite using Vitest and MongoDB memory server.
- 🧹 **Ultra-fast Tooling**: Utilizing OXC (oxlint & oxfmt) for near-instant linting and formatting.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js 24+
- **Package Manager**: pnpm Workspaces
- **Backend/Database**: MongoDB with TTL indexes
- **Frontend Framework**: React Router v7
- **Bundler**: Vite
- **Styling**: Tailwind CSS + DaisyUI
- **Testing**: Vitest
- **Linting/Formatting**: oxlint + oxfmt

---

## 🧱 Monorepo Structure

```text
/packages
├── 🌍 client        # React Router v7 frontend (Vite)
├── 🗄️ database      # Shared Data Access Layer & MongoDB Models
└── 📧 smtp-server   # SMTP ingestion service
```

### Dependency Boundaries

To maintain a clean architecture, we enforce strict dependency rules:

- `smtp-server` → `database`
- `client` → `database` (via loaders and actions)
- `database` is standalone (no dependencies on other packages)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 24+](https://nodejs.org/)
- [pnpm 10+](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/) (running instance or local)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ghostmail.git
   cd ghostmail
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and configuration
   ```

### Running Locally

```bash
# Start all packages in development mode
pnpm dev

# Or start specific packages
pnpm --filter client dev
pnpm --filter smtp-server dev
```

### Building for Production

```bash
pnpm build
```

---

## 🧪 Testing

We prioritize Test-Driven Development (TDD).

```bash
# Run all tests
pnpm test

# Run tests for a specific package
pnpm --filter database test
```

---

## 💅 Development Guidelines

### Formatting & Linting

We use `oxfmt` and `oxlint` for speed and consistency.

- **Formatting**: `pnpm format` (Double quotes, no semicolons)
- **Linting**: `pnpm lint` (No `any`, sorted imports, strict typing)

### Architecture Principles

- **Package Isolation**: Never reach across packages except through defined boundaries.
- **DAL Only**: No direct MongoDB access outside the `database` package.
- **Loaders/Actions**: The `client` uses React Router v7 data APIs exclusively for mutations and fetches.

---

## 📌 Philosophy

Ghostmail is designed for **simplicity**, **modularity**, and **modernity**. It leverages the latest web technologies to provide a fast, reliable, and developer-friendly email testing platform.

---

---

## 🚢 Deployment

Ghostmail is designed to be deployed to an OCI instance (Ubuntu/Oracle Linux) using Docker Compose and GitHub Actions.

### 🛡️ Architecture
- **Web**: Cloudflare Proxy ➜ OCI ➜ Traefik (Auto-SSL) ➜ React Router 7.
- **SMTP**: OCI Native Protection ➜ Node.js SMTP Server.
- **DB**: MongoDB (Internal Docker network).

### 🚀 Setup Steps

1. **OCI Instance**:
   - Install Docker & Docker Compose.
   - Open ports `80`, `443`, `25`, `465`, `587` in your VCN Security List.

2. **GitHub Secrets**:
   Set the following secrets in your repository:
   - `OCI_HOST`: Your instance IP.
   - `OCI_USER`: Usually `ubuntu` or `opc`.
   - `OCI_SSH_KEY`: Your private SSH key.
   - `MONGO_USER`: Admin username for MongoDB.
   - `MONGO_PASSWORD`: Admin password for MongoDB.
   - `SESSION_SECRET`: A long random string for session signing.

3. **Domain & DNS**:
   - Point `ghostmail.dev` to your OCI IP in Cloudflare.
   - Enable the Cloudflare Proxy (Orange Cloud) for the A record.
   - Set up an MX record pointing to your OCI IP.

4. **Deploy**:
   Push to `master` to trigger the automatic deployment.

---

## 📜 License

MIT
