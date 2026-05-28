window.addEventListener("load", async () => {
    const signInBox = document.getElementById("clerk-sign-in");
    const signUpBox = document.getElementById("clerk-sign-up");
    const userButtonBox = document.getElementById("clerk-user-button");

    if (!window.Clerk) {
        console.error("ClerkJS not loaded. Check your Clerk script tag.");
        return;
    }

    try {
        await window.Clerk.load();

        console.log("Clerk loaded successfully");

        if (signInBox) {
            window.Clerk.mountSignIn(signInBox);
            console.log("Clerk sign-in mounted");
        }

        if (signUpBox) {
            window.Clerk.mountSignUp(signUpBox);
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