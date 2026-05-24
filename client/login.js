const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const savedMessage = sessionStorage.getItem("loginMessage");

if (savedMessage) {
    loginMessage.textContent = savedMessage;
    loginMessage.classList.add("success-message");
    sessionStorage.removeItem("loginMessage");
}

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    loginMessage.textContent = "";
    loginMessage.className = "form-message";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            loginMessage.textContent = data.message || data.error || "Login failed. Please try again.";
            loginMessage.classList.add("error-message");
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "index.html";

    } catch (error) {
        loginMessage.textContent = "Backend server is not running or cannot be reached.";
        loginMessage.classList.add("error-message");
    }
});