document.body.classList.add("auth-checking");

function getCachedUser() {
    try {
        return JSON.parse(localStorage.getItem("karthificialUser") || "null");
    } catch {
        return null;
    }
}

function getDisplayNameFromClerkUser(user) {
    return (
        user?.fullName ||
        user?.firstName ||
        user?.username ||
        user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
        "Student"
    );
}

function getSignedInHTML(displayName) {
    return `
        <span class="nav-user-greeting">Hi, ${displayName}</span>
        <button class="btn-outline nav-logout-btn" type="button">Logout</button>
    `;
}

function getSignedOutHTML() {
    return `
        <a href="login.html" class="btn-outline">Login</a>
        <a href="signup.html" class="btn-gold">Signup</a>
    `;
}

function attachLogoutHandler() {
    document.querySelectorAll(".nav-logout-btn").forEach((button) => {
        button.onclick = async () => {
            localStorage.removeItem("karthificialUser");

            if (window.Clerk) {
                await window.Clerk.signOut();
            }

            window.location.href = "index.html";
        };
    });
}

function renderCachedNavbarInstantly() {
    const cachedUser = getCachedUser();
    if (!cachedUser?.displayName) return;

    const navActions = document.querySelector(".nav-actions");
    const mobileActions = document.querySelector(".mobile-actions");

    const signedInHTML = getSignedInHTML(cachedUser.displayName);

    if (navActions) navActions.innerHTML = signedInHTML;
    if (mobileActions) mobileActions.innerHTML = signedInHTML;

    document.body.classList.remove("auth-checking");
    document.body.classList.add("auth-ready");

    attachLogoutHandler();
}

async function syncUserWithBackend() {
    const user = window.Clerk?.user;
    if (!user) return;

    const displayName = getDisplayNameFromClerkUser(user);
    const email = user.primaryEmailAddress?.emailAddress || "";

    localStorage.setItem("karthificialUser", JSON.stringify({
        clerkUserId: user.id,
        displayName,
        email
    }));

    try {
        const response = await fetch("https://karthificial-backend--jbmsacps.replit.app/api/user/sync", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clerkUserId: user.id,
                displayName,
                email
            })
        });

        if (!response.ok) {
            throw new Error("Backend user sync failed");
        }

        const savedUser = await response.json();

        localStorage.setItem("karthificialUser", JSON.stringify({
            clerkUserId: savedUser.clerkUserId || user.id,
            displayName: savedUser.displayName || displayName,
            email: savedUser.email || email
        }));
    } catch (error) {
        console.error("User profile sync failed:", error);
    }
}

function updateNavbarAuthState() {
    const navActions = document.querySelector(".nav-actions");
    const mobileActions = document.querySelector(".mobile-actions");

    if (!navActions && !mobileActions) return;

    const user = window.Clerk?.user;
    const cachedUser = getCachedUser();

    if (user || cachedUser?.displayName) {
        const displayName = cachedUser?.displayName || getDisplayNameFromClerkUser(user);
        const signedInHTML = getSignedInHTML(displayName);

        if (navActions) navActions.innerHTML = signedInHTML;
        if (mobileActions) mobileActions.innerHTML = signedInHTML;

        document.body.classList.remove("auth-checking");
        document.body.classList.add("auth-ready");

        attachLogoutHandler();
        return;
    }

    localStorage.removeItem("karthificialUser");

    const signedOutHTML = getSignedOutHTML();

    if (navActions) navActions.innerHTML = signedOutHTML;
    if (mobileActions) mobileActions.innerHTML = signedOutHTML;

    document.body.classList.remove("auth-checking");
    document.body.classList.add("auth-ready");
}

document.addEventListener("DOMContentLoaded", async () => {
    renderCachedNavbarInstantly();

    const signInBox = document.getElementById("clerk-sign-in");
    const signUpBox = document.getElementById("clerk-sign-up");
    const userButtonBox = document.getElementById("clerk-user-button");

    const clerkHost = CLERK_FRONTEND_API_URL
        .replace(/^https?:\/\//, "")
        .replace(/\/.*$/, "")
        .replace(/\$$/, "");

    function loadScript(src, attributes = {}) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.crossOrigin = "anonymous";
            script.async = false;

            Object.entries(attributes).forEach(([key, value]) => {
                script.setAttribute(key, value);
            });

            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load: ${src}`));

            document.head.appendChild(script);
        });
    }

    try {
        await loadScript(`https://${clerkHost}/npm/@clerk/ui@1/dist/ui.browser.js`);

        await window.Clerk.load({
            publishableKey: CLERK_PUBLISHABLE_KEY
        });

        await syncUserWithBackend();
        updateNavbarAuthState();

        const clerkAppearance = {
            variables: {
                colorPrimary: "#d4af37",
                colorBackground: "#080808",
                colorInputBackground: "#111111",
                colorInputText: "#ffffff",
                colorText: "#f5e8b8",
                colorTextSecondary: "#c9b875",
                colorDanger: "#ff4d4d",
                borderRadius: "14px"
            },
            elements: {
                card: {
                    backgroundColor: "#080808",
                    border: "1px solid rgba(212, 175, 55, 0.25)",
                    boxShadow: "0 0 35px rgba(212, 175, 55, 0.15)"
                },
                headerTitle: {
                    color: "#d4af37"
                },
                headerSubtitle: {
                    color: "#f5e8b8"
                },
                formButtonPrimary: {
                    backgroundColor: "#d4af37",
                    color: "#080808",
                    fontWeight: "800"
                },
                footerActionLink: {
                    color: "#d4af37"
                },
                socialButtonsBlockButton: {
                    backgroundColor: "#111111",
                    color: "#f5e8b8",
                    border: "1px solid rgba(212, 175, 55, 0.2)"
                },
                dividerText: {
                    color: "#c9b875"
                }
            }
        };

        if (signInBox) {
            window.Clerk.mountSignIn(signInBox, {
                appearance: clerkAppearance,
                signUpUrl: "signup.html",
                signInUrl: "login.html",
                fallbackRedirectUrl: "index.html"
            });
        }

        if (signUpBox) {
            window.Clerk.mountSignUp(signUpBox, {
                appearance: clerkAppearance,
                signInUrl: "login.html",
                signUpUrl: "signup.html",
                fallbackRedirectUrl: "index.html",
                forceRedirectUrl: "index.html"
            });
        }

        if (userButtonBox) {
            if (window.Clerk.user) {
                window.Clerk.mountUserButton(userButtonBox);
            } else {
                userButtonBox.innerHTML = getSignedOutHTML();
            }
        }

        document.body.classList.remove("auth-checking");
        document.body.classList.add("auth-ready");
    } catch (error) {
        console.error("Clerk failed to initialize:", error);
        updateNavbarAuthState();
    }
});