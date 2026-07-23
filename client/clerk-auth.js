document.body.classList.add("auth-checking");

if (localStorage.getItem("karthificialGreetingAnimated") === "true") {
    document.body.classList.add("auth-greeting-seen");
}

function isClerkAdmin(user) {
    return user?.publicMetadata?.role === "admin";
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

function getSignedInNavbarHTML(displayName, isAdminUser = false, showGreeting = true) {
    const adminLinkHTML = isAdminUser
        ? `<a href="admin.html" class="btn-outline admin-nav-link">Admin</a>`
        : "";

    const greetingHTML = showGreeting
        ? `<span class="nav-user-greeting">Hi, ${displayName}</span>`
        : "";

    return `
        ${adminLinkHTML}
        ${greetingHTML}
        <button class="btn-outline nav-logout-btn" type="button">Logout</button>
    `;
}

function isMobileNavbarView() {
    return window.matchMedia("(max-width: 900px)").matches;
}

function getSignedOutNavbarHTML() {
    return `
        <a href="login.html" class="btn-outline">Login</a>
        <a href="signup.html" class="btn-gold">Signup</a>
    `;
}

function bindLogoutButtons() {
    document.querySelectorAll(".nav-logout-btn").forEach((button) => {
        button.onclick = async () => {
            localStorage.removeItem("karthificialUser");
            localStorage.removeItem("karthificialGreetingAnimated");

            if (window.Clerk) {
                await window.Clerk.signOut();
            }

            window.location.href = "index.html";
        };
    });
}

function renderNavbarHTML(desktopHTML, mobileHTML = desktopHTML) {
    const navActions = document.querySelector(".nav-actions");
    const mobileActions = document.querySelector(".mobile-actions");
    const isMobile = isMobileNavbarView();

    if (navActions) {
        navActions.innerHTML = isMobile ? "" : desktopHTML;
    }

    if (mobileActions) {
        mobileActions.innerHTML = isMobile ? mobileHTML : "";
    }

    bindLogoutButtons();
}

function renderSignedInNavbar(displayName, isAdminUser) {
    const isMobile = isMobileNavbarView();
    const showTopGreeting = !isMobile;

    const topNavbarHTML = getSignedInNavbarHTML(
        displayName,
        isAdminUser,
        showTopGreeting
    );

    const mobileMenuHTML = `<div class="mobile-auth-actions">${getSignedInNavbarHTML(
        displayName,
        isAdminUser,
        false
    )}</div>`;

    renderNavbarHTML(topNavbarHTML, mobileMenuHTML);
}

function renderSignedOutNavbar() {
    const isMobile = isMobileNavbarView();
    const desktopHTML = getSignedOutNavbarHTML();
    const mobileHTML = `<div class="mobile-auth-actions">${desktopHTML}</div>`;

    renderNavbarHTML(desktopHTML, mobileHTML);
}

function renderCachedNavbarInstantly() {
    try {
        const cachedUser = JSON.parse(localStorage.getItem("karthificialUser") || "null");

        if (!cachedUser?.displayName) {
            renderSignedOutNavbar();
            return;
        }

        renderSignedInNavbar(
            cachedUser.displayName,
            cachedUser.role === "admin"
        );

        document.body.classList.add("auth-greeting-seen");

    } catch (error) {
        localStorage.removeItem("karthificialUser");
        renderSignedOutNavbar();
    }
}

function updateNavbarAuthState() {
    const user = window.Clerk?.user;

    if (!user) {
        localStorage.removeItem("karthificialUser");
        localStorage.removeItem("karthificialGreetingAnimated");
        renderSignedOutNavbar();
        return;
    }

    const displayName = getDisplayNameFromClerkUser(user);
    const isAdminUser = isClerkAdmin(user);

    localStorage.setItem("karthificialUser", JSON.stringify({
        clerkUserId: user.id,
        displayName: displayName,
        email: user.primaryEmailAddress?.emailAddress || "",
        role: isAdminUser ? "admin" : "student"
    }));

    renderSignedInNavbar(displayName, isAdminUser);

    if (localStorage.getItem("karthificialGreetingAnimated") !== "true") {
        setTimeout(() => {
            localStorage.setItem("karthificialGreetingAnimated", "true");
            document.body.classList.add("auth-greeting-seen");
        }, 700);
    } else {
        document.body.classList.add("auth-greeting-seen");
    }
}

let authLayoutSyncScheduled = false;

function scheduleAuthLayoutSync() {
    if (authLayoutSyncScheduled) {
        return;
    }

    authLayoutSyncScheduled = true;

    requestAnimationFrame(() => {
        authLayoutSyncScheduled = false;
        renderCachedNavbarInstantly();
    });
}

const authLayoutObserver = new MutationObserver(() => {
    scheduleAuthLayoutSync();
});

function loadScript(src, attributes = {}) {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);

        if (existingScript) {
            resolve();
            return;
        }

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

document.addEventListener("DOMContentLoaded", async () => {
    authLayoutObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    renderCachedNavbarInstantly();

    const signInBox = document.getElementById("clerk-sign-in");
    const signUpBox = document.getElementById("clerk-sign-up");
    const userButtonBox = document.getElementById("clerk-user-button");

    try {
        if (typeof CLERK_FRONTEND_API_URL === "undefined" || typeof CLERK_PUBLISHABLE_KEY === "undefined") {
            throw new Error("Missing Clerk config values in config.js");
        }

        const clerkHost = CLERK_FRONTEND_API_URL
            .replace(/^https?:\/\//, "")
            .replace(/\/.*$/, "")
            .replace(/\$$/, "");

        await loadScript(
            `https://${clerkHost}/npm/@clerk/ui@1/dist/ui.browser.js`
        );

        await loadScript(
            `https://${clerkHost}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`,
            {
                "data-clerk-publishable-key": CLERK_PUBLISHABLE_KEY
            }
        );

        if (!window.Clerk) {
            throw new Error("ClerkJS loaded, but window.Clerk is missing");
        }

        await window.Clerk.load({
            ui: {
                ClerkUI: window.__internal_ClerkUICtor
            },
            localization: {
                signIn: {
                    start: {
                        title: "Login",
                        subtitle: "to access Karthificial"
                    }
                },
                signUp: {
                    start: {
                        title: "Create Account",
                        subtitle: "to join Karthificial"
                    }
                }
            }
        });

        updateNavbarAuthState();

        const clerkAppearance = {
            layout: {
                unsafe_disableDevelopmentModeWarnings: true
            },
            variables: {
                colorPrimary: "#d4af37",
                colorBackground: "transparent",
                colorInputBackground: "#111111",
                colorInputText: "#ffffff",
                colorText: "#f5e8b8",
                colorTextSecondary: "#c9b875",
                colorDanger: "#ff5a5a",
                borderRadius: "12px",
                fontFamily: "Arial, Helvetica, sans-serif"
            },
            elements: {
                cardBox: {
                    boxShadow: "none",
                    background: "transparent",
                    width: "100%"
                },
                card: {
                    background: "transparent",
                    boxShadow: "none",
                    border: "none",
                    width: "100%"
                },
                headerTitle: {
                    color: "#d4af37",
                    letterSpacing: "2px",
                    fontSize: "28px",
                    fontWeight: "800",
                    textAlign: "center"
                },
                headerSubtitle: {
                    color: "#c9b875",
                    textAlign: "center"
                },
                socialButtonsBlockButton: {
                    backgroundColor: "#111111",
                    border: "1px solid rgba(212, 175, 55, 0.25)",
                    color: "#f5e8b8"
                },
                formFieldInput: {
                    backgroundColor: "#111111",
                    color: "#ffffff",
                    border: "1px solid rgba(212, 175, 55, 0.25)",
                    borderRadius: "10px"
                },
                formButtonPrimary: {
                    background: "linear-gradient(135deg, #d4af37, #b08d25)",
                    color: "#000000",
                    borderRadius: "999px",
                    fontWeight: "800",
                    border: "none"
                },
                footerActionText: {
                    color: "#c9b875"
                },
                footerActionLink: {
                    color: "#d4af37",
                    fontWeight: "800"
                },
                dividerLine: {
                    background: "rgba(212, 175, 55, 0.2)"
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
                userButtonBox.innerHTML = getSignedOutNavbarHTML();
            }
        }

        document.body.classList.remove("auth-checking");

    } catch (error) {
        console.error("Clerk failed to initialize:", error);
        document.body.classList.remove("auth-checking");
    }
});

window.addEventListener("resize", () => {
    try {
        scheduleAuthLayoutSync();
    } catch (error) {
        console.error("Failed to refresh navbar on resize:", error);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".nav-menu .dropdown > .nav-link").forEach((link) => {
        link.addEventListener("click", (event) => {
            if (window.innerWidth > 900) {
                return;
            }

            event.preventDefault();

            const dropdown = link.closest(".dropdown");

            document.querySelectorAll(".nav-menu .dropdown").forEach((item) => {
                if (item !== dropdown) {
                    item.classList.remove("open");
                }
            });

            dropdown.classList.toggle("open");
        });
    });
});