<div align="center">

<img src="client/assets/images/Logo.png" alt="Karthificial Logo" width="160" />

# Karthificial Website

**A full-stack academic platform built for smarter student learning.**  
Notes, question papers, MCQ practice, career guidance, admin content management, authentication, cloud storage, and analytics — all in one structured education platform for Tamil Nadu State Board students.

<br>

<div align="center">

# 🌐 Live Project Preview

### Karthificial is deployed as a full-stack academic platform.

<a href="https://karthificial-website.vercel.app/index.html" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/OPEN-KARTHIFICIAL-d4af37?style=for-the-badge&logo=googlechrome&logoColor=black" alt="Open Karthificial Live Website" />
</a>

<br><br>

<table>
  <tr>
    <td align="center">
      <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
      </a>
      <br>
      <strong>Hosting</strong>
    </td>
    <td align="center">
      <a href="https://clerk.com/" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
      </a>
      <br>
      <strong>Authentication</strong>
    </td>
    <td align="center">
      <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
      </a>
      <br>
      <strong>Database</strong>
    </td>
    <td align="center">
      <a href="https://cloudinary.com/" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/badge/Media-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
      </a>
      <br>
      <strong>Media</strong>
    </td>
  </tr>
</table>

</div>

---

<div align="center">

## Core Technologies

### Frontend

[![HTML5](https://img.shields.io/badge/HTML5-Structure-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Interface-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Logic-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### Services & Infrastructure

[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Hosting-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

### Backend

[![Java](https://img.shields.io/badge/Java-Server-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-API-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Maven](https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)](https://maven.apache.org/)

### Architecture

`REST API` · `JPA` · `Hibernate` · `Clerk Auth` · `DTO` · `Repository` · `Service Layer` · `CORS` · `Environment Config`

</div>

---

</div>

## About

**Karthificial Website** is a full-stack academic platform designed to support Tamil Nadu State Board students (10th and 12th standard) with structured academic resources, MCQ practice, career guidance, secure authentication, an admin content management dashboard, cloud media uploads, and deployment analytics.

The platform follows a separated full-stack architecture. The frontend is built with **HTML, CSS, and JavaScript**. Authentication is handled by **Clerk**, database storage by **Supabase PostgreSQL**, media uploads by **Cloudinary**, and the entire frontend is deployed on **Vercel**. A **Java Spring Boot** backend handles MCQ attempt storage and additional server-side logic.

Developed by a **3-developer team** over 10 days of active development (8+ hours per day), this project covers frontend development, backend architecture, database integration, admin tooling, deployment, debugging, and documentation.

---

## Project Purpose

Karthificial was created to provide students with a centralized digital learning platform where academic content, practice tools, and career guidance are available in one organized environment.

The platform focuses on:

- Making study resources easier to access for 10th and 12th State Board students
- Supporting subject-wise MCQ practice with shuffle and scoring
- Helping students make informed academic and career decisions
- Building a secure, admin-managed content system
- Creating a foundation for future dashboards, analytics, and institutional tools

---

## Features

### Academic Resources

- 10th standard notes
- 12th standard notes
- 10th standard question papers
- 12th standard question papers
- Subject-based resource pages with thumbnail cards
- Organized content navigation

### MCQ Practice System

- Subject-wise MCQ sets
- Interactive question practice with timer
- Shuffle mode per set
- Score calculation and results display
- MCQ attempt submission to Supabase
- Admin-controlled MCQ set and question management
- Per-student performance tracking in the admin dashboard
- Weak question detection and answer distribution analysis

### Career Guidance & Articles

- After 10th guidance
- After 12th guidance
- Group selection guidance
- Degree selection guidance
- Common career mistakes
- Student mindset and future planning
- Dynamic career articles with slug-based routing
- Related article suggestions per article page
- Admin article editor with rich text and YouTube embed support

### Admin Dashboard

The admin panel is protected by Clerk-based role authentication and provides full content control.

- MCQ set creation, editing, and deletion
- Question management per set
- Student performance viewer with per-student breakdown
- Weak questions report and answer distribution analysis
- Notes management panel
- Question papers management panel
- Career article editor (create, edit, delete)
- Cloudinary-powered media uploader for article thumbnails and assets

### Authentication (Clerk)

Authentication is fully handled by **Clerk**, replacing the previous custom JWT approach.

- Clerk-powered signup and login
- Signed-in navbar with user display name
- Admin role detection via Clerk metadata
- Navbar state cached via local storage to eliminate auth flash
- Protected admin routes via Clerk session verification
- Logout support across all pages

### Cloud Media (Cloudinary)

- Admin image uploads via Cloudinary Upload Widget
- Media used for article thumbnails and academic resource assets
- Cloudinary handles storage, transformation, and delivery

### Analytics

- Vercel Speed Insights for frontend performance monitoring
- Page visit and navigation tracking
- Student engagement insights
- MCQ usage and career guidance usage data

---

## Tech Stack

| Layer              | Technology                         |
| ------------------ | ---------------------------------- |
| Frontend           | HTML5, CSS3, JavaScript            |
| Authentication     | Clerk                              |
| Database           | Supabase PostgreSQL                |
| Media Storage      | Cloudinary                         |
| Backend            | Java, Spring Boot, Maven           |
| API Architecture   | REST API                           |
| ORM                | Spring Data JPA, Hibernate         |
| Performance        | Vercel Speed Insights              |
| Frontend Hosting   | Vercel                             |
| Backend Hosting    | Replit                             |
| Version Control    | Git, GitHub                        |
| Development Tools  | VS Code, Browser DevTools          |

---

## Architecture Overview

```txt
User
 │
 ▼
Frontend on Vercel
HTML / CSS / JavaScript
 │
 ├── Auth: Clerk (signup, login, session, admin role)
 │
 ├── Database: Supabase (MCQ sets, questions, attempts, articles, papers)
 │
 ├── Media: Cloudinary (article images, resource assets)
 │
 └── API Requests
      ▼
   Backend on Replit
   Java Spring Boot REST API
      │
      └── MCQ attempt storage, additional server logic

Performance Layer:
Vercel Speed Insights tracks frontend load metrics.
```

---

## Project Structure

```txt
Karthificial-Website/
│
├── client/
│   ├── assets/
│   │   ├── cg_thumb/       (career guidance thumbnails)
│   │   ├── contacts/       (social icons)
│   │   ├── images/         (logo, favicon)
│   │   ├── slides/         (homepage slider images)
│   │   └── thumbnail/      (subject thumbnails)
│   │
│   ├── index.html
│   ├── career-guidance.html
│   ├── after-12th.html
│   ├── article.html
│   ├── mcq.html
│   ├── mcq-set.html
│   ├── notes-10th.html
│   ├── notes-12th.html
│   ├── papers-10th.html
│   ├── papers-12th.html
│   ├── login.html
│   ├── signup.html
│   ├── forgot-password.html
│   ├── reset-password.html
│   ├── profile-setup.html
│   ├── contact.html
│   ├── student-mindset.html
│   │
│   ├── admin.html                  (admin dashboard)
│   ├── admin-mcq.html              (MCQ manager)
│   ├── admin-career.html           (career articles editor)
│   ├── admin-notes.html            (notes manager)
│   ├── admin-papers.html           (papers manager)
│   │
│   ├── clerk-auth.js               (Clerk integration, navbar auth state)
│   ├── auth.js                     (auth helpers, session logic)
│   ├── admin.js                    (admin page protection)
│   ├── supabase-config.js          (Supabase client setup)
│   ├── cloudinary-upload.js        (Cloudinary upload widget)
│   ├── config.js                   (API and environment config)
│   ├── mcq-public.js               (public MCQ loader)
│   ├── mcq-set.js                  (MCQ practice session logic)
│   ├── mcq-manager.js              (MCQ CRUD from frontend)
│   ├── admin-mcq-manager.js        (admin MCQ analytics and management)
│   ├── admin-career.js             (career article admin editor)
│   ├── admin-papers.js             (papers admin manager)
│   ├── career-articles.js          (public career article cards)
│   ├── article.js                  (single article page renderer)
│   ├── static-related-articles.js  (related article suggestions)
│   ├── papers.js                   (question papers modal)
│   ├── script.js                   (global scripts)
│   ├── speed-insights.js           (Vercel Speed Insights)
│   ├── style.css
│   ├── structure.css
│   ├── variables.css
│   └── package.json
│
├── server/
│   └── backend/
│       ├── src/main/java/com/karthificial/backend/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── model/
│       │   ├── repository/
│       │   ├── service/
│       │   └── BackendApplication.java
│       ├── src/main/resources/
│       │   └── application.properties
│       └── pom.xml
│
├── documentation/     (10-day dev log)
├── LICENSE
├── .gitignore
└── README.md
```

---

## Main Pages

| Page                    | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `index.html`            | Main landing page                           |
| `career-guidance.html`  | Career guidance hub                         |
| `after-12th.html`       | Guidance after 12th standard                |
| `article.html`          | Dynamic career article (slug-based routing) |
| `student-mindset.html`  | Student mindset and planning                |
| `mcq.html`              | MCQ set selection page                      |
| `mcq-set.html`          | Active MCQ practice session                 |
| `notes-10th.html`       | 10th standard notes                         |
| `notes-12th.html`       | 12th standard notes                         |
| `papers-10th.html`      | 10th standard question papers               |
| `papers-12th.html`      | 12th standard question papers               |
| `login.html`            | Student login (Clerk)                       |
| `signup.html`           | Student signup (Clerk)                      |
| `forgot-password.html`  | Forgot password (Clerk-handled)             |
| `reset-password.html`   | Password reset (Clerk-handled)              |
| `profile-setup.html`    | Student profile setup                       |
| `contact.html`          | Contact and social links                    |
| `admin.html`            | Admin dashboard (Clerk-protected)           |
| `admin-mcq.html`        | MCQ and question manager                    |
| `admin-career.html`     | Career article editor                       |
| `admin-notes.html`      | Notes content manager                       |
| `admin-papers.html`     | Question papers content manager             |

---

## Backend Modules

| Module                         | Responsibility                          |
| ------------------------------ | --------------------------------------- |
| `AuthController`               | Authentication API routes               |
| `McqController`                | MCQ submission and stats APIs           |
| `AuthService`                  | Signup, login, and authentication logic |
| `JwtService`                   | JWT token generation                    |
| `PasswordResetService`         | Password reset logic                    |
| `EmailService`                 | Email-related backend logic             |
| `UserRepository`               | User database operations                |
| `McqAttemptRepository`         | MCQ attempt data operations             |
| `PasswordResetTokenRepository` | Password reset token data operations    |

---

## API Overview

### Authentication APIs

| Method | Endpoint           | Description                               |
| ------ | ------------------ | ----------------------------------------- |
| `POST` | `/api/auth/signup` | Register a new student                    |
| `POST` | `/api/auth/login`  | Login and receive authentication response |
| `GET`  | `/api/auth/health` | Check backend health status               |

### MCQ APIs

| Method | Endpoint          | Description                      |
| ------ | ----------------- | -------------------------------- |
| `POST` | `/api/mcq/submit` | Submit MCQ attempt data          |
| `GET`  | `/api/mcq/stats`  | Fetch MCQ performance statistics |

> API routes may change as the project continues to improve.

---

## Supabase Database Tables

| Table                   | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| Users / Profiles        | Student account and profile data                     |
| MCQ Sets                | MCQ set metadata (title, subject, shuffle settings)  |
| MCQ Questions           | Questions, options, and correct answers per set      |
| MCQ Attempts            | Student attempt records with scores and timing       |
| Career Articles         | Article content, slugs, thumbnails, and publish date |
| Notes / Papers          | Academic resource metadata and links                 |
| Password Reset Tokens   | Account recovery token records                       |

---

## Getting Started

### Prerequisites

| Requirement         | Purpose                              |
| ------------------- | ------------------------------------ |
| Java 17+            | Run the Spring Boot backend          |
| Maven / Wrapper     | Build and execute the backend        |
| Git                 | Clone and manage the project         |
| Clerk Account       | Configure frontend authentication    |
| Supabase Account    | Configure the PostgreSQL database    |
| Cloudinary Account  | Configure media upload widget        |
| Vercel Account      | Deploy the frontend                  |
| Modern Browser      | Test and use the frontend            |

### 1. Clone the Repository

```bash
git clone https://github.com/jbmsacps-stack/Karthificial-Website.git
cd Karthificial-Website
```

### 2. Configure Frontend Environment

Set your service keys inside `client/config.js` or via environment variables:

```env
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

### 3. Configure Backend Environment Variables

```env
DB_URL=your_supabase_database_url
DB_USERNAME=your_supabase_database_username
DB_PASSWORD=your_supabase_database_password
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
RESEND_API_KEY=your_resend_api_key
```

### 4. Run the Backend Locally

```bash
cd server/backend
./mvnw spring-boot:run
```

For Windows PowerShell:

```powershell
cd server/backend
.\mvnw spring-boot:run
```

### 5. Run the Frontend Locally

```bash
cd client
npx serve
```

Or open `client/index.html` directly in a browser for a static preview.

---

## Deployment Process

### Frontend on Vercel

```txt
1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Set the root directory to client/ if required.
4. Add environment variables (Clerk key, Supabase URL/key, Cloudinary config).
5. Deploy. Vercel generates a public URL.
6. Vercel Speed Insights activates automatically on deployment.
```

### Backend on Replit

```txt
1. Import the backend project into Replit.
2. Configure environment variables in Replit Secrets.
3. Run the Spring Boot application using Maven.
4. Test the health API endpoint.
5. Copy the public Replit URL and connect it in config.js.
```

### Supabase Setup

```txt
1. Create a Supabase project.
2. Set up the required tables (MCQ sets, questions, attempts, articles, etc.).
3. Copy the project URL and anon key into the frontend config.
4. Add the PostgreSQL connection string to backend environment variables.
5. Supabase handles all real-time database operations directly from the frontend.
```

### Clerk Setup

```txt
1. Create a Clerk application.
2. Copy the publishable key into the frontend config.
3. Configure allowed redirect URLs to match your Vercel deployment.
4. Set admin role metadata on admin user accounts via the Clerk dashboard.
5. Clerk handles all signup, login, session, and logout flows.
```

### Cloudinary Setup

```txt
1. Create a Cloudinary account.
2. Note the cloud name.
3. Configure an unsigned upload preset for the admin upload widget.
4. Add the cloud name and preset to cloudinary-upload.js.
5. Admins can upload article thumbnails and media directly from the admin panel.
```

---

## Roadmap

* [ ] Add more MCQ subject sets
* [ ] Add student dashboard with personal performance history
* [ ] Add advanced MCQ analytics per student
* [ ] Add role-based access control improvements
* [ ] Add downloadable notes and papers
* [ ] Add more career guidance article modules
* [ ] Improve SEO and page performance
* [ ] Add better production monitoring
* [ ] Improve mobile responsiveness across all pages

---

## Team

This project was developed by a 3-developer team over 10 days of active development (8+ hours per day).

| Name              | Role                                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| Joshua Baskar PG  | Project Manager · Frontend Developer · Integration Coordinator · Deployment Lead · Debugging               |
| Hariharan S       | Backend Developer · Database Developer · Authentication · Analytics & SEO · Backend Debugging              |
| Sivaraj S         | UI/UX Designer · Frontend Contributor · Documentation Support · Visual Bug Testing                        |

---

## Author

**Joshua Baskar**  
BCA Student · Aspiring Full-Stack Developer

🔗 [GitHub](https://github.com/jbmsacps-stack)

---

## Copyright & Usage Terms

**Karthificial Website** · Copyright © 2026 Joshua Baskar and Team · All rights reserved.

### Permitted Uses

* Viewing and studying the source code for personal learning
* Referencing the project in non-commercial academic or portfolio work with attribution
* Private forking for personal experimentation
* Sharing links to this repository or live website with proper credit

### Restricted Uses

The following require explicit written permission from the project owners:

* Publicly publishing this project or any substantial portion of its code
* Monetizing this project in any form
* Redistributing modified or unmodified versions under a different name
* Claiming authorship or ownership of any part of this project
* Using the project for commercial or institutional deployment without permission

### Usage Summary

| Use Case                              | Status                  |
| ------------------------------------- | ----------------------- |
| Personal learning and study           | ✅ Permitted             |
| Private forking and experimentation   | ✅ Permitted             |
| Sharing with attribution              | ✅ Permitted             |
| Academic reference with credit        | ✅ Permitted             |
| Public publishing                     | ⚠️ Permission required  |
| Commercial or monetized use           | ⚠️ Permission required  |
| Redistribution under a different name | ❌ Not permitted         |
| Claiming ownership                    | ❌ Not permitted         |

Unauthorized use may be subject to applicable intellectual property and copyright law.

---

<div align="center">

*Last updated: May 2026 · Built by a 3-developer team · 10 days · 8+ hours/day*

⭐ If this project is useful, a star is appreciated.

</div>