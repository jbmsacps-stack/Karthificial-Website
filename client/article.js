const articleContainer = document.getElementById("articleContainer");

function getArticleSlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("slug");
}

function escapeArticleHTML(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatArticleDate(dateValue) {
    if (!dateValue) return "Recently published";

    return new Date(dateValue).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function getYouTubeEmbedUrl(url = "") {
    if (!url) return "";

    const watchMatch = url.match(/[?&]v=([^&]+)/);
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    const embedMatch = url.match(/embed\/([^?&]+)/);

    const videoId = watchMatch?.[1] || shortMatch?.[1] || embedMatch?.[1];

    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

function renderArticleError(message) {
    articleContainer.innerHTML = `
        <div class="article-error">
            ${escapeArticleHTML(message)}
        </div>
    `;
}

function renderArticle(article, relatedArticles = []) {
    const embedUrl = getYouTubeEmbedUrl(article.youtube_url);
    const relatedArticlesContainer = document.getElementById("relatedArticlesContainer");

    articleContainer.innerHTML = `
        <article class="article-view">

            <div class="article-main-content">
                <span class="article-category">
                    ${escapeArticleHTML(article.category)}
                </span>

                <h1 class="article-title">
                    ${escapeArticleHTML(article.title)}
                </h1>

                <p class="article-date">
                    Published on ${formatArticleDate(article.published_date)}
                </p>

                ${embedUrl ? `
                    <div class="article-video">
                        <iframe 
                            src="${embedUrl}" 
                            title="${escapeArticleHTML(article.title)}"
                            allowfullscreen>
                        </iframe>
                    </div>
                ` : ""}

                <div class="article-body">
                    ${article.body_content}
                </div>
            </div>

        </article>
    `;

    if (relatedArticlesContainer) {
        if (!relatedArticles.length) {
            relatedArticlesContainer.innerHTML = "";
        } else {
            relatedArticlesContainer.innerHTML = `
                <h2>Related Articles</h2>

                <div class="related-grid">
                    ${relatedArticles.map((item) => `
                        <a class="related-card" href="article.html?slug=${encodeURIComponent(item.slug)}">
                            <img 
                                src="${escapeArticleHTML(item.thumbnail_url)}" 
                                alt="${escapeArticleHTML(item.title)}"
                                onerror="this.src='assets/cg_thumb/career_guidance_banner.webp'"
                            >

                            <div class="related-card-content">
                                <span>${escapeArticleHTML(item.category)}</span>
                                <h3>${escapeArticleHTML(item.title)}</h3>
                            </div>
                        </a>
                    `).join("")}
                </div>
            `;
        }
    }

    document.title = `Karthificial | ${article.title}`;
}

async function loadArticlePage() {
    if (!window.supabaseClient) {
        renderArticleError("Supabase is not connected. Check supabase-config.js.");
        return;
    }

    const slug = getArticleSlugFromURL();

    if (!slug) {
        renderArticleError("Article not found. Missing article slug.");
        return;
    }

    const { data: article, error } = await window.supabaseClient
        .from("career_articles")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !article) {
        console.error("Article load error:", error);
        renderArticleError("Article not found or failed to load.");
        return;
    }

    let finalRelatedArticles = [];

    const { data: sameCategoryRelated, error: sameCategoryError } = await window.supabaseClient
        .from("career_articles")
        .select("*")
        .eq("category", article.category)
        .neq("id", article.id)
        .limit(3);

    if (sameCategoryError) {
        console.warn("Same category related article load error:", sameCategoryError);
    }

    finalRelatedArticles = sameCategoryRelated || [];

    if (finalRelatedArticles.length < 3) {
        const neededCount = 3 - finalRelatedArticles.length;

        const alreadyUsedIds = [
            article.id,
            ...finalRelatedArticles.map((item) => item.id)
        ];

        const { data: extraRelated, error: extraRelatedError } = await window.supabaseClient
            .from("career_articles")
            .select("*")
            .not("id", "in", `(${alreadyUsedIds.join(",")})`)
            .order("published_date", { ascending: false })
            .limit(neededCount);

        if (extraRelatedError) {
            console.warn("Extra related article load error:", extraRelatedError);
        }

        finalRelatedArticles = [
            ...finalRelatedArticles,
            ...(extraRelated || [])
        ];
    }

    renderArticle(article, finalRelatedArticles);
}

document.addEventListener("DOMContentLoaded", loadArticlePage);