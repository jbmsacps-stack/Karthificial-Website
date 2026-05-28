<div align="center">

<img src="client/assets/images/Logo.png" alt="Karthificial Logo" width="160" />

# Karthificial Website

**A full-stack academic platform built for smarter student learning.**  
Notes, question papers, MCQ practice, career guidance, authentication, database integration, and analytics — all in one structured education platform.

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
      <a href="https://replit.com/" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/badge/Backend-Replit-F26207?style=for-the-badge&logo=replit&logoColor=white" alt="Replit" />
      </a>
      <br>
      <strong>Runtime</strong>
    </td>
    <td align="center">
      <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
      </a>
      <br>
      <strong>Storage</strong>
    </td>
    <td align="center">
      <a href="https://posthog.com/" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/badge/Analytics-PostHog-F54E00?style=for-the-badge&logo=posthog&logoColor=white" alt="PostHog" />
      </a>
      <br>
      <strong>Insights</strong>
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

### Backend

[![Java](https://img.shields.io/badge/Java-Server-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-API-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Maven](https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)](https://maven.apache.org/)

### Architecture

`REST API` · `JPA` · `Hibernate` · `JWT` · `DTO` · `Repository` · `Service Layer` · `CORS` · `Environment Config`

</div>


</div>

---

## About

**Karthificial Website** is a full-stack academic platform designed to support students with structured academic resources, MCQ practice, career guidance, secure authentication, student profile management, and analytics-based improvement.

The platform follows a separated full-stack architecture. The frontend is built with **HTML, CSS, and JavaScript**, while the backend is powered by **Java Spring Boot**. It uses **Supabase PostgreSQL** for database storage, **Vercel** for frontend deployment, **Replit** for backend hosting, and **PostHog** for analytics.

Developed by a **3-developer team**, this project includes frontend development, backend architecture, database integration, deployment setup, debugging, analytics integration, and documentation.

Karthificial is designed as more than a static education website. It is a scalable academic platform prepared for future expansion into student dashboards, performance tracking, admin tools, and institution-level learning support.

---

## Project Purpose

Karthificial was created to provide students with a centralized digital learning platform where academic content, practice tools, and career guidance are available in one organized environment.

The platform focuses on:

- Making study resources easier to access
- Supporting subject-wise MCQ practice
- Helping students make informed academic and career decisions
- Building a secure student-focused system with backend support
- Creating a foundation for future dashboards, analytics, and admin tools

---

## Features

### Academic Resources

Karthificial provides structured academic resources for students.

- 10th standard notes
- 12th standard notes
- 10th standard question papers
- 12th standard question papers
- Subject-based resource pages
- Organized content navigation

### MCQ Practice System

The MCQ system is designed to make learning more active and measurable.

- Subject-wise MCQ pages
- Interactive question practice
- Score calculation
- Attempt submission support
- Backend-ready MCQ tracking
- Foundation for future performance analytics

### Career Guidance

The career guidance section helps students understand academic paths and avoid common decision-making mistakes.

- After 10th guidance
- After 12th guidance
- Group selection guidance
- Degree selection guidance
- Common career mistakes
- Student mindset and future planning

### Authentication

The authentication system provides the foundation for student accounts and secure access.

- Signup flow
- Login flow
- Forgot password structure
- Reset password structure
- JWT-based backend authentication
- Password encryption support
- User validation flow

### User Profile System

The profile system prepares the platform for personalized student experiences.

- Student profile setup
- Frontend-to-backend profile syncing
- Backend profile storage
- Foundation for future student dashboards

### Analytics

PostHog analytics helps improve the platform based on real user behavior.

- Page visit tracking
- Navigation insights
- Student engagement analysis
- MCQ usage insights
- Career guidance usage tracking
- Data-based product improvement

---

## Spring Boot Backend

The backend of Karthificial is developed using **Java Spring Boot**. It provides the server-side foundation for authentication, MCQ handling, user profile syncing, password reset structure, and database communication.

Spring Boot was selected because it supports clean backend architecture through controllers, services, DTOs, models, repositories, and configuration layers. This structure improves maintainability, scalability, and long-term project quality.

### Backend Responsibilities

The backend handles:

- User signup and login
- JWT token generation
- Password encryption and validation
- Student profile syncing
- MCQ submission handling
- MCQ attempt storage
- Password reset token structure
- Email service structure
- Supabase PostgreSQL database communication
- Frontend-backend API communication
- CORS configuration
- Environment-based configuration

### Backend Architecture

```txt
Spring Boot Backend
│
├── Controllers
│   └── Receive frontend API requests
│
├── Services
│   └── Process business logic
│
├── DTOs
│   └── Handle request and response data
│
├── Models
│   └── Represent database entities
│
├── Repositories
│   └── Communicate with Supabase PostgreSQL
│
└── Configuration
    └── Manage CORS and environment settings
````

### Spring Boot Concepts Used

| Concept               | Usage                                                       |
| --------------------- | ----------------------------------------------------------- |
| REST Controllers      | API endpoints for authentication, MCQ, and profile features |
| Service Layer         | Separates business logic from controllers                   |
| Repository Layer      | Handles database operations through Spring Data JPA         |
| DTO Pattern           | Manages request and response data cleanly                   |
| JPA / Hibernate       | Maps Java models to database tables                         |
| CORS Configuration    | Enables frontend-backend communication                      |
| Environment Variables | Protects database credentials and secrets                   |
| Maven                 | Handles dependency management and backend execution         |
| JWT                   | Supports token-based authentication                         |

---

## Database: Supabase PostgreSQL

Karthificial uses **Supabase PostgreSQL** as its cloud database. The Spring Boot backend connects to Supabase to store and manage structured application data.

Supabase was selected because it provides a reliable PostgreSQL database, cloud accessibility, simple connection management, and a development-friendly setup for full-stack applications.

### Data Stored in Supabase

| Data Type              | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| User Accounts          | Stores registered student account data        |
| Encrypted Credentials  | Supports secure login verification            |
| Student Profiles       | Stores profile-related information            |
| MCQ Attempts           | Records student MCQ activity                  |
| MCQ Scores             | Supports performance tracking                 |
| Password Reset Tokens  | Supports account recovery flow                |
| Authentication Records | Maintains backend authentication-related data |

### Database Configuration

The backend connects to Supabase using environment variables.

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

This prevents sensitive database credentials from being hardcoded directly inside the source code.

---

## Deployment Architecture

Karthificial follows a separated deployment model where each layer is deployed and managed independently.

```txt
User
 │
 ▼
Frontend on Vercel
HTML / CSS / JavaScript
 │
 │ API Requests
 ▼
Backend on Replit
Java Spring Boot REST API
 │
 │ Database Queries
 ▼
Supabase PostgreSQL
 │
 ▼
Stored Users, Profiles, MCQ Attempts, Tokens

Analytics Layer:
PostHog tracks user activity and product usage.
```

This architecture improves maintainability, debugging, deployment flexibility, and future scalability.

---

## Frontend Deployment: Vercel

The frontend is deployed on **Vercel**, which hosts the client-side HTML, CSS, JavaScript, images, and static assets.

### Why Vercel Was Used

* Static hosting for HTML, CSS, and JavaScript files
* GitHub-based deployment workflow
* Fast frontend delivery
* Preview deployments for testing
* Simple production deployment process

### Vercel Handles

* Landing page hosting
* Notes and question paper pages
* MCQ pages
* Career guidance pages
* Login and signup pages
* Static assets
* CSS and JavaScript delivery
* Public frontend access

---

## Backend Deployment: Replit

The backend is deployed on **Replit**, where the Spring Boot server runs publicly and handles API communication from the frontend.

### Why Replit Was Used

* Java backend execution
* Public backend URL
* Environment variable support
* Easier debugging during active development
* Student-friendly backend hosting setup

### Replit Handles

* Spring Boot server execution
* REST API hosting
* Supabase database connection
* Authentication requests
* MCQ submissions
* Profile sync requests
* Backend environment configuration

---

## Analytics: PostHog

**PostHog** is used to understand how users interact with the platform. It helps the team make better improvement decisions based on actual usage behavior.

### PostHog Helps Track

* Page visits
* Navigation flow
* Student engagement
* MCQ usage
* Career guidance usage
* Product improvement insights

This makes the platform more professional because future improvements can be guided by analytics instead of assumptions.

---

## Tech Stack

| Layer             | Technology                 |
| ----------------- | -------------------------- |
| Frontend          | HTML5, CSS3, JavaScript    |
| Backend           | Java, Spring Boot, Maven   |
| API Architecture  | REST API                   |
| Database          | Supabase PostgreSQL        |
| ORM               | Spring Data JPA, Hibernate |
| Authentication    | JWT, Password Encryption   |
| Analytics         | PostHog                    |
| Frontend Hosting  | Vercel                     |
| Backend Hosting   | Replit                     |
| Version Control   | Git, GitHub                |
| Development Tools | VS Code, Browser DevTools  |

---

## Project Structure

```txt
Karthificial-Website/
│
├── client/
│   ├── assets/
│   ├── index.html
│   ├── career-guidance.html
│   ├── after-10th.html
│   ├── after-12th.html
│   ├── group-selection.html
│   ├── degree-selection.html
│   ├── career-mistakes.html
│   ├── student-mindset.html
│   ├── mcq.html
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
│   ├── script.js
│   └── style.css
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
│       │
│       ├── src/main/resources/
│       │   └── application.properties
│       │
│       ├── pom.xml
│       ├── mvnw
│       └── mvnw.cmd
│
├── documentation/
├── LICENSE
├── .gitignore
└── README.md
```

---

## Main Pages

| Page                    | Purpose                       |
| ----------------------- | ----------------------------- |
| `index.html`            | Main landing page             |
| `career-guidance.html`  | Career guidance hub           |
| `after-10th.html`       | Guidance after 10th           |
| `after-12th.html`       | Guidance after 12th           |
| `group-selection.html`  | Group selection guidance      |
| `degree-selection.html` | Degree selection guidance     |
| `career-mistakes.html`  | Career mistake awareness      |
| `student-mindset.html`  | Student mindset and planning  |
| `mcq.html`              | MCQ selection page            |
| `notes-10th.html`       | 10th standard notes           |
| `notes-12th.html`       | 12th standard notes           |
| `papers-10th.html`      | 10th standard question papers |
| `papers-12th.html`      | 12th standard question papers |
| `login.html`            | Student login                 |
| `signup.html`           | Student signup                |
| `forgot-password.html`  | Forgot password flow          |
| `reset-password.html`   | Password reset flow           |
| `profile-setup.html`    | Student profile setup         |
| `contact.html`          | Contact and social links      |

---

## Backend Modules

| Module                         | Responsibility                          |
| ------------------------------ | --------------------------------------- |
| `AuthController`               | Authentication API routes               |
| `McqController`                | MCQ submission and stats APIs           |
| `UserProfileController`        | Student profile sync APIs               |
| `AuthService`                  | Signup, login, and authentication logic |
| `JwtService`                   | JWT token generation                    |
| `PasswordResetService`         | Password reset logic                    |
| `EmailService`                 | Email-related backend logic             |
| `ResendEmailService`           | Resend-based email service structure    |
| `UserRepository`               | User database operations                |
| `UserProfileRepository`        | User profile database operations        |
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

### User Profile APIs

| Method | Endpoint            | Description                             |
| ------ | ------------------- | --------------------------------------- |
| `POST` | `/api/user/sync`    | Sync frontend user profile with backend |
| `GET`  | `/api/user/profile` | Fetch saved user profile data           |

> API routes may change as the project continues to improve.

---

## Production Workflow

```txt
1. User opens the frontend hosted on Vercel.
2. The frontend loads static pages, assets, styles, and scripts.
3. The user interacts with login, signup, MCQ, profile, or content pages.
4. JavaScript sends API requests to the Replit-hosted Spring Boot backend.
5. Spring Boot receives requests through REST controllers.
6. Service classes process the required business logic.
7. Repository classes communicate with Supabase PostgreSQL.
8. The backend sends structured responses to the frontend.
9. The frontend updates the interface based on the response.
10. PostHog records product analytics for future improvement.
```

---

## Development Effort

This project required work across multiple areas of full-stack development.

The 3-developer team contributed to:

| Area          | Work Completed                                                    |
| ------------- | ----------------------------------------------------------------- |
| Frontend      | UI pages, responsive layouts, styling, JavaScript logic           |
| Backend       | Spring Boot APIs, authentication, MCQ logic, service architecture |
| Database      | Supabase PostgreSQL connection and data modeling                  |
| Deployment    | Vercel frontend deployment and Replit backend hosting             |
| Analytics     | PostHog setup for product usage insights                          |
| Debugging     | CORS, environment variables, API communication, deployment errors |
| Documentation | README structure, project explanation, and usage guidance         |

This project reflects practical software engineering experience, teamwork, debugging discipline, and full-stack implementation from frontend to deployment.

---

## Getting Started

### Prerequisites

| Requirement           | Purpose                           |
| --------------------- | --------------------------------- |
| Java 17+              | Run the Spring Boot backend       |
| Maven / Maven Wrapper | Build and execute the backend     |
| Git                   | Clone and manage the project      |
| Supabase Account      | Configure the PostgreSQL database |
| Replit Account        | Run the backend deployment        |
| Vercel Account        | Deploy the frontend               |
| PostHog Account       | Enable product analytics          |
| Modern Browser        | Test and use the frontend         |

### 1. Clone the Repository

```bash
git clone https://github.com/jbmsacps-stack/Karthificial-Website.git
cd Karthificial-Website
```

### 2. Configure Backend Environment Variables

Create or configure the required environment variables for the backend.

```env
DB_URL=your_supabase_database_url
DB_USERNAME=your_supabase_database_username
DB_PASSWORD=your_supabase_database_password
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
RESEND_API_KEY=your_resend_api_key
```

### 3. Run the Backend Locally

```bash
cd server/backend
./mvnw spring-boot:run
```

For Windows PowerShell:

```powershell
cd server/backend
.\mvnw spring-boot:run
```

### 4. Run the Frontend Locally

Open the `client` folder using a static server.

```bash
cd client
npx serve
```

Or open `client/index.html` directly in a browser for a basic static preview.

---

## Deployment Process

### Frontend Deployment on Vercel

```txt
1. Push frontend code to GitHub.
2. Import the GitHub repository into Vercel.
3. Select the frontend/client directory if required.
4. Configure frontend environment variables if needed.
5. Deploy the project.
6. Vercel generates a public frontend URL.
7. Update frontend API configuration to point to the Replit backend URL.
```

### Backend Deployment on Replit

```txt
1. Import the backend project into Replit.
2. Confirm Java and Maven support.
3. Configure backend environment variables in Replit Secrets.
4. Run the Spring Boot application using Maven.
5. Test the health API.
6. Copy the public Replit backend URL.
7. Connect the Vercel frontend to the Replit backend URL.
```

### Database Setup on Supabase

```txt
1. Create a Supabase project.
2. Get the PostgreSQL connection string.
3. Add database credentials to backend environment variables.
4. Configure Spring Boot datasource properties.
5. Run the backend.
6. Hibernate/JPA creates or updates tables based on models.
7. Backend starts storing user, profile, MCQ, and token data.
```

### Analytics Setup with PostHog

```txt
1. Create a PostHog project.
2. Add the PostHog script or integration to the frontend.
3. Configure the project API key.
4. Deploy the frontend.
5. Track visits, navigation, and engagement.
6. Use analytics insights to improve the platform.
```

---

## Roadmap

* [ ] Add more MCQ sets
* [ ] Add admin dashboard
* [ ] Add student dashboard
* [ ] Add advanced MCQ analytics
* [ ] Add role-based access control
* [ ] Add content management system
* [ ] Improve password reset email flow
* [ ] Add protected frontend routes
* [ ] Improve backend security configuration
* [ ] Add better production monitoring
* [ ] Add more career guidance modules
* [ ] Add downloadable notes and papers
* [ ] Improve SEO and page performance
* [ ] Add more analytics events through PostHog

---

## Team

This project was developed by a 3-developer team.

| Role                     | Contribution                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| Frontend Development     | UI pages, responsive design, styling, JavaScript logic                                   |
| Backend Development      | Spring Boot APIs, authentication, MCQ handling, database connection                      |
| Deployment & Integration | Vercel frontend deployment, Replit backend deployment, Supabase setup, PostHog analytics |

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

Commercial use, institutional deployment, and licensing arrangements may be discussed with the project owners.

### Usage Summary

| Use Case                              | Status                 |
| ------------------------------------- | ---------------------- |
| Personal learning and study           | ✅ Permitted            |
| Private forking and experimentation   | ✅ Permitted            |
| Sharing with attribution              | ✅ Permitted            |
| Academic reference with credit        | ✅ Permitted            |
| Public publishing                     | ⚠️ Permission required |
| Commercial or monetized use           | ⚠️ Permission required |
| Redistribution under a different name | ❌ Not permitted        |
| Claiming ownership                    | ❌ Not permitted        |

Unauthorized use may be subject to applicable intellectual property and copyright law.

---

<div align="center">

*Last updated: May 2026 · Built by a 3-developer team*

⭐ If this project is useful, a star is appreciated.

</div>
