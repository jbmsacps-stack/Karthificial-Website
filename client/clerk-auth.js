document.body.classList.add("auth-checking");

if (sessionStorage.getItem("karthificialGreetingSeen") === "true") {
    document.body.classList.add("auth-greeting-seen");
}

document.addEventListener("DOMContentLoaded", async () => {
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
        console.log("Loading Clerk UI bundle...");

        await loadScript(
            `https://${clerkHost}/npm/@clerk/ui@1/dist/ui.browser.js`
        );

        if (!window.__internal_ClerkUICtor) {
            console.error("Clerk UI bundle loaded, but UI constructor is missing.");
            return;
        }

        console.log("Loading Clerk JS...");

        await loadScript(
            `https://${clerkHost}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`,
            {
                "data-clerk-publishable-key": CLERK_PUBLISHABLE_KEY
            }
        );

        if (!window.Clerk) {
            console.error("ClerkJS loaded, but window.Clerk is missing.");
            return;
        }

        // NOTE: Email vs Phone authentication options are configured in the Clerk Dashboard
        // under "User & Authentication" -> "Identifiers". The Clerk JS SDK automatically
        // respects these settings without requiring manual code changes.
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

        console.log("Clerk loaded successfully with UI components");

        updateNavbarAuthState();

        if (window.Clerk.user) {
            await syncUserWithBackend();
        }

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
                    textTransform: "none",
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
                footer: {
                    background: "transparent",
                    borderTop: "none"
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
            console.log("Clerk sign-in mounted");
        }

        if (signUpBox) {
            window.Clerk.mountSignUp(signUpBox, {
                appearance: clerkAppearance,
                signInUrl: "login.html",
                signUpUrl: "signup.html",
                fallbackRedirectUrl: "index.html",
                forceRedirectUrl: "index.html"
            });
            console.log("Clerk sign-up mounted");
        }

        if (userButtonBox) {
            if (window.Clerk.user) {
                window.Clerk.mountUserButton(userButtonBox);
                console.log("Clerk user button mounted");
            } else {
                userButtonBox.innerHTML = `
                    <a href="login.html" class="btn-outline">Login</a>
                    <a href="signup.html" class="btn-gold">Signup</a>
                `;
            }
        }
        document.body.classList.remove("auth-checking");

    } catch (error) {
        console.error("Clerk failed to initialize:", error);
        document.body.classList.remove("auth-checking");
    }
});

async function syncUserWithBackend() {
    const user = window.Clerk.user;
    if (!user) return;

    const displayName =
        user.fullName ||
        user.firstName ||
        user.username ||
        user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
        "Student";

    const email = user.primaryEmailAddress?.emailAddress || "";

    try {
        const response = await fetch("https://karthificial-backend--jbmsacps.replit.app/api/user/sync", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clerkUserId: user.id,
                displayName: displayName,
                email: email
            })
        });

        if (!response.ok) {
            throw new Error("Backend user sync failed");
        }

        const savedUser = await response.json();

        localStorage.setItem("karthificialUser", JSON.stringify({
            clerkUserId: savedUser.clerkUserId,
            displayName: savedUser.displayName || displayName,
            email: savedUser.email || email
        }));

        updateNavbarAuthState();

    } catch (error) {
        console.error("User profile sync failed:", error);
    }
}

function updateNavbarAuthState() {
    const navActions = document.querySelector(".nav-actions");
    const mobileActions = document.querySelector(".mobile-actions");

    if (!navActions && !mobileActions) return;

    const user = window.Clerk.user;
    const cachedUser = JSON.parse(localStorage.getItem("karthificialUser") || "null");

    if (user) {
        const displayName =
            cachedUser?.displayName ||
            user.fullName ||
            user.firstName ||
            user.username ||
            user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
            "Student";

        const signedInHTML = `
            <span class="nav-user-greeting">Hi, ${displayName}</span>
            <button class="btn-outline nav-logout-btn" type="button">Logout</button>
        `;

        if (navActions) navActions.innerHTML = signedInHTML;
        if (mobileActions) mobileActions.innerHTML = signedInHTML;

        sessionStorage.setItem("karthificialGreetingSeen", "true");
        document.body.classList.add("auth-greeting-seen");

        document.querySelectorAll(".nav-logout-btn").forEach((button) => {
            button.addEventListener("click", async () => {
                localStorage.removeItem("karthificialUser");
                sessionStorage.removeItem("karthificialGreetingSeen");
                await window.Clerk.signOut();
                window.location.href = "index.html";
            });
        });
    } else {
        localStorage.removeItem("karthificialUser");

        const signedOutHTML = `
            <a href="login.html" class="btn-outline">Login</a>
            <a href="signup.html" class="btn-gold">Signup</a>
        `;

        if (navActions) navActions.innerHTML = signedOutHTML;
        if (mobileActions) mobileActions.innerHTML = signedOutHTML;
    }
}

