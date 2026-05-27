function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

const resetPasswordForm = document.querySelector("#resetPasswordForm");
const resetMessage = document.querySelector("#resetMessage");
const resetToken = getQueryParam("token");

if (!resetToken) {
    showResetMessage("Invalid reset link. Token is missing.", "error");

    if (resetPasswordForm) {
        resetPasswordForm.style.display = "none";
    }
}

if (resetPasswordForm && resetToken) {
    resetPasswordForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const newPasswordInput = document.querySelector("#newPassword");
        const confirmPasswordInput = document.querySelector("#confirmPassword");
        const submitButton = resetPasswordForm.querySelector("button[type='submit']");

        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!newPassword || !confirmPassword) {
            showResetMessage("Please fill both password fields.", "error");
            return;
        }

        if (newPassword.length < 8) {
            showResetMessage("Password must be at least 8 characters long.", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            showResetMessage("Passwords do not match.", "error");
            return;
        }

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Resetting...";

            const response = await fetch(`${APP_CONFIG.API_AUTH_BASE_URL}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: resetToken,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                showResetMessage(data.message || "Invalid or expired reset link.", "error");
                return;
            }

            showResetMessage(
                data.message || "Password reset successful. Redirecting to login...",
                "success"
            );

            resetPasswordForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1800);

        } catch (error) {
            console.error("Reset password error:", error);
            showResetMessage("Cannot connect to backend. Please try again later.", "error");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Reset Password";
        }
    });
}

function showResetMessage(message, type) {
    if (!resetMessage) {
        return;
    }

    resetMessage.textContent = message;

    resetMessage.className = type === "success"
        ? "form-message success-message"
        : "form-message error-message";
}