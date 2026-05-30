const careerArticleGrid = document.getElementById("careerArticleGrid");
const careerArticleSearch = document.getElementById("careerArticleSearch");
const careerCategoryFilters = document.getElementById("careerCategoryFilters");

let careerArticles = [];
let activeCareerCategory = "All";

function escapeCareerHTML(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function stripHTML(value = "") {
    const temp = document.createElement("div");
    temp.innerHTML = value;
    return temp.textContent || temp.innerText || "";
}

function checkCareerArticleSupabase() {
    if (!window.supabaseClient) {
        console.error("Supabase client missing. Check supabase-config.js");

        if (careerArticleGrid) {
            careerArticleGrid.innerHTML = `
                <div class="career-article-empty">
                    Supabase is not connected. Check supabase-config.js.
                </div>
            `;
        }

        return false;
    }

    return true;
}

function getFilteredCareerArticles() {
    const searchValue = careerArticleSearch
        ? careerArticleSearch.value.trim().toLowerCase()
        : "";

    return careerArticles.filter((article) => {
        const title = String(article.title || "").toLowerCase();
        const category = String(article.category || "").toLowerCase();
        const excerpt = String(article.excerpt || "").toLowerCase();
        const body = stripHTML(article.body_content || "").toLowerCase();

        const searchableText = `${title} ${category} ${excerpt} ${body}`;

        const matchesSearch =
            searchValue === "" || searchableText.includes(searchValue);

        const matchesCategory =
            activeCareerCategory === "All" ||
            String(article.category || "").trim().toLowerCase() === activeCareerCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });
}

function renderCareerArticleCards() {
    if (!careerArticleGrid) return;

    const filteredArticles = getFilteredCareerArticles();

    if (!filteredArticles.length) {
        careerArticleGrid.innerHTML = `
            <div class="career-article-empty">
                No career articles found.
            </div>
        `;
        return;
    }

    careerArticleGrid.innerHTML = filteredArticles.map((article) => {
        return `
            <article class="career-article-card">
                <div class="career-article-thumb">
                    <img 
                        src="${escapeCareerHTML(article.thumbnail_url)}" 
                        alt="${escapeCareerHTML(article.title)}"
                        loading="lazy"
                        onerror="this.src='assets/cg_thumb/career_guidance_banner.webp'"
                    >
                </div>

                <div class="career-article-body">
                    <span class="career-article-tag">
                        ${escapeCareerHTML(article.category)}
                    </span>

                    <h3>${escapeCareerHTML(article.title)}</h3>

                    <p>${escapeCareerHTML(article.excerpt)}</p>

                    <a 
                        class="career-article-link" 
                        href="article.html?slug=${encodeURIComponent(article.slug)}"
                    >
                        Explore →
                    </a>
                </div>
            </article>
        `;
    }).join("");
}

async function loadCareerArticleCards() {
    if (!checkCareerArticleSupabase()) return;

    careerArticleGrid.innerHTML = `
        <div class="career-article-empty">
            Loading career articles...
        </div>
    `;

    const { data, error } = await window.supabaseClient
        .from("career_articles")
        .select("*")
        .order("published_date", { ascending: false });

    if (error) {
        console.error("Career article load error:", error);

        careerArticleGrid.innerHTML = `
            <div class="career-article-empty">
                Failed to load articles: ${escapeCareerHTML(error.message)}
            </div>
        `;

        return;
    }

    careerArticles = data || [];
    renderCareerArticleCards();
}

document.addEventListener("DOMContentLoaded", () => {
    if (careerArticleSearch) {
        careerArticleSearch.addEventListener("input", () => {
            renderCareerArticleCards();
        });
    }

    if (careerCategoryFilters) {
        careerCategoryFilters.addEventListener("click", (event) => {
            const button = event.target.closest(".career-filter-btn");

            if (!button) return;

            activeCareerCategory = button.dataset.category || "All";

            document.querySelectorAll(".career-filter-btn").forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            renderCareerArticleCards();
        });
    }

    loadCareerArticleCards();
});