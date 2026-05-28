````md
# Karthificial Website

Karthificial Website is a premium education-focused digital platform built to support students with structured academic resources, interactive learning tools, career guidance, and secure user-based features.

This project was developed by a team of 3 developers with a strong focus on clean UI, practical student usability, backend integration, and scalable software architecture. The platform combines a modern frontend experience with a Spring Boot backend to create a professional learning ecosystem for students, educators, and academic institutions.

## Project Description

Karthificial is designed as a complete academic support platform where students can access notes, question papers, MCQ practice, career guidance, and personalized learning features from one centralized website.

The goal of this project is not just to display educational content, but to build a structured and reliable digital product that can grow into a larger student-support platform.

The website includes frontend pages for learning resources, career guidance, authentication, profile setup, MCQ practice, and contact features. The backend is developed using Java Spring Boot, with REST APIs, authentication logic, database models, repositories, DTOs, and service-layer architecture.

## What Makes This Project Valuable

This project demonstrates more than static website development. It includes:

- A complete multi-page educational platform
- Frontend and backend integration
- Student authentication flow
- MCQ submission and result tracking
- User profile syncing
- Password reset structure
- Database-ready backend architecture
- API-based communication between frontend and backend
- Professional academic branding
- Responsive UI design
- Scalable code organization

## Core Features

### Student Learning Platform

- 10th standard notes
- 12th standard notes
- 10th standard question papers
- 12th standard question papers
- Subject-based MCQ practice
- Career guidance pages
- Student mindset and future planning content
- Group and degree selection guidance

### MCQ Practice System

The MCQ module is designed to make learning more interactive. Students can attempt subject-based MCQs, submit answers, and track completion data.

Backend support includes:

- MCQ submission API
- Score storage
- Correct and wrong answer count handling
- Time taken tracking
- MCQ set-based statistics
- Completion count calculation

The backend uses a dedicated `McqController`, `McqAttempt` model, `McqSubmitRequest`, `McqSubmitResponse`, and `McqAttemptRepository` to manage MCQ data properly.

### Authentication System

The platform includes a student authentication flow with:

- Signup
- Login
- Password encryption
- JWT token generation
- User validation
- Duplicate email checking
- Secure login response handling

The backend uses Spring Boot service-layer logic through `AuthService`, `JwtService`, `AuthController`, DTO classes, and repository-based database operations.

### User Profile Sync

The user profile system supports syncing student data from the frontend to the backend.

It manages:

- Clerk user ID
- Display name
- Email
- Created time
- Updated time
- Existing user detection
- New user creation

This makes the platform more personalized and prepares it for future student dashboards and progress-based features.

### Password Reset Architecture

The project includes a password reset structure with backend services prepared for email-based recovery.

Current backend structure includes:

- Password reset service
- Password reset token model
- Password reset repository
- Email service layer
- Resend email service integration structure

This shows that the project is planned with real-world authentication recovery features in mind.

## Spring Boot Backend Highlights

The backend is built using Java Spring Boot with a layered architecture. This makes the codebase easier to maintain, test, and expand.

### Backend Architecture

```txt
server/backend/src/main/java/com/karthificial/backend/
│
├── config/
│   └── CorsConfig.java
│
├── controller/
│   ├── AuthController.java
│   ├── McqController.java
│   └── UserProfileController.java
│
├── dto/
│   ├── AuthResponse.java
│   ├── LoginRequest.java
│   ├── SignupRequest.java
│   ├── McqSubmitRequest.java
│   ├── McqSubmitResponse.java
│   └── UserProfileRequest.java
│
├── model/
│   ├── User.java
│   ├── UserProfile.java
│   ├── McqAttempt.java
│   └── PasswordResetToken.java
│
├── repository/
│   ├── UserRepository.java
│   ├── UserProfileRepository.java
│   ├── McqAttemptRepository.java
│   └── PasswordResetTokenRepository.java
│
├── service/
│   ├── AuthService.java
│   ├── JwtService.java
│   ├── EmailService.java
│   ├── PasswordResetService.java
│   └── ResendEmailService.java
│
└── BackendApplication.java
````

## Complex Backend Features

### REST API Development

The backend exposes structured REST APIs for authentication, MCQ submission, statistics, user profile syncing, and health checking.

This gives the project a professional client-server architecture instead of being only a static frontend website.

### JWT Authentication

The backend generates JWT tokens after successful login. This allows the platform to support secure session handling and future protected routes.

JWT implementation includes:

* Token generation
* User ID claim
* Full name claim
* Email-based subject
* Token issued time
* Token expiry time
* HMAC SHA signing

### Password Encryption

User passwords are not stored directly as plain text. The backend uses password encoding during signup and password matching during login.

This is an important security practice for real-world applications.

### DTO-Based Request and Response Handling

The backend uses DTO classes to separate frontend request data from database models.

This improves:

* Code clarity
* API structure
* Maintainability
* Security
* Validation handling

### Repository Layer

The project uses repository classes for database interaction.

This helps keep database logic separate from controller logic and service logic, making the backend cleaner and easier to scale.

### CORS Configuration

The backend includes CORS configuration to allow frontend-backend communication during deployment and development.

This is important because the frontend and backend may run on different domains or ports.

### Environment-Based Configuration

The backend is prepared to use environment variables for database URL, username, password, frontend URL, and API keys.

This makes the project more deployment-friendly and avoids hardcoding sensitive production values.

## Frontend Highlights

The frontend is built using HTML, CSS, and JavaScript with a premium dark-gold academic brand style.

### Frontend Features

* Premium landing page
* Career guidance section
* Notes pages
* Question paper pages
* MCQ pages
* Login and signup pages
* Forgot password and reset password pages
* Profile setup page
* Contact page
* Responsive layout
* Custom visuals and thumbnails
* Smooth user experience

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Java
* Spring Boot
* Maven
* Spring Web
* Spring Data JPA
* JWT Authentication
* REST API Architecture

### Database

* PostgreSQL-compatible database support
* JPA / Hibernate ORM

### Tools

* Git
* GitHub
* VS Code
* Maven Wrapper
* Vercel
* Replit

## Pages Included

| Page                    | Purpose                             |
| ----------------------- | ----------------------------------- |
| `index.html`            | Main landing page                   |
| `career-guidance.html`  | Career guidance hub                 |
| `after-10th.html`       | Guidance after 10th                 |
| `after-12th.html`       | Guidance after 12th                 |
| `group-selection.html`  | Group selection guidance            |
| `degree-selection.html` | Degree selection guidance           |
| `career-mistakes.html`  | Common career mistake awareness     |
| `student-mindset.html`  | Student mindset and future planning |
| `mcq.html`              | MCQ selection page                  |
| `notes-10th.html`       | 10th standard notes                 |
| `notes-12th.html`       | 12th standard notes                 |
| `papers-10th.html`      | 10th standard question papers       |
| `papers-12th.html`      | 12th standard question papers       |
| `login.html`            | Student login                       |
| `signup.html`           | Student signup                      |
| `profile-setup.html`    | Student profile setup               |
| `contact.html`          | Contact and social links            |

## Team Contribution

This project was developed by a team of 3 developers who worked together on planning, designing, coding, debugging, backend structuring, frontend development, and deployment preparation.

The team worked on:

* UI/UX design decisions
* Frontend page development
* Responsive layout fixes
* Authentication flow
* Spring Boot backend setup
* REST API development
* MCQ system logic
* Database model planning
* Debugging frontend-backend integration
* Deployment preparation
* Project documentation

The project reflects consistent development effort, real debugging experience, and practical software-building knowledge.

## Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/jbmsacps-stack/Karthificial-Website.git
cd Karthificial-Website
```

### Run the Backend

```bash
cd server/backend
./mvnw spring-boot:run
```

For Windows PowerShell:

```powershell
cd server/backend
.\mvnw spring-boot:run
```

### Run the Frontend

Open the `client` folder and serve it using any static server.

Example:

```bash
cd client
npx serve
```

## Environment Variables

The backend is designed to work with environment variables such as:

```env
DB_URL=your_database_url
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
RESEND_API_KEY=your_resend_api_key
```

## Future Scope

Planned improvements include:

* Student dashboard
* More MCQ sets
* Advanced result analytics
* Admin panel for content management
* Better student progress tracking
* More career guidance modules
* Full email-based password recovery
* Protected backend routes
* Production-ready deployment improvements

## Project Status

This project is actively being improved and prepared for real-world academic use cases.

## License

This project is licensed under the MIT License.

## Developed By

Built with dedication by a 3-developer team focused on creating a professional digital learning platform.

````

## GitHub About Description

Use this:

```txt
A professional education platform built by a 3-developer team using HTML, CSS, JavaScript, and Spring Boot, featuring notes, papers, MCQs, career guidance, authentication, user profiles, and backend APIs.
````

## Even More Client-Friendly Version

```txt
A full-stack academic platform built for students and institutions, featuring learning resources, MCQ practice, career guidance, authentication, user profiles, and a scalable Spring Boot backend.
```