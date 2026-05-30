const staticRelatedArticles = document.getElementById("staticRelatedArticles");

/*
    Change this per static page:
    after-12th.html     -> "After 12th"
    after-10th.html     -> "After 10th"
    group-selection.html -> "Group Selection"
*/
const STATIC_PAGE_CATEGORY = "After 12th";

function escapeStaticRelatedHTML(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function renderStaticRelatedArticles(articles) {
    if (!staticRelatedArticles) return;

    if (!articles.length) {
        staticRelatedArticles.innerHTML = `
            <div class="article-loading">
                No related articles found.
            </div>
        `;
        return;
    }

    staticRelatedArticles.innerHTML = articles.map((article) => {
        return `
            <a class="related-card" href="article.html?slug=${encodeURIComponent(article.slug)}">
                <img 
                    src="${escapeStaticRelatedHTML(article.thumbnail_url)}" 
                    alt="${escapeStaticRelatedHTML(article.title)}"
                    onerror="this.src='assets/cg_thumb/career_guidance_banner.webp'"
                >

                <div class="related-card-content">
                    <span>${escapeStaticRelatedHTML(article.category)}</span>
                    <h3>${escapeStaticRelatedHTML(article.title)}</h3>
                </div>
            </a>
        `;
    }).join("");
}

async function loadStaticRelatedArticles() {
    if (!staticRelatedArticles) return;

    if (!window.supabaseClient) {
        staticRelatedArticles.innerHTML = `
            <div class="article-loading">
                Supabase is not connected.
            </div>
        `;
        return;
    }

    let finalArticles = [];

    const { data: sameCategoryArticles, error: sameCategoryError } = await window.supabaseClient
        .from("career_articles")
        .select("*")
        .eq("category", STATIC_PAGE_CATEGORY)
        .order("published_date", { ascending: false })
        .limit(3);

    if (sameCategoryError) {
        console.warn("Same category related articles error:", sameCategoryError);
    }

    finalArticles = sameCategoryArticles || [];

    if (finalArticles.length < 3) {
        const neededCount = 3 - finalArticles.length;

        const usedIds = finalArticles.map((item) => item.id);

        let query = window.supabaseClient
            .from("career_articles")
            .select("*")
            .order("published_date", { ascending: false })
            .limit(neededCount);

        if (usedIds.length) {
            const usedIdsForSupabase = `(${usedIds.map((id) => `"${id}"`).join(",")})`;
            query = query.not("id", "in", usedIdsForSupabase);
        }

        const { data: extraArticles, error: extraError } = await query;

        if (extraError) {
            console.warn("Extra related articles error:", extraError);
        }

        finalArticles = [
            ...finalArticles,
            ...(extraArticles || [])
        ];
    }

    renderStaticRelatedArticles(finalArticles.slice(0, 3));
}

document.addEventListener("DOMContentLoaded", loadStaticRelatedArticles);