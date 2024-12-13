# Design System

This is a design system project built with Next.js, React, and various other libraries to provide a rich set of UI components and utilities. The project includes markdown editing capabilities and other features like authentication and PDF handling.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Project](#running-the-project)
  - [Development](#development)
  - [Build](#build)
  - [Start](#start)
- [Project Structure](#project-structure)
- [Prisma](#prisma)
- [API Routes](#api-routes)
- [Styling](#styling)
- [Code Quality](#code-quality)
- [License](#license)

## Getting Started

### Prerequisites

- Node.js and npm (or Yarn) installed on your machine.
- Git for version control.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/design-system.git
   cd design-system
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

   Or if you're using Yarn:

   ```bash
   yarn install
   ```

   Or if you're using pnpm:

   ```bash
   pnpm install
   ```

3. Initialize Prisma:

   ```bash
   npm run prisma:init
   ```

   Or with Yarn:

   ```bash
   yarn prisma:init
   ```

   Or with pnpm:

   ```bash
   pnpm prisma:init
   ```

## Running the Project

### Development

To run the project in development mode with Turbopack:

```bash
npm run dev
```

Or with Yarn:

```bash
yarn dev
```

Or with pnpm:

```bash
pnpm dev
```

### Build

To build the project for production:

```bash
npm run build
```

Or with Yarn:

```bash
yarn build
```

Or with pnpm:

```bash
pnpm build
```

### Start

To start the project in production mode:

```bash
npm run start
```

Or with Yarn:

```bash
yarn start
```

Or with pnpm:

```bash
pnpm start
```

## Project Structure

```
design-system/
├── components/
│   ├── MarkdownEditor.tsx
│   └── ... (other components)
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── api/
│   │   └── ... (API routes)
│   └── ... (other pages)
├── prisma/
│   ├── schema.prisma
│   └── ... (other Prisma files)
├── public/
│   ├── images/
│   │   └── ... (image assets)
│   └── ... (other public assets)
├── styles/
│   ├── globals.css
│   └── ... (other stylesheets)
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── tsconfig.json
└── ... (other configuration files)
```

## Prisma

Prisma is used for database management in this project.

**Initialization Steps:**

1. Generate Prisma Client:

   ```bash
   npm run prisma:generate
   ```

   Or with Yarn:

   ```bash
   yarn prisma:generate
   ```

   Or with pnpm:

   ```bash
   pnpm prisma:generate
   ```

2. Run Prisma Migrations:

   ```bash
   npm run prisma:migrate
   ```

   Or with Yarn:

   ```bash
   yarn prisma:migrate
   ```

   Or with pnpm:

   ```bash
   pnpm prisma:migrate
   ```

**Schema File:**

The schema file for Prisma is located in `prisma/schema.prisma`.

## API Routes

API routes are located in the `pages/api` directory. These routes handle various server-side operations such as authentication, data fetching, and more.

**Example API Route:**

```tsx
// pages/api/example.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello from the API!' });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

## Styling

Styling is managed using Tailwind CSS and custom CSS files.

**Global Styles:**

The global styles are located in `styles/globals.css`.

**Tailwind CSS Configuration:**

Tailwind CSS configuration is located in `tailwind.config.js`.

## Code Quality

Code quality is maintained using ESLint.

**ESLint Configuration:**

The ESLint configuration is located in `.eslintrc.json`.

**Running Linting:**

```bash
npm run lint
```

Or with Yarn:

```bash
yarn lint
```

Or with pnpm:

```bash
pnpm lint
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
