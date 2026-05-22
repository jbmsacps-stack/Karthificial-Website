const signupForm = document.getElementById("signupForm");
const passwordError = document.getElementById("passwordError");
const signupMessage = document.getElementById("signupMessage");

signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    passwordError.textContent = "";
    signupMessage.textContent = "";
    signupMessage.className = "form-message";

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const studentClass = document.getElementById("studentClass").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        passwordError.textContent = "Passwords do not match.";
        return;
    }

    try {
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: fullName,
                email: email,
                password: password,
                studentClass: studentClass
            })
        });

        const data = await response.json();

        if (!response.ok) {
            signupMessage.textContent = data.message || data.error || "Signup failed. Please try again.";
            signupMessage.classList.add("error-message");
            return;
        }

        sessionStorage.setItem("loginMessage", "Account created! Please login.");
        window.location.href = "login.html";

    } catch (error) {
        signupMessage.textContent = "Server error. Please try again later.";
        signupMessage.classList.add("error-message");
    }
});