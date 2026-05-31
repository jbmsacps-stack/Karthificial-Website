# Day 11 - 29/05/26

## Work Done Today
- Continued major development work on the Karthificial project.
- Worked on backend planning and explored server-side implementation options for the platform.
- Created and tested backend health-check functionality to confirm that the backend server was running correctly.
- Connected the frontend deployment plan with the backend deployment plan.
- Confirmed that the Karthificial frontend would be deployed separately on Vercel.
- Planned backend deployment using Replit.
- Worked on environment variable setup including DEBUG, SECRET_KEY, JWT_SECRET, FRONTEND_URL, and ALLOWED_HOSTS.
- Reviewed frontend-to-backend communication using API links and fetch requests.
- Discussed how admin dashboard functionality should work without exposing backend links directly in the frontend.
- Continued working on Clerk authentication for login, signup, and admin access protection.
- Improved the admin dashboard planning for managing MCQs, career guidance content, question papers, and notes.
- Discussed Supabase usage for hosted database features.
- Worked on MCQ feature planning including result analysis, gamification, shuffle options, and performance tracking.
- Continued frontend fixes, admin page improvements, and project structure cleanup.

## Problems Faced
- There was confusion about how the frontend should communicate with the backend securely.
- Directly putting backend links inside frontend code did not feel clean or professional.
- Environment variables were confusing because different values were needed for local testing and deployment.
- Backend deployment required correct allowed hosts and frontend URL configuration.
- Admin dashboard functionality needed a clear structure before implementation.
- Clerk authentication and admin-only access needed proper role-based logic.
- Supabase integration required a better understanding of anon keys, project URLs, and database access.
- MCQ analysis features needed careful planning because they involved scoring, timing, result display, and future user tracking.

## How We Fixed It
- Separated frontend and backend deployment responsibilities clearly.
- Confirmed Vercel as the frontend deployment platform.
- Discussed Replit as the backend deployment platform.
- Identified the need to store deployment-specific values inside environment variables.
- Planned frontend API configuration using a centralized configuration method instead of scattering links everywhere.
- Continued using Clerk for authentication instead of creating a separate login system.
- Planned admin access using Clerk user metadata and role checking.
- Broke down the admin dashboard into separate management sections.
- Planned MCQ features in phases so the system could be improved step by step.
- Kept the project focused on free and practical tools wherever possible.

## What We Learned
- Frontend and backend should be separated clearly in a deployed full-stack project.
- Environment variables help protect sensitive values and make deployment cleaner.
- Authentication should not be rebuilt unnecessarily when a service like Clerk is already being used.
- Admin dashboards need both UI planning and secure access control.
- Database features should be planned carefully before connecting them to the frontend.
- Big features like MCQ analysis are easier to build when divided into smaller phases.