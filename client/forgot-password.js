const forgotPasswordForm = document.querySelector("#forgotPasswordForm");
const forgotMessage = document.querySelector("#forgotMessage");

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.querySelector("#email")?.value.trim();
        const submitButton = forgotPasswordForm.querySelector("button[type='submit']");

        if (!email) {
            showForgotMessage("Please enter your registered email address.", "error");
            return;
        }

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Sending Request...";

            const response = await fetch(`${APP_CONFIG.API_AUTH_BASE_URL}/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                showForgotMessage(data.message || "Password recovery is temporarily unavailable.", "error");
                return;
            }

            showForgotMessage(
                data.message || "Password recovery is handled by moderators. Please contact the admin team with your registered email.",
                "success"
            );

            forgotPasswordForm.reset();

        } catch (error) {
            console.error("Forgot password error:", error);
            showForgotMessage("Cannot connect to backend. Please try again later.", "error");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Request Moderator Help";
        }
    });
}

function showForgotMessage(message, type) {
    if (!forgotMessage) {
        return;
    }

    forgotMessage.textContent = message;

    forgotMessage.className = type === "success"
        ? "form-message success-message"
        : "form-message error-message";
}