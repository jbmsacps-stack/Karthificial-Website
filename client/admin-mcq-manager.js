console.log("admin-mcq-manager.js loaded");
let chapterMap = {};
let editingQuestionId = null;
let importedQuestions = [];
const questionTableBody = document.getElementById("questionTableBody");
const saveQuestionBtn =
    document.getElementById("saveQuestionBtn");

// =========================
// ELEMENTS
// =========================

const fileInput = document.getElementById("mcqExcel");

const filePreview = document.getElementById("filePreview");

const fileName = document.getElementById("fileName");

const questionCount = document.getElementById("questionCount");

const previewBtn = document.getElementById("previewBtn");

const importBtn = document.getElementById("importBtn");

const previewBody = document.getElementById("previewBody");

const downloadTemplateBtn =
    document.getElementById("downloadTemplateBtn");

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

const refreshQuestionsBtn =
    document.getElementById("refreshQuestionsBtn");

// =========================
// INIT
// =========================

document.addEventListener("DOMContentLoaded", async () => {

    await loadBoards();

    await loadChapterMap();

    attachListeners();

    await loadQuestions();

});

async function loadBoards() {

    const { data, error } = await window.supabaseClient

        .from("boards")

        .select("id,name")

        .eq("is_active", true);

    console.log("Subject:", subjectSelect.value);
    console.log("Chapter:", chapterSelect.value);

    if (error) {

        console.error(error);

        return;

    }

    boardSelect.innerHTML =
        `<option value="">Select Board</option>`;

    data.forEach(board => {

        boardSelect.innerHTML += `
            <option value="${board.id}">
                ${board.name}
            </option>
        `;

    });

}

async function loadChapterMap() {

    const { data, error } = await window.supabaseClient
        .from("chapters")
        .select("id,title");

    if (error) {

        console.error(error);

        return;

    }

    chapterMap = {};

    data.forEach(chapter => {

        chapterMap[chapter.id] = chapter.title;

    });

}

async function loadClasses(boardId) {

    const { data, error } = await window.supabaseClient
        .from("classes")
        .select("id,name")
        .eq("board_id", Number(boardId))
        .eq("is_active", true);

    console.log(data);
    console.log(error);

    if (error) {

        console.error(error);

        return;

    }

    classSelect.innerHTML =
        `<option value="">Select Class</option>`;

    data.forEach(cls => {

        classSelect.innerHTML += `
            <option value="${cls.id}">
                ${cls.name}
            </option>
        `;

    });

}

async function loadSubjects(boardId, classId) {

    const { data, error } = await window.supabaseClient

        .from("subjects")

        .select("id,name")

        .eq("board_id", Number(boardId))

        .eq("class_id", Number(classId))

        .eq("is_active", true)

        .order("sort_order");

    console.log(data);
    console.log(error);

    if (error) {

        console.error(error);

        return;

    }

    subjectSelect.innerHTML =
        `<option value="">Select Subject</option>`;

    data.forEach(subject => {

        subjectSelect.innerHTML += `
            <option value="${subject.id}">
                ${subject.name}
            </option>
        `;

    });

}

async function loadChapters(subjectId) {

    const { data, error } = await window.supabaseClient

        .from("chapters")

        .select("id,title")

        .eq("subject_id", Number(subjectId))

        .eq("is_active", true)

        .order("sort_order");

    console.log(data);
    console.log(error);

    if (error) {

        console.error(error);

        return;

    }

    chapterSelect.innerHTML =
        `<option value="">Select Chapter</option>`;

    data.forEach(chapter => {

        if (chapter.title.trim().toLowerCase() === "all chapters") {

            return;

        }

        chapterSelect.innerHTML += `
            <option value="${chapter.id}">
                ${chapter.title}
            </option>
        `;

    });

}

async function addQuestion() {

    const { error } = await window.supabaseClient

        .from("mcq_questions")

        .insert({

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

    mcqForm.reset();

    subjectSelect.innerHTML =
        `<option value="">Select Subject</option>`;

    chapterSelect.innerHTML =
        `<option value="">Select Chapter</option>`;

    showToast("Question added successfully!");

    mcqForm.reset();
    editingQuestionId = null;

    saveQuestionBtn.textContent = "Add Question";

    await refreshQuestionBank();

    showToast("Question added successfully.");

}

function attachListeners() {

    boardSelect.addEventListener("change", async () => {

        await loadClasses(boardSelect.value);

        subjectSelect.innerHTML =
            `<option value="">Select Subject</option>`;

        chapterSelect.innerHTML =
            `<option value="">Select Chapter</option>`;

    });

    classSelect.addEventListener("change", async () => {

        await loadSubjects(
            boardSelect.value,
            classSelect.value
        );

        chapterSelect.innerHTML =
            `<option value="">Select Chapter</option>`;

    });

    subjectSelect.addEventListener("change", async () => {

        await loadChapters(subjectSelect.value);

    });

    mcqForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        if (editingQuestionId) {

            await updateQuestion();

        } else {

            await addQuestion();

        }

    });

    refreshQuestionsBtn.addEventListener("click", async () => {

        refreshQuestionsBtn.disabled = true;

        refreshQuestionsBtn.innerHTML =
            "⟳ Refreshing...";

        await loadQuestions();

        refreshQuestionsBtn.disabled = false;

        refreshQuestionsBtn.innerHTML =
            "↻ Refresh";

        showToast("Question Bank refreshed.");

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

    const { data, error } = await window.supabaseClient
        .from("mcq_questions")
        .select("*")
        .order("created_at", { ascending: false });

    console.log(data);
    console.log(error);

    if (error) {

        console.error(error);

        return;

    }

    questionTableBody.innerHTML = "";

    if (data.length === 0) {

        questionTableBody.innerHTML = `

            <tr>

                <td colspan="6">

                    No Questions Found

                </td>

            </tr>

        `;

        return;

    }

    data.forEach((question, index) => {

        questionTableBody.innerHTML += `

<tr>

    <td>${index + 1}</td>

    <td title="${chapterMap[question.chapter_id] ?? '-'}">
        ${chapterMap[question.chapter_id] ?? "-"}
    </td>

    <td>${question.question}</td>

    <td>${question.correct_option}</td>

    <td>${question.difficulty}</td>

    <td>

        <button
    class="btn-outline edit-btn"
    data-id="${question.id}">

    ✏ Edit

</button>

<button
    class="btn-outline delete-btn"
    data-id="${question.id}">

    🗑 Delete

</button>

    </td>

</tr>

`;

    });

    document.querySelectorAll(".edit-btn").forEach(button => {

        button.addEventListener("click", () => {

            editQuestion(button.dataset.id);

        });

    });

    document.querySelectorAll(".delete-btn").forEach(button => {

        button.addEventListener("click", () => {

            deleteQuestion(button.dataset.id);

        });

    });

}

window.editQuestion = async function (id) {

    // Get the question
    const { data: question, error } = await window.supabaseClient
        .from("mcq_questions")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    // Get subject details
    const { data: subject, error: subjectError } =
        await window.supabaseClient
            .from("subjects")
            .select("board_id,class_id")
            .eq("id", question.subject_id)
            .single();

    if (subjectError) {
        console.error(subjectError);
        return;
    }

    editingQuestionId = id;

    // Load Board
    boardSelect.value = subject.board_id;

    await loadClasses(subject.board_id);

    // Load Class
    classSelect.value = subject.class_id;

    await loadSubjects(
        subject.board_id,
        subject.class_id
    );

    // Load Subject
    subjectSelect.value = question.subject_id;

    await loadChapters(question.subject_id);

    // Load Chapter
    chapterSelect.value = question.chapter_id;

    // Fill form
    questionText.value = question.question;

    optionA.value = question.option_a;
    optionB.value = question.option_b;
    optionC.value = question.option_c;
    optionD.value = question.option_d;

    correctAnswer.value = question.correct_option;

    difficulty.value = question.difficulty;

    saveQuestionBtn.textContent = "Update Question";

    document.getElementById("mcqForm").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

};

// window.editQuestion = async function (id) {

//     alert("Edit clicked: " + id);

// };

async function deleteQuestion(id) {

    if (!confirm("Delete this question?")) return;

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

    showToast("Question deleted successfully.");

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

    editingQuestionId = null;

    saveQuestionBtn.textContent = "Add Question";

    mcqForm.reset();

    subjectSelect.innerHTML =
        `<option value="">Select Subject</option>`;

    chapterSelect.innerHTML =
        `<option value="">Select Chapter</option>`;

    showToast("Question updated.");

    await refreshQuestionBank();

    showToast("Question updated successfully.");

}

async function refreshQuestionBank() {

    refreshQuestionsBtn.disabled = true;

    refreshQuestionsBtn.innerHTML = "⟳ Refreshing...";

    await loadQuestions();

    refreshQuestionsBtn.disabled = false;

    refreshQuestionsBtn.innerHTML = "↻ Refresh";

}

async function handleFileSelect() {

    const file = fileInput.files[0];

    if (!file) return;

    filePreview.classList.add("show");

    fileName.textContent = file.name;

    questionCount.textContent = "Reading file...";

    const reader = new FileReader();

    reader.onload = function (e) {

        const workbook = XLSX.read(
            e.target.result,
            {
                type: "array"
            }
        );

        const sheet =
            workbook.Sheets[
            workbook.SheetNames[0]
            ];

        importedQuestions =
            XLSX.utils.sheet_to_json(sheet);

        questionCount.textContent =
            `${importedQuestions.length} Questions Detected`;

        importBtn.disabled = false;

    };

    reader.readAsArrayBuffer(file);

}

async function importQuestions() {

    console.log("Import started");

    if (importedQuestions.length === 0) {
        showToast("Choose a file first.");
        return;
    }

    const { data: subjects } = await window.supabaseClient
        .from("subjects")
        .select("id,name");

    const { data: chapters } = await window.supabaseClient
        .from("chapters")
        .select("id,title");

    const questions = importedQuestions.map(row => {

        const subject = subjects.find(s =>
            s.name.trim().toLowerCase() ===
            String(row.Subject).trim().toLowerCase()
        );

        const chapter = chapters.find(c =>
            c.title.trim().toLowerCase() ===
            String(row.Chapter).trim().toLowerCase()
        );

        if (!subject || !chapter) {

            console.warn(
                "Skipping row because Subject or Chapter was not found:",
                row
            );

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

    }).filter(Boolean);

    console.log(questions);

    const { data, error } = await window.supabaseClient
        .from("mcq_questions")
        .insert(questions)
        .select();

    console.log(data);
    console.log(error);

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

    await loadQuestions();

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

<td>${row.Question}</td>

<td>${row.Correct}</td>

<td>${row.Difficulty ?? "Medium"}</td>

</tr>

`;

    });

    document
        .getElementById("previewTable")
        .classList.add("show");

}

function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 10);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}