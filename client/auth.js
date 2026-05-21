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

    return user.role === "admin";
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

function requireAdmin() {
    if (!getToken() || !isAdmin()) {
        window.location.href = "login.html";
    }
}

/* ================================
   NAVBAR AUTH UPDATE
================================ */

function updateNavbarAuth() {
    const token = getToken();
    const user = getUser();

    const desktopAuthArea = document.querySelector(".auth-actions");
    const mobileAuthArea = document.querySelector(".auth-mobile-actions");

    if (!desktopAuthArea && !mobileAuthArea) {
        return;
    }

    if (token && user) {
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

document.addEventListener("DOMContentLoaded", updateNavbarAuth);