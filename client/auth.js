const API_BASE_URL = APP_CONFIG.API_AUTH_BASE_URL;
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

function getMessageBox() {
    return document.querySelector("#authMessage")
        || document.querySelector("#loginMessage")
        || document.querySelector("#signupMessage");
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

/* ================================
   SIGNUP FORM HANDLER
================================ */

const signupForm = document.querySelector("#signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const fullName = document.querySelector("#fullName")?.value.trim();
        const email = document.querySelector("#email")?.value.trim();
        const password = document.querySelector("#password")?.value.trim();
        const confirmPassword = document.querySelector("#confirmPassword")?.value.trim();
        const studentClass = document.querySelector("#studentClass")?.value;

        const messageBox = getMessageBox();
        const submitButton = signupForm.querySelector("button[type='submit']");

        if (password !== confirmPassword) {
            if (messageBox) {
                messageBox.textContent = "Passwords do not match.";
                messageBox.className = "form-message error-message";
            }
            return;
        }

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Creating Account...";
            }

            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                    studentClass
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (messageBox) {
                    if (response.status === 401) {
                        messageBox.textContent = "Invalid email or password.";
                    } else if (response.status === 400) {
                        messageBox.textContent = data.message || "Please check your login details.";
                    } else if (response.status >= 500) {
                        messageBox.textContent = "Server error. Please try again later.";
                    } else {
                        messageBox.textContent = data.message || "Login failed. Please try again.";
                    }

                    messageBox.className = "form-message error-message";
                }
                return;
            }

            if (messageBox) {
                messageBox.textContent = "Account created successfully. Please login.";
                messageBox.className = "form-message success-message";
            }

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } catch (error) {
            if (messageBox) {
                messageBox.textContent = "Cannot connect to backend. Please try again later.";
                messageBox.className = "form-message error-message";
            }
            console.error("Signup error:", error);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Sign Up";
            }
        }
    });
}

/* ================================
   LOGIN FORM HANDLER
================================ */

const loginForm = document.querySelector("#loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.querySelector("#email")?.value.trim();
        const password = document.querySelector("#password")?.value.trim();

        const messageBox = getMessageBox();
        const submitButton = loginForm.querySelector("button[type='submit']");

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Logging in...";
            }

            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (messageBox) {
                    messageBox.textContent = data.message || "Login failed.";
                    messageBox.className = "form-message error-message";
                }
                return;
            }

            localStorage.setItem("token", data.token || "");
            localStorage.setItem("user", JSON.stringify(data.user || data));
            localStorage.setItem("isLoggedIn", "true");

            updateNavbarAuth();

            if (messageBox) {
                messageBox.textContent = "Login successful.";
                messageBox.className = "form-message success-message";
            }

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } catch (error) {
            if (messageBox) {
                messageBox.textContent = "Cannot connect to backend. Please try again later.";
                messageBox.className = "form-message error-message";
            }
            console.error("Login error:", error);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Login";
            }
        }
    });
}
