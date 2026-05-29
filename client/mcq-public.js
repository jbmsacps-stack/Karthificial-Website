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

function getMCQGradient(theme = "dark-gold") {
    const gradients = {
        "dark-gold": "linear-gradient(135deg, #050505, #15120a, #d4af37)",
        "royal-gold": "linear-gradient(135deg, #06162f, #1d4ed8, #d4af37)",
        "crimson-gold": "linear-gradient(135deg, #350606, #b91c1c, #d4af37)",
        "emerald-gold": "linear-gradient(135deg, #052e1a, #059669, #d4af37)",
        "violet-gold": "linear-gradient(135deg, #1e1b4b, #7c3aed, #d4af37)",
        "cyan-gold": "linear-gradient(135deg, #042f3d, #0891b2, #d4af37)"
    };

    return gradients[theme] || gradients["dark-gold"];
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
            const gradient = getMCQGradient(set.gradient_theme);
            const hasThumbnail = Boolean(set.thumbnail_url && set.thumbnail_url.trim());

            const thumbnailHTML = hasThumbnail
                ? `
        <div class="resource-thumbnail mcq-image-thumb">
            <img
                src="${set.thumbnail_url.trim()}"
                alt="${set.title}"
                loading="lazy"
                fetchpriority="low"
            >
        </div>
    `
                : `
        <div class="resource-thumbnail mcq-gradient-thumb" style="background: ${gradient};">
            <div class="mcq-gradient-simple">
                <span>${set.class_level}th Standard</span>
                <strong>${set.subject || "MCQ"}</strong>
                <small>MCQ Practice</small>
            </div>
        </div>
    `;

            return `
                <article class="resource-box-card">
                    ${thumbnailHTML}

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