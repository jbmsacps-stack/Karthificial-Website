const careerArticleForm = document.getElementById("careerArticleForm");
const careerArticleList = document.getElementById("careerArticleList");

const careerArticleId = document.getElementById("careerArticleId");
const careerTitle = document.getElementById("careerTitle");
const careerCategory = document.getElementById("careerCategory");
const careerThumbnailUrl = document.getElementById("careerThumbnailUrl");
const careerExcerpt = document.getElementById("careerExcerpt");
const careerBody = document.getElementById("careerBody");
const careerYoutubeUrl = document.getElementById("careerYoutubeUrl");
const careerPublishedDate = document.getElementById("careerPublishedDate");

const careerFormTitle = document.getElementById("careerFormTitle");
const careerSaveBtn = document.getElementById("careerSaveBtn");
const careerResetBtn = document.getElementById("careerResetBtn");
const careerAdminStatus = document.getElementById("careerAdminStatus");

let allCareerArticles = [];
let careerQuillEditor = null;

function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

function createSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function setCareerStatus(message, type = "normal") {
    if (!careerAdminStatus) return;

    careerAdminStatus.textContent = message;

    if (type === "success") {
        careerAdminStatus.style.color = "#4ade80";
    } else if (type === "error") {
        careerAdminStatus.style.color = "#f87171";
    } else {
        careerAdminStatus.style.color = "var(--text-muted, #c9bea8)";
    }
}

function checkCareerSupabaseConnection() {
    if (!window.supabaseClient) {
        console.error("Supabase client missing. Check supabase-config.js");

        if (careerArticleList) {
            careerArticleList.innerHTML = `
                <div class="career-admin-empty">
                    Supabase is not connected. Check supabase-config.js.
                </div>
            `;
        }

        return false;
    }

    return true;
}

function resetCareerForm() {
    careerArticleForm.reset();

    careerArticleId.value = "";
    careerPublishedDate.value = getTodayDate();

    if (careerBody) {
        careerBody.value = "";
    }

    setEditorHTML("");

    careerFormTitle.textContent = "Create New Article";
    careerSaveBtn.textContent = "Publish Article";

    setCareerStatus("");
}

function escapeHTML(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getEditorHTML() {
    if (!careerQuillEditor) return "";

    const html = careerQuillEditor.root.innerHTML.trim();

    if (html === "<p><br></p>") {
        return "";
    }

    return html;
}

function setEditorHTML(html = "") {
    if (!careerQuillEditor) return;

    careerQuillEditor.root.innerHTML = html || "";
}

function initCareerEditor() {
    const editorElement = document.getElementById("careerEditor");

    if (!editorElement) {
        console.error("careerEditor element missing in admin-career.html");
        return;
    }

    if (!window.Quill) {
        console.error("Quill is not loaded. Check Quill CDN links in admin-career.html.");
        setCareerStatus("Text editor failed to load. Check Quill CDN links.", "error");
        return;
    }

    careerQuillEditor = new Quill("#careerEditor", {
        theme: "snow",
        placeholder: "Write the article content here...",
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["blockquote", "link"],
                ["clean"]
            ]
        }
    });
}

function renderCareerArticles() {
    if (!careerArticleList) return;

    if (!allCareerArticles.length) {
        careerArticleList.innerHTML = `
            <div class="career-admin-empty">
                No career articles added yet.
            </div>
        `;
        return;
    }

    careerArticleList.innerHTML = allCareerArticles.map((article) => {
        return `
            <article class="career-admin-item">
                <img 
                    src="${escapeHTML(article.thumbnail_url)}" 
                    alt="${escapeHTML(article.title)}"
                    onerror="this.src='assets/cg_thumb/career_guidance_banner.webp'"
                >

                <div class="career-admin-item-content">
                    <span class="career-admin-item-tag">
                        ${escapeHTML(article.category)}
                    </span>

                    <h3>${escapeHTML(article.title)}</h3>

                    <p>${escapeHTML(article.excerpt)}</p>

                    <div class="career-admin-item-actions">
                        <button 
                            class="career-admin-mini-btn career-admin-btn secondary"
                            type="button"
                            onclick="editCareerArticle('${article.id}')"
                        >
                            Edit
                        </button>

                        <button 
                            class="career-admin-mini-btn career-admin-btn danger"
                            type="button"
                            onclick="deleteCareerArticle('${article.id}')"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}

async function loadCareerArticles() {
    if (!checkCareerSupabaseConnection()) return;

    careerArticleList.innerHTML = `
        <div class="career-admin-empty">
            Loading articles...
        </div>
    `;

    const { data, error } = await window.supabaseClient
        .from("career_articles")
        .select("*")
        .order("published_date", { ascending: false });

    if (error) {
        console.error("Career articles load error:", error);
        careerArticleList.innerHTML = `
            <div class="career-admin-empty">
                Failed to load articles: ${escapeHTML(error.message)}
            </div>
        `;
        return;
    }

    allCareerArticles = data || [];
    renderCareerArticles();
}

async function saveCareerArticle(event) {
    event.preventDefault();

    if (!checkCareerSupabaseConnection()) return;

    const id = careerArticleId.value.trim();

    const title = careerTitle.value.trim();
    const category = careerCategory.value.trim();
    const thumbnailUrl = careerThumbnailUrl.value.trim();
    const excerpt = careerExcerpt.value.trim();
    const bodyContent = getEditorHTML();
    careerBody.value = bodyContent;
    const youtubeUrl = careerYoutubeUrl.value.trim();
    const publishedDate = careerPublishedDate.value || getTodayDate();

    if (!title || !category || !thumbnailUrl || !excerpt || !bodyContent) {
        setCareerStatus("Please fill all required fields.", "error");
        return;
    }

    const baseSlug = createSlug(title);

    const finalSlug = id
        ? `${baseSlug}-${id.slice(0, 8)}`
        : `${baseSlug}-${Date.now()}`;

    const payload = {
        title,
        slug: finalSlug,
        category,
        thumbnail_url: thumbnailUrl,
        excerpt,
        body_content: bodyContent,
        youtube_url: youtubeUrl || null,
        published_date: publishedDate
    };

    setCareerStatus("Saving article...");

    careerSaveBtn.disabled = true;
    careerSaveBtn.style.opacity = "0.65";

    let response;

    if (id) {
        response = await window.supabaseClient
            .from("career_articles")
            .update(payload)
            .eq("id", id);
    } else {
        response = await window.supabaseClient
            .from("career_articles")
            .insert(payload);
    }

    careerSaveBtn.disabled = false;
    careerSaveBtn.style.opacity = "1";

    if (response.error) {
        console.error("Career article save error:", response.error);
        setCareerStatus(response.error.message, "error");
        return;
    }

    setCareerStatus(id ? "Article updated successfully." : "Article published successfully.", "success");

    resetCareerForm();
    await loadCareerArticles();
}

window.editCareerArticle = function (id) {
    const article = allCareerArticles.find((item) => item.id === id);

    if (!article) {
        setCareerStatus("Article not found.", "error");
        return;
    }

    careerArticleId.value = article.id;
    careerTitle.value = article.title || "";
    careerCategory.value = article.category || "";
    careerThumbnailUrl.value = article.thumbnail_url || "";
    careerExcerpt.value = article.excerpt || "";
    careerBody.value = article.body_content || "";
    setEditorHTML(article.body_content || "");
    careerYoutubeUrl.value = article.youtube_url || "";
    careerPublishedDate.value = article.published_date || getTodayDate();

    careerFormTitle.textContent = "Edit Article";
    careerSaveBtn.textContent = "Update Article";

    setCareerStatus("Editing article. Make changes and click Update Article.");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

window.deleteCareerArticle = async function (id) {
    if (!checkCareerSupabaseConnection()) return;

    const confirmed = confirm("Are you sure you want to delete this article?");

    if (!confirmed) return;

    const { error } = await window.supabaseClient
        .from("career_articles")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Career article delete error:", error);
        setCareerStatus(error.message, "error");
        return;
    }

    setCareerStatus("Article deleted successfully.", "success");
    await loadCareerArticles();
};

document.addEventListener("DOMContentLoaded", () => {
    initCareerEditor();

    if (careerPublishedDate) {
        careerPublishedDate.value = getTodayDate();
    }

    if (careerArticleForm) {
        careerArticleForm.addEventListener("submit", saveCareerArticle);
    }

    if (careerResetBtn) {
        careerResetBtn.addEventListener("click", resetCareerForm);
    }

    loadCareerArticles();
});