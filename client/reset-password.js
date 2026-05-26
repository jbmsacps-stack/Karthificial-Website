function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

const resetForm = document.querySelector('#resetForm');
const resetMessage = document.querySelector('#resetMessage');

if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = document.querySelector('#newPassword').value.trim();
        const confirmPassword = document.querySelector('#confirmPassword').value.trim();
        const token = getQueryParam('token') || '';

        if (!newPassword || newPassword !== confirmPassword) {
            resetMessage.textContent = 'Passwords do not match.';
            resetMessage.className = 'form-message error-message';
            return;
        }

        try {
            const res = await fetch(`${APP_CONFIG.API_AUTH_BASE_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await res.json();

            if (!res.ok) {
                resetMessage.textContent = data.message || 'Reset failed.';
                resetMessage.className = 'form-message error-message';
                return;
            }

            resetMessage.textContent = data.message || 'Password reset successful.';
            resetMessage.className = 'form-message success-message';

            setTimeout(() => { window.location.href = 'login.html'; }, 1200);
        } catch (err) {
            resetMessage.textContent = 'Cannot connect to backend.';
            resetMessage.className = 'form-message error-message';
            console.error('Reset password error:', err);
        }
    });
}
const resetPasswordForm = document.querySelector("#resetPasswordForm");
const resetMessage = document.querySelector("#resetMessage");

const urlParams = new URLSearchParams(window.location.search);
const resetToken = urlParams.get("token");

if (!resetToken) {
    showResetMessage("Invalid reset link. Token is missing.", "error");

    if (resetPasswordForm) {
        resetPasswordForm.style.display = "none";
    }
}

if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const newPassword = document.querySelector("#newPassword")?.value.trim();
        const confirmPassword = document.querySelector("#confirmPassword")?.value.trim();
        const submitButton = resetPasswordForm.querySelector("button[type='submit']");

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
                    newPassword
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