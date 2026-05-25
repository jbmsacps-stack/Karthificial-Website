/* ================================
   AUTH HELPER FUNCTIONS
================================ */

function getToken() {
    return localStorage.getItem("token");
}

function getUser() {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        return null;
    }
}

function isAdmin() {
    const user = getUser();

    if (!user) {
        return false;
    }

    return user.role === "ADMIN";
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
}

function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true" && getUser() !== null;
}

function requireAdmin() {
    if (!getToken() || !isAdmin()) {
        window.location.href = "index.html";
    }
}

/* ================================
   NAVBAR AUTH UPDATE
================================ */

function updateNavbarAuth() {
    const token = getToken();
    const user = getUser();

    const desktopAuthArea = document.querySelector(".nav-actions");
    const mobileAuthArea = document.querySelector(".mobile-actions");

    if (!desktopAuthArea && !mobileAuthArea) {
        return;
    }

    if (isLoggedIn() && user) {
        const userName = user.fullName || user.name || "Student";

        const loggedInHTML = `
            <span class="navbar-user">Hi, ${userName}</span>
            <button class="btn-outline logout-btn" onclick="logout()">Logout</button>
        `;

        if (desktopAuthArea) {
            desktopAuthArea.innerHTML = loggedInHTML;
        }

        if (mobileAuthArea) {
            mobileAuthArea.innerHTML = loggedInHTML;
        }
    } else {
        const loggedOutHTML = `
            <a href="login.html" class="btn-outline">Login</a>
            <a href="signup.html" class="btn-gold">Signup</a>
        `;

        if (desktopAuthArea) {
            desktopAuthArea.innerHTML = loggedOutHTML;
        }

        if (mobileAuthArea) {
            mobileAuthArea.innerHTML = loggedOutHTML;
        }
    }
}

/* ================================
   REDIRECT LOGGED-IN USERS FROM AUTH PAGES
================================ */

function redirectLoggedInUsersFromAuthPages() {
    const currentPage = window.location.pathname.split("/").pop();

    const authPages = [
        "login.html",
        "signup.html"
    ];

    if (authPages.includes(currentPage) && isLoggedIn()) {
        window.location.href = "index.html";
    }
}

document.addEventListener("DOMContentLoaded", updateNavbarAuth);
document.addEventListener("DOMContentLoaded", redirectLoggedInUsersFromAuthPages);