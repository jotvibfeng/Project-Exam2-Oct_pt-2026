# Holidaze

Holidaze is a venue booking application where users can browse venues, view venue details, create an account, log in, and book accommodation for selected dates.

Venue managers can also manage their venue information and view bookings connected to their profile and can make their own venue listings and edit existing ones or delete if necessary.

## Project Information

- **Project:** Project Exam 2
- **Author:** Joakim Tviberg Fengås
- **Live site:** https://project-exam2-oct-pt-2026-git-main-jotvibfengs-projects.vercel.app/
- **Repository:** https://github.com/jotvibfengs/project-exam2-oct-pt-2026

## Features

- User can browse and search available venues
- User can view venue images, descriptions, prices, ratings, amenities, and guest capacity
- User can register and log in with a Noroff account
- User can toggle between light and dark themes
- User can create and manage venue bookings
- User can view personal bookings in the profile area
- Venue managers can create, edit, and manage their venues
- Responsive layout for desktop, tablet, and mobile screens

## Technologies

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- TanStack Form
- Tailwind CSS
- Zod
- Vitest
- Noroff Holidaze API

## Getting Started

### Requirements

- Node.js
- pnpm
- A Noroff API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jotvibfengs/project-exam2-oct-pt-2026
   cd project-exam2-oct-pt-2026/holidaze
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `holidaze` folder:

   ```env
   VITE_API_KEY=your_noroff_api_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Available Commands

Run these commands from the `holidaze` folder:

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run test      # Run the test suite
npm run lint      # Run ESLint
npm run format    # Check formatting with Prettier
npm run check     # Format files and fix ESLint issues
```

## Project Structure

```text
holidaze/
├── public/              Static files and application metadata
├── src/
│   ├── components/      Reusable UI components
│   ├── routes/          Application pages and routes
│   ├── services/        API and authentication services
│   ├── utils/           Shared constants and utilities
│   ├── main.tsx         Application entry point
│   ├── router.tsx       Router configuration
│   └── styles.css       Global styles and Tailwind configuration
├── package.json
├── pnpm-lock.yaml
└── vite.config.ts
```

## API

The application uses the Noroff Holidaze API for authentication, venues, profiles, and bookings:

```text
https://v2.api.noroff.dev/holidaze
```

The API key is loaded through the `VITE_API_KEY` environment variable. Do not commit the `.env` file or expose private credentials in the repository.

## Testing

The project uses Vitest and Testing Library. Run the tests with:

```bash
npm run test
```
