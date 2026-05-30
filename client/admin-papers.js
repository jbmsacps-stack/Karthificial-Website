console.log("Admin Papers Loaded");

/* Admin protection */
if (typeof protectAdminPage === "function") {
    protectAdminPage();
} else {
    console.warn("protectAdminPage() not found. Check admin.js script.");
}

/* DOM elements */
const form = document.getElementById("paper-form");
const papersList = document.getElementById("papers-list");
const messageBox = document.getElementById("message-box");
const standardSelect = document.getElementById("standard");
const subjectSelect = document.getElementById("subject");
const titleInput = document.getElementById("title");
const pdfInput = document.getElementById("pdf_url");
const yearInput = document.getElementById("year");

/* Subject list */
const SUBJECTS = {
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

/* Message */
function showMessage(message, type = "success") {
    if (!messageBox) return;

    messageBox.innerHTML = `
        <div style="
            margin-top:15px;
            padding:12px;
            border-radius:10px;
            background:${type === "success" ? "#1f7a1f" : "#7a1f1f"};
            color:white;
        ">
            ${message}
        </div>
    `;

    setTimeout(() => {
        messageBox.innerHTML = "";
    }, 3000);
}

/* ✅ SUBJECT DROPDOWN FIX */
function updateSubjects() {
    if (!standardSelect || !subjectSelect) {
        console.error("Standard or Subject select not found.");
        return;
    }

    const selectedStandard = standardSelect.value;

    console.log("Selected Standard:", selectedStandard);

    subjectSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = selectedStandard
        ? "Select Subject"
        : "Select Standard First";

    subjectSelect.appendChild(defaultOption);

    if (!selectedStandard || !SUBJECTS[selectedStandard]) {
        return;
    }

    SUBJECTS[selectedStandard].forEach((subject) => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });

    console.log("Subjects loaded:", SUBJECTS[selectedStandard]);
}

/* ✅ Attach dropdown event immediately */
if (standardSelect) {
    standardSelect.addEventListener("change", updateSubjects);
    updateSubjects();
}

/* Supabase */
const supabase = window.supabaseClient;

if (!supabase) {
    console.error("Supabase client missing. Check supabase-config.js and script order.");
    showMessage("Supabase is not connected. Check script order.", "error");
}

/* Load papers */
async function loadPapers() {
    if (!supabase || !papersList) return;

    papersList.innerHTML = "<p>Loading papers...</p>";

    try {
        const { data, error } = await supabase
            .from("question_papers")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            papersList.innerHTML = "<p>Failed to load papers.</p>";
            return;
        }

        if (!data || !data.length) {
            papersList.innerHTML = "<p>No papers added yet.</p>";
            return;
        }

        let html = "";

        data.forEach((paper) => {
            html += `
                <div class="admin-card" style="
                    margin-top:15px;
                    padding:15px;
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:15px;
                ">
                    <div>
                        <h3>${paper.title}</h3>
                        <p>${paper.standard} - ${paper.subject}</p>
                        <small>${paper.year || ""}</small>
                    </div>

                    <div style="
                        display:flex;
                        gap:10px;
                        flex-wrap:wrap;
                    ">
                        <a href="${paper.pdf_url}" target="_blank" class="btn-gold">
                            Open
                        </a>

                        <button class="btn-outline delete-btn" data-id="${paper.id}">
                            Delete
                        </button>
                    </div>
                </div>
            `;
        });

        papersList.innerHTML = html;
        attachDeleteEvents();

    } catch (err) {
        console.error(err);
        papersList.innerHTML = "<p>Something went wrong.</p>";
    }
}

/* Delete papers */
function attachDeleteEvents() {
    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            if (!supabase) {
                showMessage("Supabase is not connected.", "error");
                return;
            }

            const id = button.dataset.id;

            const confirmDelete = confirm("Delete this paper?");
            if (!confirmDelete) return;

            try {
                const { error } = await supabase
                    .from("question_papers")
                    .delete()
                    .eq("id", id);

                if (error) {
                    console.error(error);
                    showMessage("Delete failed", "error");
                    return;
                }

                showMessage("Paper deleted");
                loadPapers();

            } catch (err) {
                console.error(err);
                showMessage("Something went wrong", "error");
            }
        });
    });
}

/* Submit form */
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!supabase) {
            showMessage("Supabase is not connected.", "error");
            return;
        }

        if (!standardSelect.value) {
            showMessage("Please select a standard.", "error");
            standardSelect.focus();
            return;
        }

        if (!subjectSelect.value) {
            showMessage("Please select a subject.", "error");
            subjectSelect.focus();
            return;
        }

        const title = titleInput.value.trim();
        const pdfUrl = pdfInput.value.trim();
        const year = yearInput.value.trim();

        if (!title) {
            showMessage("Please enter a title.", "error");
            titleInput.focus();
            return;
        }

        if (!pdfUrl) {
            showMessage("Please enter the PDF URL.", "error");
            pdfInput.focus();
            return;
        }

        const paper = {
            standard: standardSelect.value,
            subject: subjectSelect.value,
            title: title,
            pdf_url: pdfUrl,
            year: year
        };

        console.log("Submitting Paper:", paper);

        try {
            const { error } = await supabase
                .from("question_papers")
                .insert([paper]);

            if (error) {
                console.error(error);
                showMessage(error.message, "error");
                return;
            }

            showMessage("Paper added successfully");

            form.reset();
            updateSubjects();
            loadPapers();

        } catch (err) {
            console.error(err);
            showMessage("Something went wrong", "error");
        }
    });
}

/* Initial load */
if (supabase) {
    loadPapers();
}