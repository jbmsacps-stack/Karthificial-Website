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
                fallbackRedirectUrl: "profile-setup.html"
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
    } catch (error) {
        console.error("Clerk failed to initialize:", error);
    }
});