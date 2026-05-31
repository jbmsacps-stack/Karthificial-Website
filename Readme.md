<div align="center">

<img src="client/assets/images/Logo.png" alt="Karthificial Logo" width="160" />

# Karthificial Website

**A premium academic platform for Tamil Nadu State Board students.**  
Study notes · Question papers · MCQ practice · Career guidance · Admin-managed content · Analytics · Authentication · Media uploads

<br>

<a href="https://karthificial-website.vercel.app/index.html" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/OPEN-KARTHIFICIAL-d4af37?style=for-the-badge&logo=googlechrome&logoColor=black" alt="Open Karthificial Live Website" />
</a>

<br><br>

<table>
  <tr>
    <td align="center">
      <a href="https://vercel.com/">
        <img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
      </a><br>
      <strong>Hosting</strong>
    </td>
    <td align="center">
      <a href="https://clerk.com/">
        <img src="https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" />
      </a><br>
      <strong>Authentication</strong>
    </td>
    <td align="center">
      <a href="https://supabase.com/">
        <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
      </a><br>
      <strong>Database</strong>
    </td>
    <td align="center">
      <a href="https://cloudinary.com/">
        <img src="https://img.shields.io/badge/Media-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
      </a><br>
      <strong>Media Uploads</strong>
    </td>
  </tr>
</table>

<br>

[![HTML5](https://img.shields.io/badge/HTML5-Structure-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Interface-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Logic-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Java](https://img.shields.io/badge/Java-Backend-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-API-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)

</div>

---

## About

**Karthificial** is an education-focused web platform built for **10th and 12th Tamil Nadu State Board students**. It brings together notes, question papers, MCQ practice, career guidance articles, authentication, admin controls, and analytics inside one structured platform.

The platform is designed so students can quickly access academic resources while admins can manage content from dedicated dashboard pages. MCQ sets, questions, articles, notes, papers, thumbnails, and performance records are handled through the admin-side workflow instead of being treated as static content only.

The project combines a responsive frontend, Clerk authentication, Supabase database integration, Cloudinary media uploads, Vercel deployment, and a Spring Boot backend prototype inside the repository.

---

## Platform Highlights

### Student Experience

- Access academic resources for 10th and 12th standard students.
- Browse notes and question-paper resources by standard and subject.
- Read career guidance content in a clean article-style layout.
- Attempt MCQ sets with scoring, timing, feedback, and performance insights.
- Use authentication-powered pages where login, signup, logout, and profile flows are handled consistently.
- View a responsive interface built for both desktop and mobile screens.

### Admin Experience

The admin section gives the project a content-management layer. It allows project maintainers to update platform content without repeatedly editing public-facing pages.

Admins can manage:

- MCQ sets and questions
- Career guidance articles
- Notes resources
- Question paper resources
- Media URLs and uploaded thumbnails
- MCQ performance analytics
- Student attempt records

---

## Detailed Feature Breakdown

### Clerk Authentication

Authentication is handled through **Clerk**, giving the project a cleaner login/signup system without manually building full authentication from scratch.

Key auth behavior:

- Clerk-powered login and signup pages
- User session handling across pages
- Navbar greeting after login
- Logout support
- Admin route protection
- Admin visibility based on authenticated access
- Reduced login/logout flash through cached navbar state logic

This creates one auth flow for both normal students and admin-controlled pages.

---

### Supabase Database Integration

Supabase is used as the hosted database layer for dynamic platform data.

The project uses Supabase for:

- MCQ sets
- MCQ questions
- MCQ attempts
- MCQ attempt answers
- Career guidance articles
- Notes records
- Question paper records
- Analytics reads and writes

This keeps the content live and expandable instead of locking everything inside fixed HTML.

---

### Cloudinary Media Uploads

Cloudinary is used for image uploads inside the admin workflow.

Admin media usage includes:

- MCQ set thumbnails
- Career article thumbnails
- Auto-filled image URL inputs after upload
- Cleaner media management without manually hosting images elsewhere

The Cloudinary upload widget makes the admin panel easier to use because images can be uploaded directly from the website interface.

---

### Career Guidance Article System

The career guidance section is built as a structured article system instead of only a set of plain static pages.

It includes:

- Career guidance landing/listing page
- Dynamic article cards
- Article title, category, excerpt, thumbnail, and date
- Slug-based single article page
- Rich text article body support
- YouTube embed support
- Related article suggestions
- Admin article creation workflow
- Career article thumbnail management through Cloudinary

This makes the career guidance section useful for students who are deciding between streams, degrees, and career paths after 10th or 12th standard.

---

### Question Papers and Notes

Karthificial includes admin-managed academic resources so students can access study material in one place.

Question paper features:

- Standard selection
- Subject selection
- Paper title
- PDF/resource URL
- Year field
- Public display through relevant 10th/12th paper pages

Notes features:

- 10th and 12th resource support
- Subject-based organization
- Admin-managed note entries
- Public notes pages for students

---

## MCQ System

The MCQ module is one of the most important parts of the project.

### MCQ Set Management

Admins can create and manage MCQ sets with:

- Title
- Subject
- Standard/class level
- Description
- Thumbnail
- Gradient/theme style
- Question count
- Shuffle question setting
- Shuffle answer option setting

### Question Management

Each MCQ question can include:

- Question text
- Four answer options
- Correct answer
- Difficulty level
- Active/hidden status
- Delete controls

### Student MCQ Attempt Flow

Students can:

- Select an MCQ set
- Answer questions
- Track total time
- Track per-question time
- Submit the attempt
- View result popup
- Receive score, rank, accuracy, and feedback

---

## Gamified Scoring Engine

The MCQ result system goes beyond simple correct/wrong calculation.

Scoring considers:

| Scoring Factor | Purpose |
| --- | --- |
| Correctness | Checks whether the selected answer is correct |
| Difficulty | Gives higher value to harder questions |
| Base Points | Assigns starting points based on difficulty |
| Difficulty Bonus | Rewards harder correct answers |
| Speed Bonus | Rewards faster correct answers |
| Final Percentage | Converts attempt performance into a readable result |
| Rank Title | Gives students a performance label after submission |

This makes MCQ practice feel more like a performance system than a basic quiz.

---

## Detailed Analytics System

Karthificial includes analytics for both **students** and **admins**. The goal is to make MCQ results useful for learning, not just for showing a score.

### Student-Facing Analytics

After submitting an MCQ set, students can see:

- Final score
- Rank title
- Accuracy percentage
- Total time taken
- Performance feedback
- Comparison with previous attempts
- Question-level struggle insight
- Weak areas based on wrong answers
- Result popup instead of plain inline output

This helps students understand whether they are improving and where they are losing marks.

### Admin-Facing Analytics

The admin MCQ dashboard includes deeper performance analysis.

Admins can inspect:

- All attempt records for an MCQ set
- Student name/email or available student identity
- Score per attempt
- Accuracy per attempt
- Time taken per attempt
- Rank achieved
- Average score
- Average accuracy
- Average time
- Total attempts
- Best score
- Individual student history across sets

### Per-Set Analytics

For each MCQ set, the admin can review:

- Number of attempts
- Average student performance
- Highest and lowest performance patterns
- Attempt-level timing
- Attempt-level accuracy
- Student-wise performance table

This helps identify whether a set is too easy, too hard, or needs better question balancing.

### Student Performance Analytics

The overall student performance view helps the admin compare users across multiple MCQ attempts.

It can show:

- Total attempts by a student
- Average score
- Best score
- Average accuracy
- Attempt history
- Set-wise performance behavior

This gives the admin a broader view of how students are using the MCQ system.

### Weak Question Analytics

The weak-question report helps identify questions that students commonly answer incorrectly.

It can show:

- Questions with the highest wrong-answer rate
- Number of students who answered incorrectly
- Correct answer reference
- Option-wise answer distribution
- How many students selected A, B, C, or D
- Correct option highlighting

This is useful for improving both question quality and teaching focus.

### Most Wrong Questions Report

The most-wrong report surfaces the questions that caused the most mistakes.

This helps admins:

- Rewrite confusing questions
- Add better explanations later
- Identify weak topics
- Improve future study material
- Understand student difficulty patterns

### Analytics Delete Control

The project also includes a safer analytics deletion concept.

The delete flow is intended to:

- Remove only MCQ performance records
- Keep MCQ sets safe
- Keep questions safe
- Keep student accounts safe
- Use confirmation before deleting analytics data
- Require stronger confirmation for sensitive delete actions

This prevents accidental deletion of actual learning content.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript |
| Authentication | Clerk |
| Database | Supabase PostgreSQL |
| Media Storage | Cloudinary |
| Rich Text Editor | Quill |
| Backend Prototype | Java, Spring Boot, Maven |
| API Style | REST API |
| ORM / Java Data Layer | Spring Data JPA, Hibernate |
| Performance Monitoring | Vercel Speed Insights |
| Frontend Hosting | Vercel |
| Backend Hosting / Prototype Testing | Replit |
| Version Control | Git, GitHub |
| Development Tools | VS Code, Browser DevTools |

---

## Architecture Overview

```txt
User
 │
 ▼
Frontend on Vercel
HTML / CSS / JavaScript
 │
 ├── Authentication: Clerk
 │     ├── Login
 │     ├── Signup
 │     ├── Session handling
 │     ├── Logout
 │     └── Admin protection
 │
 ├── Database: Supabase
 │     ├── MCQ sets
 │     ├── MCQ questions
 │     ├── MCQ attempts
 │     ├── Career articles
 │     ├── Notes
 │     ├── Question papers
 │     └── Analytics records
 │
 ├── Media: Cloudinary
 │     ├── MCQ thumbnails
 │     └── Career article thumbnails
 │
 ├── Performance: Vercel Speed Insights
 │
 └── Backend Prototype: Spring Boot / Replit
       ├── Auth-related API work
       ├── MCQ attempt handling experiments
       └── Server-side foundation work
```

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
│   ├── article.html
│   ├── after-12th.html
│   ├── student-mindset.html
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
│   │
│   ├── admin.html
│   ├── admin-mcq.html
│   ├── admin-career.html
│   ├── admin-notes.html
│   ├── admin-papers.html
│   │
│   ├── clerk-auth.js
│   ├── auth.js
│   ├── admin.js
│   ├── supabase-config.js
│   ├── cloudinary-upload.js
│   ├── config.js
│   ├── mcq-public.js
│   ├── mcq-set.js
│   ├── mcq-manager.js
│   ├── admin-mcq-manager.js
│   ├── admin-career.js
│   ├── admin-papers.js
│   ├── career-articles.js
│   ├── article.js
│   ├── static-related-articles.js
│   ├── papers.js
│   ├── script.js
│   ├── speed-insights.js
│   ├── speed-insights-lib.js
│   ├── variables.css
│   ├── structure.css
│   └── style.css
│
├── documentation/
│   ├── DAY-01.md
│   ├── DAY-02.md
│   ├── DAY_03.md
│   ├── DAY_04.md
│   ├── DAY_05.md
│   ├── DAY-06.md
│   ├── DAY_07.md
│   ├── DAY_08.md
│   ├── DAY_09.md
│   ├── DAY_10.md
│   ├── DAY_11.md
│   ├── DAY_12.md
│   └── DAY_13.md
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
│       ├── src/main/resources/application.properties
│       └── pom.xml
│
├── LICENSE
├── .gitignore
└── Readme.md
```

---

## Main Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Landing page with platform introduction and slider |
| `career-guidance.html` | Career guidance article listing |
| `article.html` | Single article view loaded by slug |
| `after-12th.html` | Guidance content for students after 12th |
| `student-mindset.html` | Student mindset and planning guide |
| `mcq.html` | MCQ set selection page |
| `mcq-set.html` | Active MCQ attempt page |
| `notes-10th.html` | 10th standard notes page |
| `notes-12th.html` | 12th standard notes page |
| `papers-10th.html` | 10th standard question papers |
| `papers-12th.html` | 12th standard question papers |
| `contact.html` | Contact and social links page |

---

## Admin Pages

| Page | Purpose |
| --- | --- |
| `admin.html` | Main admin dashboard |
| `admin-mcq.html` | MCQ set, question, and analytics management |
| `admin-career.html` | Career article creation and management |
| `admin-notes.html` | Notes resource management |
| `admin-papers.html` | Question paper management |

---

## Team Showcase

<table>
  <tr>
    <td align="center" width="33%">
      <a href="https://github.com/jbmsacps-stack">
        <img src="https://github.com/jbmsacps-stack.png" width="110" alt="Joshua Baskar GitHub Profile" />
      </a>
      <br>
      <strong>Joshua Baskar</strong>
      <br>
      <a href="https://github.com/jbmsacps-stack">@jbmsacps-stack</a>
      <br><br>
      Project lead, frontend integration, admin dashboard work, Supabase integration, Clerk authentication, MCQ logic, analytics, debugging, documentation, and deployment coordination.
    </td>
    <td align="center" width="33%">
      <a href="https://github.com/sivaraj0827">
        <img src="https://github.com/sivaraj0827.png" width="110" alt="Sivaraj GitHub Profile" />
      </a>
      <br>
      <strong>Sivaraj S</strong>
      <br>
      <a href="https://github.com/sivaraj0827">@sivaraj0827</a>
      <br><br>
      HTML/CSS contribution, UI styling, spacing fixes, color and gradient changes, page testing, error cleanup, responsive layout support, and page-building contribution including Career Guidance work.
    </td>
    <td align="center" width="33%">
      <a href="https://github.com/haran5983-ship-it">
        <img src="https://github.com/haran5983-ship-it.png" width="110" alt="Hari GitHub Profile" />
      </a>
      <br>
      <strong>Hariharan S</strong>
      <br>
      <a href="https://github.com/haran5983-ship-it">@haran5983-ship-it</a>
      <br><br>
      Backend research/support, admin question-paper page contribution, database/backend planning support, and project feature support.
    </td>
  </tr>
</table>

---

## Contribution Analysis

The project was developed through active GitHub commits and daily documentation. The commit history shows work across frontend development, styling, admin pages, authentication, analytics, Cloudinary, backend experimentation, and project documentation.

### Joshua Baskar

Main contribution areas:

- Project planning and direction
- Frontend page integration
- Admin dashboard development
- Clerk authentication integration
- Supabase connection and data flow
- MCQ set and question logic
- MCQ analytics and delete analytics feature
- Career guidance system improvements
- Cloudinary media upload integration
- Contact page and navbar fixes
- Backend prototype and Spring Boot re-entry work
- README and daily documentation updates
- Deployment and public repository presentation

### Sivaraj S

Main contribution areas:

- CSS styling improvements
- HTML/CSS page contribution
- Career Guidance page contribution and testing
- Admin question-paper spacing fixes
- Color and gradient changes
- CSS error cleanup
- UI testing and visual bug checking
- Responsive layout support
- Page-level polishing and consistency fixes

### Hariharan S

Main contribution areas:

- Admin question-paper page contribution
- Backend and database-side support
- Project feature support
- Admin workflow support
- Technical assistance during integration stages

---

## Development Documentation

The repository includes daily development logs inside the `documentation/` folder.

These logs record:

- Work completed each day
- Problems faced
- Fixes applied
- Concepts learned
- Project decisions
- UI and backend progress
- Admin dashboard improvements
- Career guidance improvements
- MCQ and analytics planning
- Deployment and repository preparation

---

## Current Status

Karthificial is an actively developed academic platform. The project already includes the major student-facing pages, admin-facing pages, authentication flow, Supabase integration, Cloudinary upload support, MCQ practice flow, analytics logic, and documentation structure.

The repository also contains backend prototype work, but the current public-facing platform mainly uses the frontend with hosted services such as Clerk, Supabase, Cloudinary, and Vercel.

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/jbmsacps-stack/Karthificial-Website.git
```

### 2. Move into the project folder

```bash
cd Karthificial-Website
```

### 3. Open the frontend

Open the `client/index.html` file directly in a browser, or use a local development server.

Example with VS Code Live Server:

```txt
Right click client/index.html → Open with Live Server
```

### 4. Configure required service keys

For full dynamic features, configure the required project credentials in the relevant frontend config files.

Required services:

- Clerk
- Supabase
- Cloudinary

Do not commit private keys, service-role keys, or sensitive credentials into the repository.

---

## Repository

- **Repository:** https://github.com/jbmsacps-stack/Karthificial-Website.git
- **Live Website:** https://karthificial-website.vercel.app/index.html
- **Main GitHub Profile:** https://github.com/jbmsacps-stack

---

## License

This project is licensed under the **MIT License**.

---

<div align="center">

**Karthificial — Learn. Think. Lead.**

</div>
