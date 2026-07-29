<a id="readme-top"></a>

<!-- BADGES (reference-style; definitions at the bottom of the file) -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- HEADER (text title + tagline; logo lives at the END) -->
<div align="center">
  <h1>EcomVision — MERN Admin Dashboard</h1>
  <p><b>A modern full-stack analytics dashboard: a Vite + TypeScript React front end backed by a typed, tested Express API.</b></p>
  <p>
    <a href="{{DEMO_URL}}"><strong>View Demo »</strong></a>
    &nbsp;·&nbsp;
    <a href="https://github.com/omunite215/Project_MERN-Dashboard/issues/new?labels=bug">Report Bug</a>
    &nbsp;·&nbsp;
    <a href="https://github.com/omunite215/Project_MERN-Dashboard/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a>
      <ul><li><a href="#built-with">Built With</a></li></ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li><a href="#architecture">Architecture</a></li>
    <li><a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

EcomVision is an admin dashboard for a fictional e-commerce business. It visualises sales, products, customers, transactions and geography, and exposes management views for admins and user performance. The front end is a single-page React app built with Vite and TypeScript; the back end is a typed Express API over MongoDB.

The project was modernised end to end: the client moved from Create React App to Vite with Zustand for UI state and the TanStack ecosystem (Query for data, Router for routing), and the server was migrated to TypeScript with zod-validated configuration, a global error pipeline, rate limiting, and an automated test suite.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

[![React][React-badge]][React-url]
[![TypeScript][TS-badge]][TS-url]
[![Vite][Vite-badge]][Vite-url]
[![MUI][MUI-badge]][MUI-url]
[![TanStack Query][TQ-badge]][TQ-url]
[![TanStack Router][TR-badge]][TR-url]
[![Zustand][Zustand-badge]][Zustand-url]
[![GSAP][GSAP-badge]][GSAP-url]

[![Bun][Bun-badge]][Bun-url]
[![Node][Node-badge]][Node-url]
[![Express][Express-badge]][Express-url]
[![MongoDB][MongoDB-badge]][MongoDB-url]
[![Mongoose][Mongoose-badge]][Mongoose-url]
[![Vitest][Vitest-badge]][Vitest-url]
[![oxlint][oxlint-badge]][oxlint-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

- **Overview dashboard** — KPI stat boxes, a sales overview line chart, a sales-by-category breakdown, and a recent-transactions grid.
- **Products** — catalogue of product cards with expandable details, animated with GSAP.
- **Customers & Admins** — data grids backed by MUI X DataGrid with column menu, density, export and quick filtering.
- **Transactions** — server-side pagination, sorting and search.
- **Geography** — a Nivo choropleth of users by country.
- **Sales views** — Overview (sales/units toggle), Daily (with a date-range filter) and Monthly line charts.
- **Performance** — per-user affiliate sales.
- **Dark / light theme** — toggled via Zustand and persisted to local storage.
- **Typed REST API** — Express + TypeScript with zod environment and request validation, a global error handler, 404 handling, and IP rate limiting.
- **Tested back end** — Vitest + supertest against an in-memory MongoDB.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Architecture

<p align="center"><img src="client/public/architecture.png" alt="System architecture diagram" width="820" /></p>

The browser loads the React SPA (Vite). TanStack Router drives navigation, TanStack Query manages server state through a small `apiGet` fetch wrapper pointed at `VITE_BASE_URL`, Zustand holds UI state (theme), and MUI, Nivo and GSAP render the interface. Requests hit the Express API, which layers helmet, CORS, a rate limiter and morgan before routing to controllers and typed Mongoose models over MongoDB. Configuration is validated with zod and errors flow through a single error pipeline. The editable source of this diagram lives at [`docs/architecture.drawio`](docs/architecture.drawio).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) `>= 1.3`
- [Node.js](https://nodejs.org) `>= 18`
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/omunite215/Project_MERN-Dashboard.git
   cd Project_MERN-Dashboard
   ```
2. Start the API
   ```bash
   cd server
   bun install
   cp .env.example .env        # then set MONGODB_URL
   bun run seed                # first run only — loads the sample data
   bun run dev                 # http://localhost:5001
   ```
3. Start the client (in a second terminal)
   ```bash
   cd client
   bun install                 # .env already sets VITE_BASE_URL=http://localhost:5001
   bun run dev                 # http://localhost:3000
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Open `http://localhost:3000` and navigate the sidebar: Dashboard, Products, Customers, Transactions, Geography, Overview, Daily, Monthly, Breakdown, Admin and Performance. Use the top-bar icon to toggle dark/light mode — the choice persists across reloads.

The client reads the API base URL from `VITE_BASE_URL` (see `client/.env`); the server reads `MONGODB_URL`, `PORT` (default `5001`), `CLIENT_ORIGIN` and `NODE_ENV` (see `server/.env.example`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Testing

```bash
cd server
bun run test        # Vitest + supertest (in-memory MongoDB)
bun run typecheck   # tsc --noEmit
bun run lint        # oxlint
```

The client is checked with `bun run typecheck`, `bun run lint` and `bun run build`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Authentication and role-based access
- [ ] CI pipeline (typecheck, lint, tests on push)
- [ ] Dockerfile and compose for local MongoDB
- [ ] Front-end component tests

See the [open issues](https://github.com/omunite215/Project_MERN-Dashboard/issues) for a full list of proposed features and known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions make the open-source community a great place to learn and build. Any contributions you make are **greatly appreciated**.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Om Patel

[![GitHub][github-shield]][github-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Instagram][instagram-shield]][instagram-url]
[![Portfolio][portfolio-shield]][portfolio-url]
[![Email][email-shield]][email-url]

Project link: [https://github.com/omunite215/Project_MERN-Dashboard](https://github.com/omunite215/Project_MERN-Dashboard)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Best README Template](https://github.com/othneildrew/Best-README-Template)
- [Shields.io](https://shields.io)
- [Simple Icons](https://simpleicons.org) for tech-stack logos

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LOGO AT THE END (sign-off) -->
<div align="center">
  <br />
  <img src="client/public/mylogo.png" alt="EcomVision logo" width="200" />
  <p><sub>Built by Om Patel</sub></p>
</div>

<!--
================================================================================
  REFERENCE-STYLE LINK & BADGE DEFINITIONS
================================================================================
-->
[contributors-shield]: https://img.shields.io/github/contributors/omunite215/Project_MERN-Dashboard.svg?style=for-the-badge
[contributors-url]: https://github.com/omunite215/Project_MERN-Dashboard/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/omunite215/Project_MERN-Dashboard.svg?style=for-the-badge
[forks-url]: https://github.com/omunite215/Project_MERN-Dashboard/network/members
[stars-shield]: https://img.shields.io/github/stars/omunite215/Project_MERN-Dashboard.svg?style=for-the-badge
[stars-url]: https://github.com/omunite215/Project_MERN-Dashboard/stargazers
[issues-shield]: https://img.shields.io/github/issues/omunite215/Project_MERN-Dashboard.svg?style=for-the-badge
[issues-url]: https://github.com/omunite215/Project_MERN-Dashboard/issues
[license-shield]: https://img.shields.io/github/license/omunite215/Project_MERN-Dashboard.svg?style=for-the-badge
[license-url]: https://github.com/omunite215/Project_MERN-Dashboard/blob/main/LICENSE

[github-shield]: https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white
[github-url]: https://github.com/omunite215
[linkedin-shield]: https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white
[linkedin-url]: https://www.linkedin.com/in/om-patel-ai
[instagram-shield]: https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white
[instagram-url]: https://www.instagram.com/_21omp/
[portfolio-shield]: https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white
[portfolio-url]: https://portfolio-jade-gamma-13.vercel.app
[email-shield]: https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white
[email-url]: mailto:omunite21@gmail.com

[React-badge]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev
[TS-badge]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TS-url]: https://www.typescriptlang.org
[Vite-badge]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vite.dev
[MUI-badge]: https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white
[MUI-url]: https://mui.com
[TQ-badge]: https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white
[TQ-url]: https://tanstack.com/query
[TR-badge]: https://img.shields.io/badge/TanStack%20Router-EF4444?style=for-the-badge&logo=react&logoColor=white
[TR-url]: https://tanstack.com/router
[Zustand-badge]: https://img.shields.io/badge/Zustand-2D3748?style=for-the-badge&logo=react&logoColor=white
[Zustand-url]: https://zustand-demo.pmnd.rs
[GSAP-badge]: https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white
[GSAP-url]: https://gsap.com
[Bun-badge]: https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white
[Bun-url]: https://bun.sh
[Node-badge]: https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org
[Express-badge]: https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com
[MongoDB-badge]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com
[Mongoose-badge]: https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white
[Mongoose-url]: https://mongoosejs.com
[Vitest-badge]: https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white
[Vitest-url]: https://vitest.dev
[oxlint-badge]: https://img.shields.io/badge/oxlint-1B2A4A?style=for-the-badge&logo=oxc&logoColor=white
[oxlint-url]: https://oxc.rs
