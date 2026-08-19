![alt text](frontend/public/images/og.png)

# ClassPro
### Better way to manage your academics.

View, predict, and strategize your success.

> This monorepo contains both the frontend (Next.js) and backend (Go) for the ClassPro application.
> 
> ---
> 
> ## Monorepo Structure
> 
> ```
> classpro/
> ├── frontend/            # Next.js frontend application
> ├── backend/             # Go backend API (git submodule: rahuletto/goscraper)
> ├── .env.example         # Environment variables template
> ├── docker-compose.yml   # Runs both services together
> ├── Makefile             # Shortcuts around docker compose
> ├── netlify.toml         # Frontend deploy config and short-link redirects
> ├── package.json
> └── README.md
> ```


### Prerequisites

- [Bun](https://bun.sh/) (>=1.2.21)
- [Go](https://golang.org/) (>=1.23.0)
- [Docker](https://docker.com/) (optional, for containerized deployment)

### Setup

1. **Clone the repository:**

   ```bash
   git clone --recurse-submodules https://github.com/rahuletto/classpro
   cd classpro
   ```

2. **Install dependencies:**

   ```bash
   # Install the run script
   bun install

   # Install all dependencies
   bun run install:all
   ```

3. **Environment Setup:**
Copy from `.env.example` and paste it in the root directory

```bash
# Shared Configuration
SUPABASE_URL="your_supabase_url"
SUPABASE_KEY="your_supabase_anon_key"
VALIDATION_KEY="your_validation_key"
BACKEND_URL="http://localhost:8080"

# Backend Specific
ENCRYPTION_KEY="your_encryption_key"
URL="http://localhost:3000,http://localhost:0243,https://class-pro.vercel.app"

# Frontend Specific (autofilled from the variables above)
NEXT_PUBLIC_URL="${BACKEND_URL}"
NEXT_PUBLIC_SUPABASE_URL="${SUPABASE_URL}"
NEXT_PUBLIC_SERVICE_KEY="${SUPABASE_KEY}"
NEXT_PUBLIC_VALIDATION_KEY="${VALIDATION_KEY}"

PORT="8080"
HOST="localhost"
NODE_ENV="development"
GO_ENV="development"
```

`URL` is the backend's CORS allowlist -- every origin the frontend is served
from has to be in it.


> [!TIP]
> Generate secure keys for `VALIDATION_KEY` and `ENCRYPTION_KEY`.
>
> **For Linux, macOS, or Windows with Git Bash/WSL:**
>
> ```bash
> openssl rand -hex 32
> ```
>
> **For Windows with PowerShell:**
>
> ```powershell
> [BitConverter]::ToString((New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes(32)).Replace("-", "").ToLower()
> ```

### Development

#### Run both services:

```bash
# Frontend (http://localhost:0243)
bun run dev:frontend

# Backend (http://localhost:8080)
bun run dev:backend

# Run the app as a whole
bun run dev
```

### Production Build

```bash
# Build both services as a whole
bun run build

# Build individually
bun run build:frontend
bun run build:backend
```

### Docker Deployment

```bash
# Copy .env into both workspaces first. NEXT_PUBLIC_* values are inlined into
# the client bundle while the frontend image builds, so changing them later
# needs a rebuild rather than a restart.
bun run sync:env

# Build and run with Docker Compose
bun run docker:build
bun run docker:up

# Stop services
bun run docker:down
```


> [!WARNING]
> We will **NOT** take account for anything caused by your self-hosted instance


## Why Choose ClassPro?

- **Mobile-First Approach:** Built for mobile devices, Optimized for desktop and tablet devices.
- **Open Source:** Transparent and community-driven.
- **Massive Community**: Used by 16k+ students every month.
- **Timetable Generation:** Creates a full timetable based on your class schedule.
- **Attendance Prediction:** Predicts the percent based on your expected leave days
- **Safe and Secure:** Built with privacy and security in mind.
- **No Bloat:** Streamlined and efficient, with no unnecessary bloatware.

### The Idea Behind ClassPro

This project was intended to show the timetable and attendance. but it grew and scaled to a full-on replacement to SRM Academia. We made sure to use the web-standards and the best-in-class approaches to make sure our service is `fast`, `easy-to-use` and `easy on eyes`.

## Contributors

[![All Contributors](https://img.shields.io/github/all-contributors/Rahuletto/ClassPro?color=b3b3d1&style=for-the-badge)](#contributors)

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://marban.is-a.dev"><img src="https://avatars.githubusercontent.com/u/71836991?v=4?s=100" width="100px;" alt="Rahul Marban"/><br /><sub><b>Rahul Marban</b></sub></a><br /><a href="https://github.com/Rahuletto/ClassPro/commits?author=Rahuletto" title="Code">💻</a> <a href="#design-Rahuletto" title="Design">🎨</a> <a href="https://github.com/Rahuletto/ClassPro/issues?q=author%3ARahuletto" title="Bug reports">🐛</a> <a href="#a11y-Rahuletto" title="Accessibility">️️️️♿️</a> <a href="#infra-Rahuletto" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-Rahuletto" title="Maintenance">🚧</a> <a href="#projectManagement-Rahuletto" title="Project Management">📆</a> <a href="https://github.com/Rahuletto/ClassPro/pulls?q=is%3Apr+reviewed-by%3ARahuletto" title="Reviewed Pull Requests">👀</a> <a href="#security-Rahuletto" title="Security">🛡️</a> <a href="#tool-Rahuletto" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/root-daemon"><img src="https://avatars.githubusercontent.com/u/47695678?v=4?s=100" width="100px;" alt="Srivishal Sivasubramanian"/><br /><sub><b>Srivishal Sivasubramanian</b></sub></a><br /><a href="https://github.com/Rahuletto/ClassPro/commits?author=root-daemon" title="Code">💻</a> <a href="https://github.com/Rahuletto/ClassPro/issues?q=author%3Aroot-daemon" title="Bug reports">🐛</a> <a href="#maintenance-root-daemon" title="Maintenance">🚧</a> <a href="https://github.com/Rahuletto/ClassPro/pulls?q=is%3Apr+reviewed-by%3Aroot-daemon" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://portfolio-debaditya.vercel.app/"><img src="https://avatars.githubusercontent.com/u/123065261?v=4?s=100" width="100px;" alt="Debaditya Malakar"/><br /><sub><b>Debaditya Malakar</b></sub></a><br /><a href="#design-DebadityaMalakar" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Aakarsh-Kumar"><img src="https://avatars.githubusercontent.com/u/72206467?v=4?s=100" width="100px;" alt="Aakarsh Kumar"/><br /><sub><b>Aakarsh Kumar</b></sub></a><br /><a href="https://github.com/Rahuletto/ClassPro/commits?author=Aakarsh-Kumar" title="Code">💻</a> <a href="https://github.com/Rahuletto/ClassPro/issues?q=author%3AAakarsh-Kumar" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/harsshhan"><img src="https://avatars.githubusercontent.com/u/146644928?v=4?s=100" width="100px;" alt="HARSHAN A M"/><br /><sub><b>HARSHAN A M</b></sub></a><br /><a href="#data-harsshhan" title="Data">🔣</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

---

## [License](https://creativecommons.org/licenses/by-nc-nd/4.0/)

### You are free to:

- **Share:** Copy and redistribute the material in any medium or format.

### Under the following terms:

- **Attribution:** You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial:** You may not use the material for commercial purposes.
- **NoDerivatives:** If you remix, transform, or build upon the material, you may not distribute the modified material.
