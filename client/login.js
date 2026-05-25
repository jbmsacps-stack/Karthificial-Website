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
        const response = await fetch("http://localhost:8080/api/auth/login", {
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
            console.error("Login failed response:", response.status, data);
            loginMessage.textContent = data.message || data.error || "Login failed. Please try again.";
            loginMessage.classList.add("error-message");
            return;
        }

        if (data.success === false) {
            console.error("Login response indicates failure:", data);
            loginMessage.textContent = data.message || "Invalid email or password.";
            loginMessage.classList.add("error-message");
            return;
        }

        const user = {
            userId: data.userId,
            fullName: data.fullName,
            email: data.email,
            studentClass: data.studentClass
        };

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "index.html";

    } catch (error) {
        console.error("Login network error:", error);
        loginMessage.textContent = "Backend server is not running or cannot be reached.";
        loginMessage.classList.add("error-message");
    }
});