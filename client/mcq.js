console.log("mcq.js loaded");

// =========================
// ELEMENTS
// =========================

const subjectSelect = document.getElementById("subjectSelect");
const chapterContainer = document.getElementById("chapterContainer");

const questionCountInput = document.getElementById("questionCount");

const availableQuestions = document.getElementById("availableQuestions");

const selectAllBtn = document.getElementById("selectAllBtn");
const clearBtn = document.getElementById("clearBtn");

const plusBtn = document.getElementById("plusBtn");
const minusBtn = document.getElementById("minusBtn");

const startQuizBtn = document.getElementById("startQuizBtn");

const shuffleQuestions = document.getElementById("shuffleQuestions");
const shuffleOptions = document.getElementById("shuffleOptions");

// =========================
// PAGE LOAD
// =========================

document.addEventListener("DOMContentLoaded", async () => {

    await loadSubjects();

});

// =========================
// LOAD SUBJECTS
// =========================

async function loadSubjects() {

    const { data, error } = await supabase
        .from("mcq_questions")
        .select("subject");

    if (error) {

        console.error(error);
        return;

    }

    const subjects = [...new Set(data.map(item => item.subject))];

    subjectSelect.innerHTML = `<option value="">Select Subject</option>`;

    subjects.forEach(subject => {

        subjectSelect.innerHTML += `
            <option value="${subject}">
                ${subject}
            </option>
        `;

    });

}

// =========================
// LOAD CHAPTERS
// =========================

async function loadChapters(subject) {

    chapterContainer.innerHTML = "";

    const { data, error } = await supabase
        .from("mcq_questions")
        .select("chapter")
        .eq("subject", subject);

    if (error) {

        console.error(error);
        return;

    }

    const chapters = [...new Set(data.map(item => item.chapter))];

    chapters.forEach(chapter => {

        chapterContainer.innerHTML += `

        <label class="chapter-item">

            <input
                type="checkbox"
                value="${chapter}"
            >

            ${chapter}

        </label>

        `;

    });

    updateQuestionCount();

}

// =========================
// COUNT QUESTIONS
// =========================

async function updateQuestionCount() {

    const subject = subjectSelect.value;

    const selected = [
        ...chapterContainer.querySelectorAll("input:checked")
    ].map(c => c.value);

    if (!subject || selected.length === 0) {

        availableQuestions.textContent = "0 Questions Available";
        return;

    }

    const { count } = await supabase
        .from("mcq_questions")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("subject", subject)
        .in("chapter", selected);

    availableQuestions.textContent =
        `${count} Questions Available`;

}

// =========================
// SELECT ALL
// =========================

function selectAll() {

    chapterContainer
        .querySelectorAll("input")
        .forEach(c => c.checked = true);

    updateQuestionCount();

}

// =========================
// CLEAR
// =========================

function clearSelection() {

    chapterContainer
        .querySelectorAll("input")
        .forEach(c => c.checked = false);

    updateQuestionCount();

}

// =========================
// PLUS
// =========================

function increaseQuestions() {

    questionCountInput.value =
        Number(questionCountInput.value) + 1;

}

// =========================
// MINUS
// =========================

function decreaseQuestions() {

    if (Number(questionCountInput.value) > 1) {

        questionCountInput.value =
            Number(questionCountInput.value) - 1;

    }

}

// =========================
// START QUIZ
// =========================

async function startQuiz() {

    const subject = subjectSelect.value;

    const chapters = [

        ...chapterContainer.querySelectorAll("input:checked")

    ].map(c => c.value);

    if (!subject) {

        alert("Select Subject");
        return;

    }

    if (chapters.length === 0) {

        alert("Select Chapters");
        return;

    }

    const { data, error } = await supabase

        .from("mcq_questions")

        .select("*")

        .eq("subject", subject)

        .in("chapter", chapters);

    if (error) {

        console.error(error);
        return;

    }

    // Shuffle Questions

    if (shuffleQuestions.checked) {

        data.sort(() => Math.random() - 0.5);

    }

    // Limit Questions

    const questions = data.slice(
        0,
        Number(questionCountInput.value)
    );

    console.log(questions);

    alert(
        `${questions.length} Questions Loaded`
    );

    // NEXT:
    // open quiz screen

}

// =========================
// EVENTS
// =========================

subjectSelect.addEventListener("change", () => {

    loadChapters(subjectSelect.value);

});

chapterContainer.addEventListener("change", () => {

    updateQuestionCount();

});

selectAllBtn.addEventListener("click", selectAll);

clearBtn.addEventListener("click", clearSelection);

plusBtn.addEventListener("click", increaseQuestions);

minusBtn.addEventListener("click", decreaseQuestions);

startQuizBtn.addEventListener("click", startQuiz)