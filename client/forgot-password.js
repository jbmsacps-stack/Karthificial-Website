const forgotPasswordForm = document.querySelector("#forgotPasswordForm");
const forgotMessage = document.querySelector("#forgotMessage");

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const emailInput = document.querySelector("#email");
        const submitButton = forgotPasswordForm.querySelector("button[type='submit']");

        const email = emailInput.value.trim();

        if (!email) {
            showForgotMessage("Please enter your registered email address.", "error");
            return;
        }

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Sending Reset Link...";

            const response = await fetch(`${APP_CONFIG.API_AUTH_BASE_URL}/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                showForgotMessage(data.message || "Could not send reset link.", "error");
                return;
            }

            showForgotMessage(
                data.message || "If this email exists, a reset link has been sent.",
                "success"
            );

            forgotPasswordForm.reset();

        } catch (error) {
            console.error("Forgot password error:", error);
            showForgotMessage("Cannot connect to backend. Please try again later.", "error");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send Reset Link";
        }
    });
}

function showForgotMessage(message, type) {
    if (!forgotMessage) return;

    forgotMessage.textContent = message;

    forgotMessage.className = type === "success"
        ? "form-message success-message"
        : "form-message error-message";
}