const CLERK_PUBLISHABLE_KEY = "pk_test_Zm9uZC1mbGVhLTM2LmNsZXJrLmFjY291bnRzLmRldiQ";
const CLERK_FRONTEND_API_URL = "fond-flea-36.clerk.accounts.dev";

const API_BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000"
        : "YOUR_REPLIT_BACKEND_URL";

window.CLERK_PUBLISHABLE_KEY = CLERK_PUBLISHABLE_KEY;
window.CLERK_FRONTEND_API_URL = CLERK_FRONTEND_API_URL;
window.API_BASE_URL = API_BASE_URL;