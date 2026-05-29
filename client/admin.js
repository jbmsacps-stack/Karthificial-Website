async function waitForClerk() {
    return new Promise((resolve, reject) => {
        let attempts = 0;

        const timer = setInterval(() => {
            attempts++;

            if (window.Clerk) {
                clearInterval(timer);
                resolve(window.Clerk);
            }

            if (attempts > 50) {
                clearInterval(timer);
                reject(new Error("Clerk failed to load"));
            }
        }, 100);
    });
}

function showAccessDenied() {
    document.body.classList.remove("admin-checking");

    document.querySelector("main").innerHTML = `
        <section class="admin-denied">
            <div>
                <h1>Access Denied</h1>
                <p>You do not have permission to open the admin dashboard.</p>
                <br>
                <a href="index.html" class="btn-gold">Go Home</a>
            </div>
        </section>
    `;
}

async function protectAdminPage() {
    try {
        const Clerk = await waitForClerk();

        await Clerk.load();

        if (!Clerk.user) {
            window.location.href = "login.html";
            return;
        }

        const role = Clerk.user.publicMetadata?.role;

        if (role !== "admin") {
            showAccessDenied();
            return;
        }

        document.body.classList.remove("admin-checking");

    } catch (error) {
        console.error("Admin auth error:", error);
        showAccessDenied();
    }
}

protectAdminPage();