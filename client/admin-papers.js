/* ================================
   KARTHIFICIAL ADMIN PAPERS MANAGER
================================ */

const standardInput = document.getElementById("standard");
const subjectInput = document.getElementById("subject");
const paperForm = document.getElementById("paper-form");
const titleInput = document.getElementById("title");
const pdfUrlInput = document.getElementById("pdf_url");
const yearInput = document.getElementById("year");
const messageBox = document.getElementById("message-box");
const papersList = document.getElementById("papers-list");

const SUBJECTS_BY_STANDARD = {
    "10th": [
        "Tamil",
        "English",
        "Mathematics",
        "Science",
        "Social Science"
    ],

    "12th": [
        "Tamil",
        "English",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Computer Science",
        "Commerce",
        "Accountancy",
        "Economics",
        "Business Maths"
    ]
};

function showMessage(message, type = "success") {
    if (!messageBox) return;

    messageBox.innerHTML = `
        <p class="${type === "error" ? "admin-error" : "admin-success"}">
            ${message}
        </p>
    `;
}

function updateSubjects() {
    const selectedStandard = standardInput.value;

    subjectInput.innerHTML = `<option value="">Select Subject</option>`;

    if (!selectedStandard || !SUBJECTS_BY_STANDARD[selectedStandard]) {
        return;
    }

    SUBJECTS_BY_STANDARD[selectedStandard].forEach((subject) => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectInput.appendChild(option);
    });

    console.log("Subjects loaded for:", selectedStandard);
}

standardInput.addEventListener("change", updateSubjects);

/* Load subjects immediately because 10th is already visible in your screenshot */
updateSubjects();

function getSupabaseClient() {
    if (!window.supabaseClient) {
        showMessage("Supabase is not connected. Check supabase-config.js", "error");
        console.error("window.supabaseClient missing");
        return null;
    }

    return window.supabaseClient;
}

async function loadPapers() {
    const supabase = getSupabaseClient();

    if (!supabase || !papersList) return;

    const { data, error } = await supabase
        .from("question_papers")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        papersList.innerHTML = `<p class="admin-error">Failed to load papers.</p>`;
        return;
    }

    if (!data || data.length === 0) {
        papersList.innerHTML = `<p>No question papers added yet.</p>`;
        return;
    }

    papersList.innerHTML = data.map((paper) => `
        <article class="admin-list-card">
            <h3>${paper.title}</h3>

            <p>
                <strong>Standard:</strong> ${paper.standard || "-"} <br>
                <strong>Subject:</strong> ${paper.subject || "-"} <br>
                <strong>Year:</strong> ${paper.year || "-"}
            </p>

            <div class="admin-list-card-actions">
                <a href="${paper.pdf_url}" target="_blank" class="btn-outline">
                    View PDF
                </a>

                <button 
                    type="button" 
                    class="btn-outline admin-delete-btn" 
                    data-id="${paper.id}">
                    Delete
                </button>
            </div>
        </article>
    `).join("");

    attachDeleteEvents();
}

function attachDeleteEvents() {
    const deleteButtons = document.querySelectorAll(".admin-delete-btn");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const paperId = button.dataset.id;

            const confirmDelete = confirm("Delete this question paper?");
            if (!confirmDelete) return;

            const supabase = getSupabaseClient();
            if (!supabase) return;

            const { error } = await supabase
                .from("question_papers")
                .delete()
                .eq("id", paperId);

            if (error) {
                console.error(error);
                showMessage("Failed to delete paper.", "error");
                return;
            }

            showMessage("Paper deleted successfully.");
            loadPapers();
        });
    });
}

paperForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const newPaper = {
        standard: standardInput.value,
        subject: subjectInput.value,
        title: titleInput.value.trim(),
        pdf_url: pdfUrlInput.value.trim(),
        year: yearInput.value.trim()
    };

    if (!newPaper.standard || !newPaper.subject || !newPaper.title || !newPaper.pdf_url) {
        showMessage("Please fill Standard, Subject, Title, and PDF URL.", "error");
        return;
    }

    const { error } = await supabase
        .from("question_papers")
        .insert([newPaper]);

    if (error) {
        console.error(error);
        showMessage("Failed to add paper.", "error");
        return;
    }

    showMessage("Question paper added successfully.");

    paperForm.reset();
    updateSubjects();
    loadPapers();
});

loadPapers();