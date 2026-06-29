console.log("admin-mcq-manager.js loaded");

let chapterMap = {};
let editingQuestionId = null;
let importedQuestions = [];
let allQuestions = [];
let currentFilters = {
    board: "",
    class: "",
    subject: "",
    chapter: "",
    search: ""
};

// =========================
// ELEMENTS
// =========================

const questionTableBody = document.getElementById("questionTableBody");
const saveQuestionBtn = document.getElementById("saveQuestionBtn");
const fileInput = document.getElementById("mcqExcel");
const filePreview = document.getElementById("filePreview");
const fileName = document.getElementById("fileName");
const questionCount = document.getElementById("questionCount");
const previewBtn = document.getElementById("previewBtn");
const importBtn = document.getElementById("importBtn");
const previewBody = document.getElementById("previewBody");
const downloadTemplateBtn = document.getElementById("downloadTemplateBtn");
const questionText = document.getElementById("questionText");
const optionA = document.getElementById("optionA");
const optionB = document.getElementById("optionB");
const optionC = document.getElementById("optionC");
const optionD = document.getElementById("optionD");
const correctAnswer = document.getElementById("correctAnswer");
const difficulty = document.getElementById("difficulty");
const boardSelect = document.getElementById("boardSelect");
const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const chapterSelect = document.getElementById("chapterSelect");
const mcqForm = document.getElementById("mcqForm");
const refreshQuestionsBtn = document.getElementById("refreshQuestionsBtn");
const filterBoard = document.getElementById("filterBoard");
const filterClass = document.getElementById("filterClass");
const filterSubject = document.getElementById("filterSubject");
const filterChapter = document.getElementById("filterChapter");
const searchQuestion = document.getElementById("searchQuestion");
const previewTable = document.getElementById("previewTable");

// =========================
// INIT
// =========================

document.addEventListener("DOMContentLoaded", async () => {
    injectDashboardStyles();
    await loadBoards(boardSelect, "Select Board");
    await loadBoards(filterBoard, "All Boards");
    await loadChapterMap();
    attachListeners();
    await loadQuestions();
});

// =========================
// CORE HELPERS
// =========================

function injectDashboardStyles() {
    if (document.getElementById("admin-mcq-manager-analytics-styles")) return;

    const style = document.createElement("style");
    style.id = "admin-mcq-manager-analytics-styles";
    style.textContent = `
        .analytics-shell {
            margin-top: 22px;
            display: grid;
            gap: 16px;
        }
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 14px;
        }
        .analytics-card {
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.16), rgba(17, 17, 17, 0.95));
            border: 1px solid rgba(212, 175, 55, 0.28);
            border-radius: 14px;
            padding: 16px;
            color: #f8f5ef;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
            transform: translateY(6px);
            opacity: 0;
            animation: analyticsFadeIn 0.45s ease forwards;
        }
        .analytics-card .analytics-label {
            font-size: 0.84rem;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #d8c47d;
            margin-bottom: 8px;
        }
        .analytics-card .analytics-value {
            font-size: 1.7rem;
            font-weight: 700;
            color: #fff;
        }
        .analytics-card .analytics-meta {
            font-size: 0.82rem;
            color: #d2d2d2;
            margin-top: 6px;
        }
        .analytics-section {
            background: #181818;
            border: 1px solid rgba(212, 175, 55, 0.22);
            border-radius: 16px;
            padding: 18px;
            color: #f5f5f5;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
        }
        .analytics-section h3 {
            color: #f8f5ef;
            margin-bottom: 14px;
        }
        .analytics-list {
            display: grid;
            gap: 10px;
        }
        .analytics-list-item {
            padding: 12px;
            border-radius: 10px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(212, 175, 55, 0.14);
        }
        .analytics-list-item strong {
            color: #fff;
        }
        .progress-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 8px;
        }
        .progress-bar {
            flex: 1;
            height: 8px;
            border-radius: 999px;
            background: rgba(255,255,255,0.1);
            overflow: hidden;
        }
        .progress-bar > span {
            display: block;
            height: 100%;
            background: linear-gradient(90deg, #d4af37, #f0d36b);
            border-radius: inherit;
        }
        .chart-card {
            padding: 12px;
            border-radius: 12px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(212, 175, 55, 0.12);
        }
        .chart-card svg {
            width: 100%;
            height: 180px;
        }
        @keyframes analyticsFadeIn {
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function resetDependentFormSelects() {
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
}

function clearQuestionForm() {
    mcqForm.reset();
    editingQuestionId = null;
    saveQuestionBtn.textContent = "Add Question";
    resetDependentFormSelects();
}

// =========================
// SUPABASE LOADERS
// =========================

async function loadBoards(targetSelect = boardSelect, placeholderText = "Select Board") {
    if (!targetSelect) return;

    const { data, error } = await window.supabaseClient
        .from("boards")
        .select("id,name")
        .eq("is_active", true);

    if (error) {
        console.error(error);
        return;
    }

    targetSelect.innerHTML = `<option value="">${placeholderText}</option>`;

    (data || []).forEach((board) => {
        targetSelect.innerHTML += `<option value="${board.id}">${board.name}</option>`;
    });
}

async function loadChapterMap() {
    const { data, error } = await window.supabaseClient
        .from("chapters")
        .select("id,title")
        .eq("is_active", true);

    if (error) {
        console.error(error);
        return;
    }

    chapterMap = {};
    (data || []).forEach((chapter) => {
        chapterMap[chapter.id] = chapter.title;
    });
}

async function loadClasses(boardId, targetSelect = classSelect, placeholderText = "Select Class") {
    if (!targetSelect) return;

    targetSelect.innerHTML = `<option value="">${placeholderText}</option>`;

    if (!boardId) return;

    const { data, error } = await window.supabaseClient
        .from("classes")
        .select("id,name")
        .eq("board_id", Number(boardId))
        .eq("is_active", true);

    if (error) {
        console.error(error);
        return;
    }

    (data || []).forEach((cls) => {
        targetSelect.innerHTML += `<option value="${cls.id}">${cls.name}</option>`;
    });
}

async function loadSubjects(boardId, classId, targetSelect = subjectSelect, placeholderText = "Select Subject") {
    if (!targetSelect) return;

    targetSelect.innerHTML = `<option value="">${placeholderText}</option>`;

    if (!boardId || !classId) return;

    const { data, error } = await window.supabaseClient
        .from("subjects")
        .select("id,name")
        .eq("board_id", Number(boardId))
        .eq("class_id", Number(classId))
        .eq("is_active", true)
        .order("sort_order");

    if (error) {
        console.error(error);
        return;
    }

    (data || []).forEach((subject) => {
        targetSelect.innerHTML += `<option value="${subject.id}">${subject.name}</option>`;
    });
}

async function loadChapters(subjectId, targetSelect = chapterSelect, placeholderText = "Select Chapter") {
    if (!targetSelect) return;

    targetSelect.innerHTML = `<option value="">${placeholderText}</option>`;

    if (!subjectId) return;

    const { data, error } = await window.supabaseClient
        .from("chapters")
        .select("id,title")
        .eq("subject_id", Number(subjectId))
        .eq("is_active", true)
        .order("sort_order");

    if (error) {
        console.error(error);
        return;
    }

    (data || []).forEach((chapter) => {
        if (chapter.title?.trim().toLowerCase() === "all chapters") return;
        targetSelect.innerHTML += `<option value="${chapter.id}">${chapter.title}</option>`;
    });
}

// =========================
// QUESTION BANK FILTERS
// =========================

function applyFilters() {
    const searchText = currentFilters.search.trim().toLowerCase();

    const filteredQuestions = allQuestions.filter((question) => {
        const boardMatches = !currentFilters.board || String(question.board_id) === currentFilters.board;
        const classMatches = !currentFilters.class || String(question.class_id) === currentFilters.class;
        const subjectMatches = !currentFilters.subject || String(question.subject_id) === currentFilters.subject;
        const chapterMatches = !currentFilters.chapter || String(question.chapter_id) === currentFilters.chapter;

        const haystack = [
            question.question,
            question.chapterName,
            question.subjectName,
            question.className,
            question.boardName
        ].join(" ").toLowerCase();

        const searchMatches = !searchText || haystack.includes(searchText);
        return boardMatches && classMatches && subjectMatches && chapterMatches && searchMatches;
    });

    renderQuestions(filteredQuestions);
}

function renderQuestions(questions) {
    questionTableBody.innerHTML = "";

    if (!questions.length) {
        questionTableBody.innerHTML = `
            <tr>
                <td colspan="6">No Questions Found</td>
            </tr>
        `;
        return;
    }

    questions.forEach((question, index) => {
        questionTableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td title="${escapeHtml(question.chapterName)}">${escapeHtml(question.chapterName)}</td>
                <td>${escapeHtml(question.question)}</td>
                <td>${escapeHtml(question.correct_option)}</td>
                <td>${escapeHtml(question.difficulty)}</td>
                <td>
                    <button class="btn-outline edit-btn" data-id="${question.id}">✏ Edit</button>
                    <button class="btn-outline delete-btn" data-id="${question.id}">🗑 Delete</button>
                </td>
            </tr>
        `;
    });

    document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", () => {
            editQuestion(button.dataset.id);
        });
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", () => {
            deleteQuestion(button.dataset.id);
        });
    });
}

// =========================
// QUESTION BANK CRUD
// =========================

async function addQuestion() {
    const { error } = await window.supabaseClient.from("mcq_questions").insert({
        subject_id: Number(subjectSelect.value),
        chapter_id: Number(chapterSelect.value),
        question: questionText.value.trim(),
        option_a: optionA.value.trim(),
        option_b: optionB.value.trim(),
        option_c: optionC.value.trim(),
        option_d: optionD.value.trim(),
        correct_option: correctAnswer.value,
        explanation: "",
        difficulty: difficulty.value,
        is_active: true
    });

    if (error) {
        console.error(error);
        showToast(error.message);
        return;
    }

    clearQuestionForm();
    showToast("Question added successfully.");
    await refreshQuestionBank();
}

function attachListeners() {
    boardSelect.addEventListener("change", async () => {
        await loadClasses(boardSelect.value, classSelect, "Select Class");
        resetDependentFormSelects();
    });

    classSelect.addEventListener("change", async () => {
        await loadSubjects(boardSelect.value, classSelect.value, subjectSelect, "Select Subject");
        chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
    });

    subjectSelect.addEventListener("change", async () => {
        await loadChapters(subjectSelect.value, chapterSelect, "Select Chapter");
    });

    filterBoard.addEventListener("change", async () => {
        currentFilters.board = filterBoard.value;
        currentFilters.class = "";
        currentFilters.subject = "";
        currentFilters.chapter = "";
        await loadClasses(filterBoard.value, filterClass, "All Classes");
        filterSubject.innerHTML = '<option value="">All Subjects</option>';
        filterChapter.innerHTML = '<option value="">All Chapters</option>';
        applyFilters();
    });

    filterClass.addEventListener("change", async () => {
        currentFilters.class = filterClass.value;
        currentFilters.subject = "";
        currentFilters.chapter = "";
        await loadSubjects(filterBoard.value, filterClass.value, filterSubject, "All Subjects");
        filterChapter.innerHTML = '<option value="">All Chapters</option>';
        applyFilters();
    });

    filterSubject.addEventListener("change", async () => {
        currentFilters.subject = filterSubject.value;
        currentFilters.chapter = "";
        await loadChapters(filterSubject.value, filterChapter, "All Chapters");
        applyFilters();
    });

    filterChapter.addEventListener("change", () => {
        currentFilters.chapter = filterChapter.value;
        applyFilters();
    });

    searchQuestion.addEventListener("input", () => {
        currentFilters.search = searchQuestion.value;
        applyFilters();
    });

    mcqForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (editingQuestionId) {
            await updateQuestion();
        } else {
            await addQuestion();
        }
    });

    refreshQuestionsBtn.addEventListener("click", async () => {
        refreshQuestionsBtn.disabled = true;
        refreshQuestionsBtn.innerHTML = "⟳ Refreshing...";
        await refreshQuestionBank();
        refreshQuestionsBtn.disabled = false;
        refreshQuestionsBtn.innerHTML = "↻ Refresh";
    });

    downloadTemplateBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = "assets/templates/mcq_template.csv";
        link.download = "mcq_template.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    fileInput.addEventListener("change", handleFileSelect);
    importBtn.addEventListener("click", importQuestions);
    previewBtn.addEventListener("click", previewQuestions);
}

async function loadQuestions() {
    try {
        const { data: questionData, error: questionError } = await window.supabaseClient
            .from("mcq_questions")
            .select("id,question,correct_option,difficulty,subject_id,chapter_id,created_at,is_active")
            .order("created_at", { ascending: false });

        if (questionError) {
            throw questionError;
        }

        const { data: subjectsData = [], error: subjectsError } = await window.supabaseClient
            .from("subjects")
            .select("id,name,class_id,board_id,is_active")
            .eq("is_active", true);

        if (subjectsError) {
            console.warn("Subjects data unavailable.", subjectsError.message);
        }

        const { data: chaptersData = [], error: chaptersError } = await window.supabaseClient
            .from("chapters")
            .select("id,title,subject_id,is_active")
            .eq("is_active", true);

        if (chaptersError) {
            console.warn("Chapters data unavailable.", chaptersError.message);
        }

        const { data: classesData = [], error: classesError } = await window.supabaseClient
            .from("classes")
            .select("id,name,board_id,is_active")
            .eq("is_active", true);

        if (classesError) {
            console.warn("Classes data unavailable.", classesError.message);
        }

        const { data: boardsData = [], error: boardsError } = await window.supabaseClient
            .from("boards")
            .select("id,name,is_active")
            .eq("is_active", true);

        if (boardsError) {
            console.warn("Boards data unavailable.", boardsError.message);
        }

        const subjectLookup = Object.fromEntries((subjectsData || []).map((subject) => [subject.id, subject]));
        const chapterLookup = Object.fromEntries((chaptersData || []).map((chapter) => [chapter.id, chapter]));
        const classLookup = Object.fromEntries((classesData || []).map((cls) => [cls.id, cls]));
        const boardLookup = Object.fromEntries((boardsData || []).map((board) => [board.id, board]));

        chapterMap = {};
        (chaptersData || []).forEach((chapter) => {
            chapterMap[chapter.id] = chapter.title;
        });

        allQuestions = (questionData || []).map((question) => {
            const subject = subjectLookup[question.subject_id] || {};
            const chapter = chapterLookup[question.chapter_id] || {};
            const cls = classLookup[subject.class_id] || {};
            const board = boardLookup[subject.board_id] || {};

            return {
                ...question,
                subjectName: subject.name || "-",
                chapterName: chapter.title || chapterMap[question.chapter_id] || "-",
                className: cls.name || "-",
                boardName: board.name || "-",
                board_id: subject.board_id || null,
                class_id: subject.class_id || null
            };
        });

        applyFilters();
        await renderDashboardAnalytics();
    } catch (error) {
        console.error(error);
        questionTableBody.innerHTML = `<tr><td colspan="6">Unable to load questions.</td></tr>`;
        showToast("Unable to load question bank.");
    }
}

window.editQuestion = async function (id) {
    const { data: question, error } = await window.supabaseClient
        .from("mcq_questions")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    const { data: subject, error: subjectError } = await window.supabaseClient
        .from("subjects")
        .select("board_id,class_id")
        .eq("id", question.subject_id)
        .single();

    if (subjectError) {
        console.error(subjectError);
        return;
    }

    editingQuestionId = id;

    boardSelect.value = subject.board_id;
    await loadClasses(subject.board_id, classSelect, "Select Class");
    classSelect.value = subject.class_id;
    await loadSubjects(subject.board_id, subject.class_id, subjectSelect, "Select Subject");
    subjectSelect.value = question.subject_id;
    await loadChapters(question.subject_id, chapterSelect, "Select Chapter");
    chapterSelect.value = question.chapter_id;

    questionText.value = question.question;
    optionA.value = question.option_a;
    optionB.value = question.option_b;
    optionC.value = question.option_c;
    optionD.value = question.option_d;
    correctAnswer.value = question.correct_option;
    difficulty.value = question.difficulty;

    saveQuestionBtn.textContent = "Update Question";
    document.getElementById("mcqForm").scrollIntoView({ behavior: "smooth", block: "start" });
};

async function deleteQuestion(id) {
    if (!window.confirm("Delete this question?")) return;

    const { error } = await window.supabaseClient
        .from("mcq_questions")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        showToast("Failed to delete.");
        return;
    }

    showToast("Question deleted.");
    await refreshQuestionBank();
}

async function updateQuestion() {
    const { error } = await window.supabaseClient
        .from("mcq_questions")
        .update({
            subject_id: Number(subjectSelect.value),
            chapter_id: Number(chapterSelect.value),
            question: questionText.value.trim(),
            option_a: optionA.value.trim(),
            option_b: optionB.value.trim(),
            option_c: optionC.value.trim(),
            option_d: optionD.value.trim(),
            correct_option: correctAnswer.value,
            difficulty: difficulty.value
        })
        .eq("id", editingQuestionId);

    if (error) {
        console.error(error);
        showToast("Update failed.");
        return;
    }

    clearQuestionForm();
    showToast("Question updated.");
    await refreshQuestionBank();
}

async function refreshQuestionBank() {
    refreshQuestionsBtn.disabled = true;
    refreshQuestionsBtn.innerHTML = "⟳ Refreshing...";
    await loadQuestions();
    refreshQuestionsBtn.disabled = false;
    refreshQuestionsBtn.innerHTML = "↻ Refresh";
    showToast("Question Bank refreshed.");
}

// =========================
// IMPORT / PREVIEW FLOW
// =========================

async function handleFileSelect() {
    const file = fileInput.files[0];
    if (!file) return;

    filePreview.classList.add("show");
    fileName.textContent = file.name;
    questionCount.textContent = "Reading file...";

    const reader = new FileReader();
    reader.onload = function (event) {
        const workbook = XLSX.read(event.target.result, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        importedQuestions = XLSX.utils.sheet_to_json(sheet);
        questionCount.textContent = `${importedQuestions.length} Questions Detected`;
        importBtn.disabled = false;
    };

    reader.readAsArrayBuffer(file);
}

async function importQuestions() {
    if (importedQuestions.length === 0) {
        showToast("Choose a file first.");
        return;
    }

    const { data: subjects = [] } = await window.supabaseClient.from("subjects").select("id,name");
    const { data: chapters = [] } = await window.supabaseClient.from("chapters").select("id,title");

    const questions = importedQuestions
        .map((row) => {
            const subject = (subjects || []).find((entry) => entry.name?.trim().toLowerCase() === String(row.Subject || "").trim().toLowerCase());
            const chapter = (chapters || []).find((entry) => entry.title?.trim().toLowerCase() === String(row.Chapter || "").trim().toLowerCase());

            if (!subject || !chapter) {
                console.warn("Skipping row because Subject or Chapter was not found:", row);
                return null;
            }

            return {
                subject_id: subject.id,
                chapter_id: chapter.id,
                question: String(row.Question || "").trim(),
                option_a: String(row["Option A"] || "").trim(),
                option_b: String(row["Option B"] || "").trim(),
                option_c: String(row["Option C"] || "").trim(),
                option_d: String(row["Option D"] || "").trim(),
                correct_option: String(row.Correct || "").trim(),
                difficulty: String(row.Difficulty || "Medium").trim(),
                explanation: String(row.Explanation || "").trim(),
                is_active: true
            };
        })
        .filter(Boolean);

    const { error } = await window.supabaseClient.from("mcq_questions").insert(questions).select();

    if (error) {
        console.error(error);
        showToast(error.message);
        return;
    }

    showToast(`${questions.length} Questions Imported Successfully.`);
    importedQuestions = [];
    fileInput.value = "";
    filePreview.classList.remove("show");
    previewTable.classList.remove("show");
    await refreshQuestionBank();
}

function previewQuestions() {
    if (importedQuestions.length === 0) {
        showToast("Please choose a file first.");
        return;
    }

    previewBody.innerHTML = "";
    importedQuestions.slice(0, 10).forEach((row, index) => {
        previewBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(row.Question || "")}</td>
                <td>${escapeHtml(row.Correct || "")}</td>
                <td>${escapeHtml(row.Difficulty || "Medium")}</td>
            </tr>
        `;
    });

    previewTable.classList.add("show");
}

// =========================
// TOASTS
// =========================

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast.hideTimer);

    toast.hideTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// =========================
// ANALYTICS DASHBOARD
// =========================

async function renderDashboardAnalytics() {
    const analyticsHost = document.getElementById("analyticsHost");
    if (analyticsHost) {
        analyticsHost.remove();
    }

    const questionBankCard = document.querySelector("#refreshQuestionsBtn")?.closest(".admin-card");
    if (!questionBankCard) return;

    const shell = document.createElement("div");
    shell.id = "analyticsHost";
    shell.className = "analytics-shell";

    const stats = {
        totalQuestions: allQuestions.length,
        totalSubjects: new Set(allQuestions.map((question) => question.subjectName)).size,
        totalChapters: new Set(allQuestions.map((question) => question.chapterName)).size,
        easy: allQuestions.filter((question) => String(question.difficulty).toLowerCase() === "easy").length,
        medium: allQuestions.filter((question) => String(question.difficulty).toLowerCase() === "medium").length,
        hard: allQuestions.filter((question) => String(question.difficulty).toLowerCase() === "hard").length
    };

    shell.innerHTML = `
        <div class="analytics-section">
            <h3>📊 Question Analytics</h3>
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="analytics-label">📚 Total Questions</div>
                    <div class="analytics-value">${stats.totalQuestions}</div>
                    <div class="analytics-meta">Live from question bank</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-label">📖 Total Subjects</div>
                    <div class="analytics-value">${stats.totalSubjects}</div>
                    <div class="analytics-meta">Distinct subjects in current bank</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-label">📑 Total Chapters</div>
                    <div class="analytics-value">${stats.totalChapters}</div>
                    <div class="analytics-meta">Tracked chapter coverage</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-label">🟢 Easy Questions</div>
                    <div class="analytics-value">${stats.easy}</div>
                    <div class="analytics-meta">Simpler recall items</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-label">🟡 Medium Questions</div>
                    <div class="analytics-value">${stats.medium}</div>
                    <div class="analytics-meta">Balanced practice mix</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-label">🔴 Hard Questions</div>
                    <div class="analytics-value">${stats.hard}</div>
                    <div class="analytics-meta">Advanced challenge set</div>
                </div>
            </div>
        </div>
    `;

    questionBankCard.insertAdjacentElement("afterend", shell);
}


// <div class="analytics-section">
//     <h3>🎓 Student Performance Analysis</h3>
//     <div class="analytics-list">
//         ${await renderStudentPerformanceSections()}
//     </div>
// </div>

async function renderStudentPerformanceSections() {
    // These analytics queries assume student-centric tables such as student_mcq_attempts,
    // student_test_results and student_profiles when present. If a table is missing, the UI
    // falls back to an empty state and keeps the admin experience intact.

    const performanceData = await fetchStudentPerformanceData();

    if (!performanceData || !performanceData.students.length) {
        return `
            <div class="analytics-list-item">
                <strong>No student performance data available yet.</strong>
                <div class="analytics-meta">The dashboard will populate automatically once the relevant Supabase tables contain records.</div>
            </div>
        `;
    }

    const topStudents = [...performanceData.students]
        .sort((a, b) => (Number(b.averageScore) || 0) - (Number(a.averageScore) || 0))
        .slice(0, 5);

    const attentionStudents = performanceData.students.filter((student) => Number(student.accuracy) < 40).slice(0, 5);
    const difficultChapters = [...performanceData.chapterStats]
        .sort((a, b) => (Number(a.averageScore) || 100) - (Number(b.averageScore) || 100))
        .slice(0, 5);
    const missedQuestions = [...performanceData.missedQuestions].slice(0, 10);
    const subjectPerformance = [...performanceData.subjectStats].slice(0, 8);
    const weeklyTrend = performanceData.weeklyTrend || [];

    const topStudentsMarkup = topStudents.length ? topStudents.map((student) => `
        <div class="analytics-list-item">
            <strong>${escapeHtml(student.name || "Unnamed Student")}</strong>
            <div class="analytics-meta">Class: ${escapeHtml(student.className || "-")} • Avg Score: ${Number(student.averageScore || 0).toFixed(0)} • Accuracy: ${Number(student.accuracy || 0).toFixed(0)}% • Tests: ${Number(student.totalTests || 0)}</div>
        </div>
    `).join("") : '<div class="analytics-list-item"><strong>No top performers yet.</strong></div>';

    const attentionMarkup = attentionStudents.length ? attentionStudents.map((student) => `
        <div class="analytics-list-item">
            <strong>${escapeHtml(student.name || "Unnamed Student")}</strong>
            <div class="analytics-meta">Class: ${escapeHtml(student.className || "-")} • Weak Subject: ${escapeHtml(student.weakSubject || "-")} • Weak Chapter: ${escapeHtml(student.weakChapter || "-")} • Suggested Action: ${escapeHtml(student.suggestedAction || "Review missed concepts")}</div>
        </div>
    `).join("") : '<div class="analytics-list-item"><strong>No students need attention right now.</strong></div>';

    const difficultMarkup = difficultChapters.length ? difficultChapters.map((chapter, index) => `
        <div class="analytics-list-item">
            <strong>${index + 1}. ${escapeHtml(chapter.name || "Chapter")}</strong>
            <div class="analytics-meta">Average Score: ${Number(chapter.averageScore || 0).toFixed(0)}%</div>
        </div>
    `).join("") : '<div class="analytics-list-item"><strong>No chapter difficulty data yet.</strong></div>';

    const missedMarkup = missedQuestions.length ? missedQuestions.map((question) => `
        <div class="analytics-list-item">
            <strong>${escapeHtml(question.question || "Question")}</strong>
            <div class="analytics-meta">Subject: ${escapeHtml(question.subject || "-")} • Chapter: ${escapeHtml(question.chapter || "-")} • Wrong Answer: ${Number(question.wrongPercent || 0).toFixed(0)}% • Attempts: ${Number(question.timesAttempted || 0)}</div>
        </div>
    `).join("") : '<div class="analytics-list-item"><strong>No missed question data yet.</strong></div>';

    const subjectMarkup = subjectPerformance.length ? subjectPerformance.map((subject) => `
        <div class="analytics-list-item">
            <div class="progress-row">
                <strong>${escapeHtml(subject.name || "Subject")}</strong>
                <span>${Number(subject.averageScore || 0).toFixed(0)}%</span>
            </div>
            <div class="progress-bar"><span style="width:${Math.max(4, Number(subject.averageScore || 0))}%"></span></div>
        </div>
    `).join("") : '<div class="analytics-list-item"><strong>No subject progress data yet.</strong></div>';

    const weeklyMarkup = weeklyTrend.length ? buildWeeklyTrendChart(weeklyTrend) : '<div class="chart-card"><strong>No weekly trend data yet.</strong></div>';

    return `
        <div class="analytics-list-item">
            <strong>🏆 Top Performing Students</strong>
            <div class="analytics-meta">Top 5 by average score</div>
            ${topStudentsMarkup}
        </div>
        <div class="analytics-list-item">
            <strong>⚠ Students Needing Attention</strong>
            <div class="analytics-meta">Accuracy below 40%</div>
            ${attentionMarkup}
        </div>
        <div class="analytics-list-item">
            <strong>📉 Most Difficult Chapters</strong>
            ${difficultMarkup}
        </div>
        <div class="analytics-list-item">
            <strong>📊 Most Missed Questions</strong>
            ${missedMarkup}
        </div>
        <div class="analytics-list-item">
            <strong>🎯 Subject Performance</strong>
            ${subjectMarkup}
        </div>
        <div class="analytics-list-item">
            <strong>📈 Weekly Performance Trend</strong>
            ${weeklyMarkup}
        </div>
    `;
}

async function fetchStudentPerformanceData() {
    const fallback = { students: [], chapterStats: [], missedQuestions: [], subjectStats: [], weeklyTrend: [] };

    try {
        const studentsResponse = await window.supabaseClient.from("student_profiles").select("*");
        if (studentsResponse.error) {
            console.warn("student_profiles is unavailable.", studentsResponse.error.message);
        }

        const resultsResponse = await window.supabaseClient.from("student_test_results").select("*");
        if (resultsResponse.error) {
            console.warn("student_test_results is unavailable.", resultsResponse.error.message);
        }

        const attemptsResponse = await window.supabaseClient.from("student_mcq_attempts").select("*");
        if (attemptsResponse.error) {
            console.warn("student_mcq_attempts is unavailable.", attemptsResponse.error.message);
        }

        const students = buildStudentSummary(studentsResponse.data || [], resultsResponse.data || []);
        const chapterStats = buildChapterStats(resultsResponse.data || []);
        const missedQuestions = buildMissedQuestions(attemptsResponse.data || []);
        const subjectStats = buildSubjectStats(resultsResponse.data || []);
        const weeklyTrend = buildWeeklyTrend(resultsResponse.data || []);

        return { students, chapterStats, missedQuestions, subjectStats, weeklyTrend };
    } catch (error) {
        console.warn("Student analytics unavailable.", error);
        return fallback;
    }
}

function buildStudentSummary(profileRows = [], resultRows = []) {
    const rows = resultRows.length ? resultRows : profileRows;
    return rows.map((row) => ({
        name: pickValue(row, ["name", "student_name", "full_name", "student_full_name", "studentName"]),
        className: pickValue(row, ["class", "class_name", "student_class", "className"]),
        averageScore: Number(pickValue(row, ["average_score", "averageScore", "score", "marks", "total_score"]) || 0),
        accuracy: Number(pickValue(row, ["accuracy", "accuracy_percentage", "percent_correct", "correct_percentage"]) || 0),
        totalTests: Number(pickValue(row, ["total_tests", "tests", "attempts", "test_count"]) || 0),
        weakSubject: pickValue(row, ["weak_subject", "weakSubject", "lowest_subject"]),
        weakChapter: pickValue(row, ["weak_chapter", "weakChapter", "lowest_chapter"]),
        suggestedAction: pickValue(row, ["suggested_action", "suggestedAction", "action"])
    }));
}

function buildChapterStats(resultRows = []) {
    const grouped = new Map();

    resultRows.forEach((row) => {
        const chapterName = pickValue(row, ["chapter", "chapter_name", "weak_chapter", "chapterName"]);
        if (!chapterName) return;
        const score = Number(pickValue(row, ["average_score", "averageScore", "score", "marks"]) || 0);
        const current = grouped.get(chapterName) || { name: chapterName, total: 0, count: 0 };
        current.total += score;
        current.count += 1;
        grouped.set(chapterName, current);
    });

    return Array.from(grouped.values()).map((item) => ({
        name: item.name,
        averageScore: item.count ? item.total / item.count : 0
    }));
}

function buildMissedQuestions(attemptRows = []) {
    const grouped = new Map();

    attemptRows.forEach((row) => {
        const questionId = row.question_id || row.questionId || row.id;
        if (!questionId) return;
        const current = grouped.get(questionId) || {
            question: pickValue(row, ["question", "question_text", "questionText"]),
            subject: pickValue(row, ["subject", "subject_name", "subjectName"]),
            chapter: pickValue(row, ["chapter", "chapter_name", "chapterName"]),
            timesAttempted: 0,
            wrongCount: 0
        };
        current.timesAttempted += 1;
        const isCorrect = String(pickValue(row, ["is_correct", "isCorrect", "correct"]) || "").toLowerCase();
        if (isCorrect !== "true" && isCorrect !== "1" && isCorrect !== "yes") {
            current.wrongCount += 1;
        }
        grouped.set(questionId, current);
    });

    return Array.from(grouped.values())
        .map((item) => ({
            ...item,
            wrongPercent: item.timesAttempted ? (item.wrongCount / item.timesAttempted) * 100 : 0
        }))
        .sort((a, b) => Number(b.wrongPercent) - Number(a.wrongPercent));
}

function buildSubjectStats(resultRows = []) {
    const grouped = new Map();

    resultRows.forEach((row) => {
        const subjectName = pickValue(row, ["subject", "subject_name", "subjectName"]);
        if (!subjectName) return;
        const score = Number(pickValue(row, ["average_score", "averageScore", "score", "marks"]) || 0);
        const current = grouped.get(subjectName) || { name: subjectName, total: 0, count: 0 };
        current.total += score;
        current.count += 1;
        grouped.set(subjectName, current);
    });

    return Array.from(grouped.values()).map((item) => ({
        name: item.name,
        averageScore: item.count ? item.total / item.count : 0
    }));
}

function buildWeeklyTrend(resultRows = []) {
    const grouped = new Map();

    resultRows.forEach((row) => {
        const weekKey = pickValue(row, ["week", "week_label", "weekLabel"]) || "Current Week";
        const score = Number(pickValue(row, ["average_score", "averageScore", "score", "marks"]) || 0);
        const current = grouped.get(weekKey) || { week: weekKey, total: 0, count: 0 };
        current.total += score;
        current.count += 1;
        grouped.set(weekKey, current);
    });

    return Array.from(grouped.values())
        .map((item) => ({ week: item.week, average: item.count ? item.total / item.count : 0 }))
        .sort((a, b) => String(a.week).localeCompare(String(b.week)));
}

function buildWeeklyTrendChart(weeklyTrend) {
    const maxValue = Math.max(1, ...weeklyTrend.map((item) => Number(item.average) || 0));
    const points = weeklyTrend.map((item, index) => {
        const value = Number(item.average) || 0;
        const x = (index / Math.max(1, weeklyTrend.length - 1)) * 100;
        const y = 100 - (value / maxValue) * 70;
        return `${x},${y}`;
    });

    return `
        <div class="chart-card">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline fill="none" stroke="#d4af37" stroke-width="2.2" points="${points.join(" ")}" />
                ${weeklyTrend.map((item, index) => {
        const value = Number(item.average) || 0;
        const x = (index / Math.max(1, weeklyTrend.length - 1)) * 100;
        const y = 100 - (value / maxValue) * 70;
        return `<circle cx="${x}" cy="${y}" r="1.8" fill="#fff" />`;
    }).join("")}
            </svg>
            <div class="analytics-meta">Average score per week from Supabase data</div>
        </div>
    `;
}

function pickValue(row = {}, candidates = []) {
    for (const candidate of candidates) {
        if (row[candidate] !== undefined && row[candidate] !== null && row[candidate] !== "") {
            return row[candidate];
        }
    }
    return "";
}