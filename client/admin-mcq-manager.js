const mcqSetForm = document.getElementById("mcqSetForm");
const mcqQuestionForm = document.getElementById("mcqQuestionForm");
const questionSetSelect = document.getElementById("questionSet");
const mcqSetsList = document.getElementById("mcqSetsList");
const mcqQuestionsList = document.getElementById("mcqQuestionsList");

let selectedSetId = null;

function showAdminMessage(message) {
    alert(message);
}

function checkSupabaseReady() {
    if (!window.supabaseClient) {
        console.error("Supabase client missing. Check supabase-config.js");
        showAdminMessage("Supabase is not connected. Check supabase-config.js.");
        return false;
    }

    return true;
}

async function loadMCQSets() {
    if (!checkSupabaseReady()) return;

    const { data, error } = await window.supabaseClient
        .from("mcq_sets")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        mcqSetsList.innerHTML = `<p class="admin-empty-text">Failed to load MCQ sets.</p>`;
        return;
    }

    const sets = data || [];

    renderMCQSetOptions(sets);
    renderMCQSets(sets);

    const savedSetId = localStorage.getItem("selectedMCQSetId");

    if (savedSetId && sets.some((set) => set.id === savedSetId)) {
        selectedSetId = savedSetId;
        questionSetSelect.value = savedSetId;
        viewQuestions(savedSetId);
    }
}

function renderMCQSetOptions(sets) {
    questionSetSelect.innerHTML = `<option value="">Select MCQ set</option>`;

    sets.forEach((set) => {
        const option = document.createElement("option");
        option.value = set.id;
        option.textContent = set.title;
        questionSetSelect.appendChild(option);
    });
}

function renderMCQSets(sets) {
    if (!sets.length) {
        mcqSetsList.innerHTML = `<p class="admin-empty-text">No MCQ sets created yet.</p>`;
        return;
    }

    mcqSetsList.innerHTML = sets.map((set) => {
        return `
            <article class="admin-list-card">
                <h3>${set.title}</h3>
                <p><strong>Class:</strong> ${set.class_level}th Standard</p>
                <p><strong>Subject:</strong> ${set.subject}</p>
                <p>${set.description || ""}</p>

                <div class="admin-list-card-actions">
                    <button class="btn-outline" type="button" onclick="viewQuestions('${set.id}')">
                        View Questions
                    </button>

                    <button class="admin-delete-btn" type="button" onclick="deleteMCQSet('${set.id}')">
                        Delete Set
                    </button>
                </div>
            </article>
        `;
    }).join("");
}

async function createMCQSet(event) {
    event.preventDefault();

    if (!checkSupabaseReady()) return;

    const thumbnailUrl = document.getElementById("setThumbnailUrl").value.trim();
    const description = document.getElementById("setDescription").value.trim();

    const newSet = {
        title: document.getElementById("setTitle").value.trim(),
        subject: document.getElementById("setSubject").value.trim(),
        class_level: document.getElementById("setClassLevel").value,
        thumbnail_url: thumbnailUrl || null,
        gradient_theme: document.getElementById("setGradientTheme").value || "dark-gold",
        description: description || null,
        is_active: true
    };

    const { error } = await window.supabaseClient
        .from("mcq_sets")
        .insert([newSet]);

    if (error) {
        console.error(error);
        showAdminMessage("Failed to create MCQ set.");
        return;
    }

    mcqSetForm.reset();
    showAdminMessage("MCQ set created.");
    loadMCQSets();
}

async function addQuestion(event) {
    event.preventDefault();

    if (!checkSupabaseReady()) return;

    const setId = questionSetSelect.value;

    if (!setId) {
        showAdminMessage("Select an MCQ set first.");
        return;
    }

    const newQuestion = {
        set_id: setId,
        question: document.getElementById("questionText").value.trim(),
        option_a: document.getElementById("optionA").value.trim(),
        option_b: document.getElementById("optionB").value.trim(),
        option_c: document.getElementById("optionC").value.trim(),
        option_d: document.getElementById("optionD").value.trim(),
        correct_answer: document.getElementById("correctAnswer").value,
        difficulty: document.getElementById("difficulty").value
    };

    const { error } = await window.supabaseClient
        .from("mcq_questions")
        .insert([newQuestion]);

    if (error) {
        console.error(error);
        showAdminMessage("Failed to add question.");
        return;
    }

    mcqQuestionForm.reset();
    questionSetSelect.value = setId;

    showAdminMessage("Question added.");
    viewQuestions(setId);
}

async function viewQuestions(setId) {
    if (!checkSupabaseReady()) return;

    selectedSetId = setId;
    localStorage.setItem("selectedMCQSetId", setId);
    questionSetSelect.value = setId;

    const { data, error } = await window.supabaseClient
        .from("mcq_questions")
        .select("*")
        .eq("set_id", setId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error(error);
        mcqQuestionsList.innerHTML = `<p class="admin-empty-text">Failed to load questions.</p>`;
        return;
    }

    renderQuestions(data || []);
}

function renderQuestions(questions) {
    if (!questions.length) {
        mcqQuestionsList.innerHTML = `<p class="admin-empty-text">No questions added to this set yet.</p>`;
        return;
    }

    mcqQuestionsList.innerHTML = questions.map((item, index) => {
        return `
            <article class="admin-list-card">
                <h3>${index + 1}. ${item.question}</h3>

                <p><strong>A:</strong> ${item.option_a}</p>
                <p><strong>B:</strong> ${item.option_b}</p>
                <p><strong>C:</strong> ${item.option_c}</p>
                <p><strong>D:</strong> ${item.option_d}</p>
                <p><strong>Correct:</strong> ${item.correct_answer}</p>
                <p><strong>Difficulty:</strong> ${item.difficulty}</p>

                <div class="admin-list-card-actions">
                    <button class="admin-delete-btn" type="button" onclick="deleteQuestion('${item.id}')">
                        Delete Question
                    </button>
                </div>
            </article>
        `;
    }).join("");
}

async function deleteQuestion(questionId) {
    if (!checkSupabaseReady()) return;

    const confirmDelete = confirm("Delete this question?");

    if (!confirmDelete) return;

    const { error } = await window.supabaseClient
        .from("mcq_questions")
        .delete()
        .eq("id", questionId);

    if (error) {
        console.error(error);
        showAdminMessage("Failed to delete question.");
        return;
    }

    showAdminMessage("Question deleted.");

    if (selectedSetId) {
        viewQuestions(selectedSetId);
    }
}

async function deleteMCQSet(setId) {
    if (!checkSupabaseReady()) return;

    const confirmDelete = confirm("Delete this MCQ set and all its questions?");

    if (!confirmDelete) return;

    const { error: questionError } = await window.supabaseClient
        .from("mcq_questions")
        .delete()
        .eq("set_id", setId);

    if (questionError) {
        console.error(questionError);
        showAdminMessage("Failed to delete questions inside this set.");
        return;
    }

    const { error: setError } = await window.supabaseClient
        .from("mcq_sets")
        .delete()
        .eq("id", setId);

    if (setError) {
        console.error(setError);
        showAdminMessage("Failed to delete MCQ set.");
        return;
    }

    if (selectedSetId === setId) {
        selectedSetId = null;
        localStorage.removeItem("selectedMCQSetId");
        mcqQuestionsList.innerHTML = `<p class="admin-empty-text">Select an MCQ set to view questions.</p>`;
    }

    showAdminMessage("MCQ set deleted.");
    loadMCQSets();
}

mcqSetForm?.addEventListener("submit", createMCQSet);
mcqQuestionForm?.addEventListener("submit", addQuestion);
questionSetSelect?.addEventListener("change", () => {
    if (questionSetSelect.value) {
        viewQuestions(questionSetSelect.value);
    } else {
        selectedSetId = null;
        localStorage.removeItem("selectedMCQSetId");
        mcqQuestionsList.innerHTML = `<p class="admin-empty-text">Select an MCQ set to view questions.</p>`;
    }
});

window.viewQuestions = viewQuestions;
window.deleteQuestion = deleteQuestion;
window.deleteMCQSet = deleteMCQSet;

document.addEventListener("DOMContentLoaded", loadMCQSets);