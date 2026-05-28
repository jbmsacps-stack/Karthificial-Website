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

---

## About

Karthificial Website is a full-stack education platform created to help students access academic resources, practice MCQs, explore career guidance, and use personalized learning features through a clean and professional web experience.

The platform is built with a separate frontend and backend architecture. The frontend is developed using HTML, CSS, and JavaScript, while the backend is powered by Java Spring Boot. Supabase PostgreSQL is used as the database, Vercel is used for frontend deployment, Replit is used for backend deployment, and PostHog is used for analytics.

This project was developed by a team of 3 developers with focus on frontend design, backend development, database integration, deployment configuration, debugging, and product-level improvement.

Karthificial is not just a static education website. It is designed as a scalable academic ecosystem that can grow into a larger student support platform.

---

## Project Purpose

The main purpose of Karthificial is to create a centralized learning platform where students can access useful academic materials and guidance without confusion.

The platform focuses on:

- Making study resources easier to access
- Providing subject-based MCQ practice
- Supporting career decision-making after 10th and 12th
- Helping students understand academic paths clearly
- Building a secure student-focused platform with backend support
- Preparing the project for future dashboard and analytics-based improvements

---

## Features

### Academic Resources

- 10th standard notes
- 12th standard notes
- 10th standard question papers
- 12th standard question papers
- Subject-based resource pages
- Organized academic content structure

### MCQ Practice System

- Subject-wise MCQ pages
- Interactive question answering
- Score calculation
- Attempt submission support
- Backend-ready MCQ tracking
- Result and performance data structure

### Career Guidance

- After 10th guidance
- After 12th guidance
- Group selection guidance
- Degree selection guidance
- Common career mistakes
- Student mindset and future planning

### Authentication

- Signup page
- Login page
- Forgot password page
- Reset password page
- JWT-based backend authentication structure
- Password encryption support
- User validation flow

### User Profile System

- Student profile setup
- User profile syncing
- Backend user profile storage
- Profile update structure
- Prepared foundation for future student dashboards

### Analytics

- PostHog analytics integration
- User behavior tracking
- Page usage insights
- Product improvement support
- Better understanding of student engagement

---

## Spring Boot Backend

The backend of Karthificial is built using Java Spring Boot. It handles the server-side logic of the platform and provides REST APIs for authentication, MCQ handling, user profiles, password reset structure, and database communication.

Spring Boot was used because it provides a strong structure for building scalable backend applications with clean separation between controllers, services, models, repositories, and DTOs.

### Backend Responsibilities

The Spring Boot backend manages:

- User signup
- User login
- JWT token generation
- Password encryption
- User profile syncing
- MCQ submission handling
- MCQ attempt storage
- Password reset token structure
- Email service structure
- Database communication with Supabase PostgreSQL
- API communication with the frontend
- CORS configuration for frontend-backend connection

### Backend Architecture

```txt
Spring Boot Backend
│
├── Controllers
│   └── Receive and handle API requests from the frontend
│
├── Services
│   └── Contain business logic and processing rules
│
├── DTOs
│   └── Transfer request and response data safely
│
├── Models
│   └── Represent database entities and table structures
│
├── Repositories
│   └── Communicate with the Supabase PostgreSQL database
│
└── Configuration
    └── Manage CORS, environment variables, and backend settings
````

### Spring Boot Concepts Used

| Concept               | Usage in Project                                                  |
| --------------------- | ----------------------------------------------------------------- |
| REST Controllers      | API endpoints for auth, MCQ, and profile features                 |
| Service Layer         | Business logic for authentication, JWT, email, and password reset |
| Repository Layer      | Database access using Spring Data JPA                             |
| DTO Classes           | Clean request and response handling                               |
| JPA / Hibernate       | Mapping Java models to database tables                            |
| CORS Configuration    | Allows frontend and backend to communicate across deployments     |
| Environment Variables | Secure configuration for database, JWT, and API keys              |
| Maven                 | Dependency management and backend execution                       |
| JWT                   | Secure token-based authentication structure                       |

---

## Database: Supabase PostgreSQL

Supabase is used as the cloud database platform for Karthificial. The Spring Boot backend connects to Supabase PostgreSQL to store and manage structured application data.

Supabase was selected because it provides a reliable PostgreSQL database, cloud hosting, simple connection setup, and a development-friendly environment suitable for full-stack projects.

### Data Stored in Supabase

* Student user accounts
* Encrypted user credentials
* Student profile details
* MCQ attempt records
* MCQ score data
* Password reset tokens
* Authentication-related records

### Database Configuration

The backend is configured to connect with Supabase using environment variables.

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

This avoids hardcoding sensitive database credentials directly inside the code.

---

## Deployment Architecture

Karthificial uses a separated deployment architecture. The frontend and backend are deployed independently, which makes the project easier to maintain, debug, and scale.

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
PostHog tracks user behavior and page activity
```

---

## Frontend Deployment: Vercel

The frontend is deployed using Vercel. Since the frontend is built with HTML, CSS, and JavaScript, Vercel is used to serve the static client-side files with fast loading and simple GitHub-based deployment.

### Why Vercel Was Used

* Fast static website hosting
* Easy GitHub integration
* Automatic redeployment after code updates
* Clean production URL
* Simple frontend deployment workflow
* Suitable for HTML, CSS, and JavaScript projects

### Frontend Deployment Responsibilities

Vercel handles:

* Landing page hosting
* Notes pages
* Question paper pages
* MCQ pages
* Career guidance pages
* Login and signup pages
* Static assets
* CSS and JavaScript files
* Public frontend access

---

## Backend Deployment: Replit

The backend is deployed using Replit. The Spring Boot backend runs publicly on Replit so the frontend can communicate with the backend APIs.

Replit was used because it gives a simple development-friendly environment for running the Java Spring Boot server without needing complex VPS setup during the early stage.

### Why Replit Was Used

* Supports Java backend execution
* Allows public backend hosting
* Easier backend testing
* Environment variable support
* Useful for student and academic projects
* Faster debugging during development
* Simple deployment compared to manual server setup

### Backend Deployment Responsibilities

Replit handles:

* Running the Spring Boot server
* Serving backend REST APIs
* Connecting to Supabase
* Processing authentication requests
* Processing MCQ submissions
* Managing profile sync requests
* Handling backend environment variables

---

## Analytics: PostHog

PostHog is used for analytics in this project. It helps understand how users interact with the platform and supports better product decisions.

Analytics is important for an education platform because it shows which pages students use, which resources are visited more, and where improvements are needed.

### PostHog Helps Track

* Page visits
* User navigation flow
* Student engagement
* Popular sections
* MCQ page usage
* Career guidance interactions
* Resource page activity

This helps the project move from guesswork to data-based improvement.

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
│   │   ├── cg_thumb/
│   │   ├── contacts/
│   │   ├── images/
│   │   ├── slides/
│   │   └── thumbnail/
│   │
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

| Page                    | Purpose                         |
| ----------------------- | ------------------------------- |
| `index.html`            | Main landing page               |
| `career-guidance.html`  | Career guidance hub             |
| `after-10th.html`       | Guidance after 10th             |
| `after-12th.html`       | Guidance after 12th             |
| `group-selection.html`  | Group selection guidance        |
| `degree-selection.html` | Degree selection guidance       |
| `career-mistakes.html`  | Common career mistake awareness |
| `student-mindset.html`  | Student mindset and planning    |
| `mcq.html`              | MCQ selection page              |
| `notes-10th.html`       | 10th standard notes             |
| `notes-12th.html`       | 12th standard notes             |
| `papers-10th.html`      | 10th standard question papers   |
| `papers-12th.html`      | 12th standard question papers   |
| `login.html`            | Student login                   |
| `signup.html`           | Student signup                  |
| `forgot-password.html`  | Forgot password flow            |
| `reset-password.html`   | Password reset flow             |
| `profile-setup.html`    | Student profile setup           |
| `contact.html`          | Contact and social links        |

---

## Backend Modules

| Module                         | Responsibility                                  |
| ------------------------------ | ----------------------------------------------- |
| `AuthController`               | Handles authentication API routes               |
| `McqController`                | Handles MCQ submission and stats APIs           |
| `UserProfileController`        | Handles student profile sync APIs               |
| `AuthService`                  | Manages signup, login, and authentication logic |
| `JwtService`                   | Generates and manages JWT tokens                |
| `PasswordResetService`         | Handles password reset logic                    |
| `EmailService`                 | Supports email-related backend logic            |
| `ResendEmailService`           | Supports Resend-based email service structure   |
| `UserRepository`               | Manages user database operations                |
| `UserProfileRepository`        | Manages user profile database operations        |
| `McqAttemptRepository`         | Stores and retrieves MCQ attempt data           |
| `PasswordResetTokenRepository` | Manages password reset token data               |

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
1. User opens the website hosted on Vercel.

2. Frontend pages load using HTML, CSS, and JavaScript.

3. User interacts with login, signup, MCQ, or profile features.

4. Frontend sends API requests to the Replit-hosted Spring Boot backend.

5. Spring Boot receives the request through REST controllers.

6. Service classes process the business logic.

7. Repository classes communicate with Supabase PostgreSQL.

8. Backend sends a structured response back to the frontend.

9. Frontend updates the user interface.

10. PostHog tracks useful analytics events for product improvement.
```

---

## Development Effort

This project required work across multiple areas of full-stack development.

The 3-developer team worked on:

* UI and visual design
* Frontend page development
* Responsive layout fixes
* MCQ page logic
* Authentication flow
* Spring Boot backend setup
* REST API development
* DTO, model, repository, and service-layer structure
* Supabase database integration
* Vercel frontend deployment
* Replit backend deployment
* PostHog analytics integration
* CORS and API connection debugging
* Environment variable configuration
* Deployment testing
* GitHub project organization
* README and documentation preparation

This project reflects practical software development, real debugging experience, and teamwork across frontend, backend, database, analytics, and deployment.

---

## Getting Started

### Prerequisites

* Java 17 or later
* Maven or Maven Wrapper
* Git
* Supabase account
* Replit account
* Vercel account
* PostHog account
* Modern web browser

---

### 1. Clone the Repository

```bash
git clone https://github.com/jbmsacps-stack/Karthificial-Website.git
cd Karthificial-Website
```

---

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

---

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

---

### 4. Run the Frontend Locally

Open the `client` folder using a static server.

Example:

```bash
cd client
npx serve
```

Or open `client/index.html` directly in a browser for basic static preview.

---

## Deployment Process

### Frontend Deployment on Vercel

The frontend is deployed using Vercel.

Basic deployment flow:

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

The backend is deployed using Replit.

Basic deployment flow:

```txt
1. Import the backend project into Replit.

2. Make sure Java and Maven are available.

3. Configure backend environment variables in Replit Secrets.

4. Run the Spring Boot application using Maven.

5. Confirm that the health API works.

6. Copy the public Replit backend URL.

7. Connect the Vercel frontend to the Replit backend URL.
```

### Database Setup on Supabase

Supabase is used for the PostgreSQL database.

Basic database flow:

```txt
1. Create a Supabase project.

2. Get the PostgreSQL connection string.

3. Add database credentials to backend environment variables.

4. Configure Spring Boot datasource properties.

5. Run the backend.

6. Hibernate/JPA creates or updates the required tables based on models.

7. Backend starts storing user, profile, MCQ, and token data.
```

### Analytics Setup with PostHog

PostHog is used to monitor platform usage.

Basic analytics flow:

```txt
1. Create a PostHog project.

2. Add the PostHog script or integration to the frontend.

3. Configure the project API key.

4. Deploy the frontend.

5. Track user visits, navigation, and engagement.

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
| Frontend Development     | UI pages, responsive design, styling, JavaScript interactions                            |
| Backend Development      | Spring Boot APIs, authentication, MCQ logic, database connection                         |
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
```
