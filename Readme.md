<div align="center">

<img src="client/assets/images/Logo.png" alt="Karthificial Logo" width="160" />

# Karthificial Website

**A full-stack academic platform built for Tamil Nadu State Board students.**  
Dynamic MCQ practice with gamified scoring · Admin-managed content · Career guidance articles · Cloudinary media · Clerk authentication · Supabase database · Vercel deployment.

<br>

# 🌐 Live Project

<a href="https://karthificial-website.vercel.app/index.html" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/OPEN-KARTHIFICIAL-d4af37?style=for-the-badge&logo=googlechrome&logoColor=black" alt="Open Karthificial Live Website" />
</a>

<br><br>

<table>
  <tr>
    <td align="center">
      <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a><br><strong>Hosting</strong>
    </td>
    <td align="center">
      <a href="https://clerk.com/"><img src="https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" /></a><br><strong>Authentication</strong>
    </td>
    <td align="center">
      <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" /></a><br><strong>Database</strong>
    </td>
    <td align="center">
      <a href="https://cloudinary.com/"><img src="https://img.shields.io/badge/Media-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" /></a><br><strong>Media Storage</strong>
    </td>
  </tr>
</table>

---

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
`Clerk Auth` · `Supabase Client` · `Cloudinary Widget` · `REST API` · `JPA` · `Hibernate` · `CORS` · `Environment Config`

</div>

---

## About

**Karthificial** is a full-stack academic platform built for 10th and 12th Tamil Nadu State Board students. It gives students instant access to notes, question papers, subject-wise MCQ practice, and career guidance — all in one place, managed entirely by an admin through a live content dashboard.

Every piece of content on the platform — MCQ sets, career articles, notes links, question papers — is added and controlled by the admin in real time. There is no hardcoded content. The platform reads everything from Supabase and renders it dynamically, which means the admin can update, expand, or remove content without touching a single line of code.

Built by a 3-developer team over 10 days (8+ hours/day), the project covers frontend development, Spring Boot backend, Supabase database, Clerk authentication, Cloudinary media integration, Vercel deployment, and a full admin content management system.

---

## ✨ Platform Highlights

### 🛡️ Clerk Authentication — Smart, Role-Aware, Flash-Free

Authentication on Karthificial is handled entirely by **Clerk**, which brings production-grade auth without any custom token management.

- Students sign up and log in through Clerk-managed flows
- Once signed in, the navbar instantly shows the student's display name — pulled from their Clerk profile
- Navbar state is cached in local storage so the greeting appears on every page load without waiting for Clerk to initialise, eliminating the common login/logout flash problem
- **Admin role detection** is built into the same system — admins are identified through Clerk user metadata, and the navbar automatically shows admin navigation links only for verified admin accounts
- All admin pages check Clerk session on load; unauthenticated users are blocked before they see any admin content
- Logout works across all pages through consistent Clerk session termination

This means the same Clerk integration handles student-facing auth and admin access control from one clean system.

---

### 🎛️ Admin Dashboard — Full Content Control, No Code Required

The admin dashboard is a complete content management system built into the platform. Admins access it through a Clerk-protected route and manage every dynamic piece of content on the site from one place.

**The admin panel has five dedicated managers:**

#### 📝 MCQ Manager
The most powerful admin tool on the platform. Admins can:
- Create a new **MCQ Set** with a title, subject, class level (10th or 12th), gradient theme (Dark Gold, Royal Blue Gold, Crimson Gold, Emerald Gold, Violet Gold, Cyan Gold), optional Cloudinary-uploaded thumbnail, and description
- Toggle **Shuffle Questions** and **Shuffle Answer Options** per set — so each student gets a different question order and different option order, making repeated attempts genuinely useful
- Add questions to any set, each with four options (A/B/C/D), a marked correct answer, a difficulty level (Easy / Medium / Hard), and an Active/Hidden status toggle
- View all questions inside any set and delete individual questions
- Delete entire MCQ sets when no longer needed

#### 📰 Career Article Manager
Admins can publish fully structured career guidance articles for students using a Quill-powered rich text editor. Each article includes:
- **Title** and auto-generated URL slug (used for slug-based article routing)
- **Category / Tag** with suggestions: After 10th, After 12th, Group Selection, Mindset, Mistakes to Avoid, Science, Commerce, Arts, Career Planning
- **Thumbnail image** — uploaded directly from the admin panel via the Cloudinary Upload Widget (see below)
- **Short excerpt** shown on article listing cards
- **Full article body** written in the rich text editor with heading support, bold, lists, blockquotes, and links
- **Optional YouTube URL** — embeds a video inside the article page automatically
- **Published date** — auto-set to today, editable when needed

Articles are saved to Supabase and immediately appear on the live career guidance section for students.

#### 📄 Question Papers Manager
Admins add question papers for 10th and 12th standard by selecting the standard, picking the subject from a dynamic subject list, adding a title, pasting a PDF URL, and optionally entering the year. Papers are saved to Supabase and appear on the relevant papers page instantly.

#### 📚 Notes Manager
Admins manage notes resources for both standards through the notes admin panel, controlling what study material is visible to students without any code deployment.

#### 📊 MCQ Analytics Dashboard
The admin analytics section is the most detailed part of the dashboard (covered in depth in the Analytics section below).

---

### 🖼️ Cloudinary — One-Click Media Uploads Inside the Admin Panel

Every place in the admin panel where an image is needed uses the **Cloudinary Upload Widget**, triggered by a single button click — no external tools, no manual URL copying.

- **MCQ Set Thumbnail** — Admin clicks "Upload Image" on the Create MCQ Set form, selects or drags a file, and the Cloudinary URL is automatically inserted into the thumbnail field
- **Career Article Thumbnail** — Same flow on the Career Article Manager form; the uploaded image URL is filled automatically and used as the article card image across the platform

Cloudinary handles image storage, delivery optimisation, and URL generation. The admin never needs to manage an image host separately.

---

### 🧠 MCQ Practice — Gamified, Difficulty-Weighted, Insight-Driven

The MCQ system is built to give students a genuinely useful practice experience, not just a basic quiz.

**What students experience:**
- Browse MCQ sets by subject and class level, each displayed with a gradient theme card and question count
- Enter a set and answer questions — option order and question order can be shuffled per set (controlled by admin)
- Each question has a difficulty level (Easy / Medium / Hard) which affects point calculation
- A live timer tracks total time spent and per-question time

**Gamified Scoring Engine:**

Points are not simply right or wrong. Every answer is scored using:
- **Base points by difficulty** — harder questions are worth more
- **Difficulty bonus** on top of base points
- **Speed bonus** — answering correctly and quickly earns additional points; slow correct answers earn fewer bonus points
- Final score is converted to a **percentage** and matched to a **rank title** based on both percentage and total points earned

After submission, students see:
- Total score and rank title
- Accuracy percentage
- Total time taken
- Personalised feedback based on performance level
- **Performance comparison** — how this attempt compares to their previous attempts on the same set
- **Question struggle insight** — identification of questions the student got wrong that other students typically get right (pulled from aggregate attempt data)

This makes every result screen genuinely informative, not just a pass/fail.

---

### 📊 Analytics — Deep Insights for Admins, Meaningful Feedback for Students

#### Student-Facing Analytics
After every MCQ submission, the student result screen shows:
- Score, rank, accuracy, and time taken
- Comparison against their own previous attempts on that set
- Specific questions flagged as personal weak spots based on answer history

#### Admin-Facing Analytics
The MCQ admin panel includes a full analytics suite accessible per set and across all sets:

**Per-Set Analytics:**
- View all attempt records for a specific MCQ set
- See each student's score, accuracy, time taken, and rank
- Performance summary including average score, average accuracy, and average time

**Overall Student Performance:**
- Cross-set view of all students who have submitted attempts
- Drill into any individual student to see their full attempt history across all sets
- Stats per student: total attempts, average score, best score, average accuracy

**Weak Questions Report (Per Set):**
- Identifies which questions in a set have the highest wrong-answer rate
- Shows exactly how many students picked each wrong option
- Answer distribution row per option: how many students chose A, B, C, or D, with the correct answer highlighted

**Most Wrong Questions Report:**
- Surfaces the questions most commonly answered incorrectly across the entire set
- Helps the admin understand which topics need more coverage or clearer wording

This analytics system gives the admin everything needed to improve content quality based on real student behaviour.

---

### 📖 Career Guidance — Live Articles, Not Static Pages

Career guidance on Karthificial is not a set of hardcoded HTML pages. It is a **live article system** driven by Supabase.

- The career guidance section loads all published articles dynamically from Supabase and renders them as cards with title, thumbnail, category tag, and excerpt
- Clicking any card opens the full article on a dedicated article page, with the article loaded by its URL slug
- Each article page supports embedded YouTube videos, rich text formatting, and a **related articles section** that surfaces other articles from the same category
- Admins can publish new articles, edit existing ones, or remove outdated content at any time from the admin panel — and the change appears live on the site immediately

---

### 📑 Notes and Question Papers — Admin-Managed, Always Up to Date

Notes and question papers are not static links baked into HTML. They are stored in Supabase and rendered dynamically.

- Admins add notes and papers through the admin dashboard without editing any frontend code
- Notes are organised by standard (10th / 12th) and subject
- Question papers include standard, subject, title, PDF URL, and year — displayed as cards students can open or download
- The admin can add new exam papers as soon as they are available, keeping the platform current without a redeployment

---

## Tech Stack

| Layer              | Technology                          |
| ------------------ | ----------------------------------- |
| Frontend           | HTML5, CSS3, JavaScript             |
| Authentication     | Clerk                               |
| Database           | Supabase PostgreSQL                 |
| Media Storage      | Cloudinary                          |
| Rich Text Editor   | Quill                               |
| Backend            | Java, Spring Boot, Maven            |
| API Architecture   | REST API                            |
| ORM                | Spring Data JPA, Hibernate          |
| Performance        | Vercel Speed Insights               |
| Frontend Hosting   | Vercel                              |
| Backend Hosting    | Replit                              |
| Version Control    | Git, GitHub                         |
| Development Tools  | VS Code, Browser DevTools           |

---

## Architecture Overview

```txt
User
 │
 ▼
Frontend on Vercel
HTML / CSS / JavaScript
 │
 ├── Auth & Admin Access: Clerk
 │     └── Student login / signup / session / logout
 │     └── Admin role detection via Clerk metadata
 │     └── Admin route protection on every admin page
 │
 ├── Database: Supabase (direct frontend client)
 │     └── MCQ sets, questions, attempts
 │     └── Career articles, notes, papers
 │     └── Analytics data reads and writes
 │
 ├── Media: Cloudinary
 │     └── MCQ set thumbnails
 │     └── Career article thumbnails
 │
 └── API Requests
      ▼
   Backend on Replit
   Java Spring Boot REST API
      └── MCQ attempt handling
      └── Additional server-side logic

Performance: Vercel Speed Insights tracks frontend load metrics.
```

---

## Project Structure

```txt
Karthificial-Website/
│
├── client/
│   ├── assets/
│   │   ├── cg_thumb/           career guidance thumbnails
│   │   ├── contacts/           social icons
│   │   ├── images/             logo, favicon
│   │   ├── slides/             homepage slider images
│   │   └── thumbnail/          subject card thumbnails
│   │
│   ├── index.html              landing page
│   ├── career-guidance.html    career article listing
│   ├── article.html            dynamic single article page
│   ├── after-12th.html         after 12th guidance
│   ├── student-mindset.html    student mindset page
│   ├── mcq.html                MCQ set selection
│   ├── mcq-set.html            active MCQ practice session
│   ├── notes-10th.html         10th notes page
│   ├── notes-12th.html         12th notes page
│   ├── papers-10th.html        10th papers page
│   ├── papers-12th.html        12th papers page
│   ├── login.html              Clerk login
│   ├── signup.html             Clerk signup
│   ├── forgot-password.html    password recovery
│   ├── reset-password.html     password reset
│   ├── profile-setup.html      student profile
│   ├── contact.html            contact and socials
│   │
│   ├── admin.html              admin dashboard (Clerk-protected)
│   ├── admin-mcq.html          MCQ set and question manager
│   ├── admin-career.html       career article editor
│   ├── admin-notes.html        notes manager
│   ├── admin-papers.html       papers manager
│   │
│   ├── clerk-auth.js           Clerk integration, navbar auth state
│   ├── auth.js                 auth helpers, session logic
│   ├── admin.js                admin Clerk protection
│   ├── supabase-config.js      Supabase client initialisation
│   ├── cloudinary-upload.js    Cloudinary upload widget
│   ├── config.js               API and environment config
│   ├── mcq-public.js           MCQ set card loader
│   ├── mcq-set.js              MCQ session, scoring, analytics
│   ├── mcq-manager.js          MCQ CRUD frontend
│   ├── admin-mcq-manager.js    MCQ admin analytics and management
│   ├── admin-career.js         career article admin editor
│   ├── admin-papers.js         papers admin manager
│   ├── career-articles.js      public career article cards
│   ├── article.js              single article renderer
│   ├── static-related-articles.js  related article suggestions
│   ├── papers.js               question papers modal
│   ├── script.js               global scripts
│   ├── speed-insights.js       Vercel Speed Insights
│   ├── style.css
│   ├── structure.css
│   ├── variables.css
│   └── package.json
│
├── server/
│   └── backend/
│       ├── src/main/java/com/karthificial/backend/
│       │   ├── config/
│       │   ├── controller/     AuthController, McqController
│       │   ├── dto/
│       │   ├── model/
│       │   ├── repository/
│       │   ├── service/        AuthService, JwtService, EmailService
│       │   └── BackendApplication.java
│       ├── src/main/resources/application.properties
│       └── pom.xml
│
├── documentation/              10-day development log
├── LICENSE
├── .gitignore
└── README.md
```

---

## Main Pages

| Page                    | Purpose                                           |
| ----------------------- | ------------------------------------------------- |
| `index.html`            | Landing page with slider and platform overview    |
| `career-guidance.html`  | Dynamic career article listing from Supabase      |
| `article.html`          | Single article page loaded by URL slug            |
| `after-12th.html`       | Guidance content for after 12th standard          |
| `student-mindset.html`  | Student mindset and planning guide                |
| `mcq.html`              | MCQ set selection with gradient cards             |
| `mcq-set.html`          | Active MCQ practice with gamified scoring         |
| `notes-10th.html`       | 10th standard notes (Supabase-driven)             |
| `notes-12th.html`       | 12th standard notes (Supabase-driven)             |
| `papers-10th.html`      | 10th standard question papers (Supabase-driven)   |
| `papers-12th.html`      | 12th standard question papers (Supabase-driven)   |
| `login.html`            | Student login via Clerk                           |
| `signup.html`           | Student signup via Clerk                          |
| `forgot-password.html`  | Password recovery flow                            |
| `reset-password.html`   | Password reset flow                               |
| `profile-setup.html`    | Student profile setup                             |
| `contact.html`          | Contact and social links                          |
| `admin.html`            | Admin dashboard hub (Clerk-protected)             |
| `admin-mcq.html`        | MCQ set and question manager                      |
| `admin-career.html`     | Career article editor with Quill + Cloudinary     |
| `admin-notes.html`      | Notes content manager                             |
| `admin-papers.html`     | Question papers content manager                   |

---

## Backend Modules

| Module                         | Responsibility                           |
| ------------------------------ | ---------------------------------------- |
| `AuthController`               | Authentication API routes                |
| `McqController`                | MCQ submission and stats APIs            |
| `AuthService`                  | Signup, login, and authentication logic  |
| `JwtService`                   | JWT token generation                     |
| `PasswordResetService`         | Password reset logic                     |
| `EmailService`                 | Email-related backend logic              |
| `UserRepository`               | User database operations                 |
| `McqAttemptRepository`         | MCQ attempt data operations              |
| `PasswordResetTokenRepository` | Password reset token data operations     |

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

---

## Getting Started

### Prerequisites

| Requirement        | Purpose                              |
| ------------------ | ------------------------------------ |
| Java 17+           | Run the Spring Boot backend          |
| Maven / Wrapper    | Build and execute the backend        |
| Git                | Clone and manage the project         |
| Clerk Account      | Configure frontend authentication    |
| Supabase Account   | Configure the PostgreSQL database    |
| Cloudinary Account | Configure the media upload widget    |
| Vercel Account     | Deploy the frontend                  |
| Modern Browser     | Test and use the frontend            |

### 1. Clone the Repository

```bash
git clone https://github.com/jbmsacps-stack/Karthificial-Website.git
cd Karthificial-Website
```

### 2. Configure Frontend Services

Set your keys in `client/config.js` or as environment variables:

```env
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
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

Windows PowerShell:

```powershell
cd server/backend
.\mvnw spring-boot:run
```

### 5. Run the Frontend Locally

```bash
cd client
npx serve
```

Or open `client/index.html` directly in a browser.

---

## Deployment Process

### Frontend on Vercel

```txt
1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Set the root directory to client/ if prompted.
4. Add environment variables: Clerk key, Supabase URL/key, Cloudinary config.
5. Deploy. Vercel generates a public URL and activates Speed Insights automatically.
```

### Backend on Replit

```txt
1. Import the backend project into Replit.
2. Add all environment variables to Replit Secrets.
3. Run the Spring Boot application via Maven.
4. Test the /api/auth/health endpoint.
5. Copy the public Replit URL and add it to client/config.js.
```

### Supabase Setup

```txt
1. Create a Supabase project.
2. Set up tables: MCQ sets, questions, attempts, career articles, notes, papers.
3. Copy the project URL and anon key to the frontend config.
4. Add the PostgreSQL connection string to backend environment variables.
```

### Clerk Setup

```txt
1. Create a Clerk application.
2. Copy the publishable key to the frontend config.
3. Add your Vercel deployment URL to Clerk's allowed redirect origins.
4. Set admin role metadata on admin user accounts via the Clerk dashboard.
```

### Cloudinary Setup

```txt
1. Create a Cloudinary account.
2. Create an unsigned upload preset in your Cloudinary settings.
3. Add the cloud name and preset name to cloudinary-upload.js.
4. Admins can now upload thumbnails directly from the MCQ and career article admin panels.
```

---

## Roadmap

* [ ] Add more MCQ subject sets for all subjects
* [ ] Add student dashboard with personal attempt history
* [ ] Add advanced per-student MCQ performance tracking
* [ ] Add downloadable notes and papers
* [ ] Add more career guidance article modules
* [ ] Improve SEO and page load performance
* [ ] Improve mobile responsiveness across all pages
* [ ] Add better production monitoring

---

## Team

Developed by a 3-developer team · 10 days · 8+ hours per day.

| Name             | Role                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| Joshua Baskar PG | Project Manager · Frontend Developer · Integration Coordinator · Deployment Lead · Debugging       |
| Hariharan S      | Backend Developer · Database Developer · Authentication · Analytics & SEO · Backend Debugging      |
| Sivaraj S        | UI/UX Designer · Frontend Contributor · Documentation Support · Visual Bug Testing                 |

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
* Sharing links to this repository or the live website with proper credit

### Restricted Uses

The following require explicit written permission from the project owners:

* Publicly publishing this project or any substantial portion of its code
* Monetizing this project in any form
* Redistributing modified or unmodified versions under a different name
* Claiming authorship or ownership of any part of this project
* Using the project for commercial or institutional deployment without permission

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

---

<div align="center">

*Last updated: May 2026 · Built by a 3-developer team · 10 days · 8+ hours/day*

⭐ If this project helped you, a star is appreciated.

</div>