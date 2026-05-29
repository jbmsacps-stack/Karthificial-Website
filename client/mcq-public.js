const dynamicMcqSets = document.getElementById("dynamicMcqSets");

function checkSupabaseForMCQPage() {
    if (!window.supabaseClient) {
        console.error("Supabase client missing. Check supabase-config.js");

        if (dynamicMcqSets) {
            dynamicMcqSets.innerHTML = `
                <article class="resource-box-card">
                    <div class="resource-card-body">
                        <h3>MCQ Database Not Connected</h3>
                        <p>Supabase is not connected. Check supabase-config.js.</p>
                    </div>
                </article>
            `;
        }

        return false;
    }

    return true;
}

function getFallbackThumbnail(subject = "") {
    const normalizedSubject = subject.toLowerCase();

    if (normalizedSubject.includes("tamil")) {
        return "assets/thumbnail/tamil_thumb.png";
    }

    if (normalizedSubject.includes("english")) {
        return "assets/thumbnail/english_thumb.png";
    }

    if (normalizedSubject.includes("science")) {
        return "assets/thumbnail/sci_thumb.png";
    }

    if (normalizedSubject.includes("social")) {
        return "assets/thumbnail/sst_thumb.png";
    }

    if (normalizedSubject.includes("math")) {
        return "assets/thumbnail/maths_thumb.png";
    }

    return "assets/thumbnail/maths_thumb.png";
}

async function getQuestionCount(setId) {
    const { count, error } = await window.supabaseClient
        .from("mcq_questions")
        .select("*", { count: "exact", head: true })
        .eq("set_id", setId);

    if (error) {
        console.error("Question count error:", error);
        return 0;
    }

    return count || 0;
}

async function loadPublicMCQSets() {
    if (!dynamicMcqSets) {
        console.error("Missing #dynamicMcqSets in mcq.html");
        return;
    }

    if (!checkSupabaseForMCQPage()) {
        return;
    }

    const { data, error } = await window.supabaseClient
        .from("mcq_sets")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to load MCQ sets:", error);

        dynamicMcqSets.innerHTML = `
            <article class="resource-box-card">
                <div class="resource-card-body">
                    <h3>Failed to Load MCQ Sets</h3>
                    <p>Please check Supabase table permissions and connection.</p>
                </div>
            </article>
        `;

        return;
    }

    renderPublicMCQSets(data || []);
}

async function renderPublicMCQSets(sets) {
    if (!sets.length) {
        dynamicMcqSets.innerHTML = `
            <article class="resource-box-card">
                <div class="resource-card-body">
                    <h3>No MCQ Sets Available</h3>
                    <p>Admin has not added any MCQ sets yet.</p>
                </div>
            </article>
        `;

        return;
    }

    const cards = await Promise.all(
        sets.map(async (set) => {
            const questionCount = await getQuestionCount(set.id);
            const thumbnail = set.thumbnail_url || getFallbackThumbnail(set.subject);

            return `
                <article class="resource-box-card">
                    <div class="resource-thumbnail">
                        <span>
                            <img
                                src="${thumbnail}"
                                alt="${set.title}"
                                class="src"
                                loading="lazy"
                                fetchpriority="low"
                            >
                        </span>
                    </div>

                    <div class="resource-card-body">
                        <h3>${set.title}</h3>

                        <p>
                            ${set.description || "Practice objective questions from this MCQ set."}
                        </p>

                        <div class="resource-card-info">
                            <span>${set.class_level}th Standard</span>
                            <span>${questionCount} Questions</span>
                        </div>

                        <a href="mcq-set.html?id=${set.id}" class="resource-card-btn">
                            Open
                        </a>
                    </div>
                </article>
            `;
        })
    );

    dynamicMcqSets.innerHTML = cards.join("");
}

document.addEventListener("DOMContentLoaded", loadPublicMCQSets);