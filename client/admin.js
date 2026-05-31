async function waitForClerk() {
    return new Promise((resolve, reject) => {
        let attempts = 0;

        const timer = setInterval(() => {
            attempts++;

            if (window.Clerk) {
                clearInterval(timer);
                resolve(window.Clerk);
                return;
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
    setupAdminManagerButtons();

    const main = document.querySelector("main");

    if (!main) {
        return;
    }

    main.innerHTML = `
        <section class="admin-denied">
            <div>
                <h1>Access Denied</h1>
                <p>You do not have permission to open this admin page.</p>
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

document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop() || "admin.html";

    document.querySelectorAll(".admin-navbar .nav-link").forEach(link => {
        const linkPage = link.getAttribute("href");

        link.classList.toggle("active", linkPage === currentPage);
    });
});

document.addEventListener("DOMContentLoaded", protectAdminPage);

function setupAdminManagerButtons() {
    const mcqButton = document.getElementById("openMcqManagerBtn");

    if (!mcqButton) {
        return;
    }

    mcqButton.addEventListener("click", () => {
        if (typeof window.openMCQManager === "function") {
            window.openMCQManager();
            return;
        }

        console.error("openMCQManager is not available. Check mcq-manager.js.");
        alert("MCQ Manager failed to load. Check mcq-manager.js and Supabase config.");
    });
}