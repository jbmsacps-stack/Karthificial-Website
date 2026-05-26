const forgotForm = document.querySelector('#forgotForm');
const forgotMessage = document.querySelector('#forgotMessage');

if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.querySelector('#email').value.trim();

        if (!email) return;

        forgotMessage.textContent = '';

        try {
            const res = await fetch(`${APP_CONFIG.API_AUTH_BASE_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            forgotMessage.textContent = data.message || 'If this email exists, a reset link has been sent.';
            forgotMessage.className = 'form-message success-message';
        } catch (err) {
            forgotMessage.textContent = 'Cannot connect to backend.';
            forgotMessage.className = 'form-message error-message';
            console.error('Forgot password error:', err);
        }
    });
}
const forgotPasswordForm = document.querySelector("#forgotPasswordForm");
const forgotMessage = document.querySelector("#forgotMessage");

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.querySelector("#email")?.value.trim();
        const submitButton = forgotPasswordForm.querySelector("button[type='submit']");

        if (!email) {
            showForgotMessage("Please enter your email address.", "error");
            return;
        }

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";

            const response = await fetch(`${APP_CONFIG.API_AUTH_BASE_URL}/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                showForgotMessage(data.message || "Something went wrong. Try again.", "error");
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
    if (!forgotMessage) {
        return;
    }

    forgotMessage.textContent = message;

    forgotMessage.className = type === "success"
        ? "form-message success-message"
        : "form-message error-message";
}