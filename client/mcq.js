console.log('mcq.js loaded');
let questions = [];
let currentQuestion = 0;
let score = 0;
let selectedAnswers = [];

// Elements
const subjectSelect = document.getElementById('subjectSelect');
const boardSelect = document.getElementById("boardSelect");
const classSelect = document.getElementById("classSelect");
const chapterContainer = document.getElementById('chapterContainer');
const questionCountInput = document.getElementById('questionCount');
const availableQuestions = document.getElementById('availableQuestions');
const selectAllBtn = document.getElementById('selectAllBtn');
const clearBtn = document.getElementById('clearBtn');
const startQuizBtn = document.getElementById('startQuizBtn');
const shuffleQuestions = document.getElementById('shuffleQuestions');
const shuffleOptions = document.getElementById('shuffleOptions');
const quizProgress = document.getElementById("quizProgress");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const mcqSetup = document.getElementById("mcq-setup");
const mcqQuiz = document.getElementById("mcq-quiz");


// Guard against duplicate initialization
if (!window._mcqInitialized) {
    window._mcqInitialized = true;
    (async function init() {
        try {
            await waitForSupabase(5000);
            await loadBoards();
            await restoreSelections();
            attachListeners();
        } catch (err) {
            console.error('MCQ init error:', err);
            showMessage('Failed to initialize MCQ. Try reloading the page.');
        }
    })();
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function waitForSupabase(timeout = 5000) {
    const start = Date.now();
    while (!window.supabaseClient) {
        if (Date.now() - start > timeout) throw new Error('Supabase client not available');
        await wait(100);
    }
}

function showMessage(text, type = 'error') {
    let el = document.querySelector('.mcq-error');
    if (!el) {
        el = document.createElement('div');
        el.className = 'mcq-error';
        const card = document.querySelector('.mcq-card');
        card.insertBefore(el, card.firstChild.nextSibling);
    }
    el.textContent = text;
    el.style.color = type === 'error' ? '#ffb4b4' : '#d4af37';
    el.style.margin = '8px 0 16px';
}

function clearMessage() {
    const el = document.querySelector('.mcq-error');
    if (el) el.remove();
}

async function loadBoards() {

    const { data, error } = await window.supabaseClient
        .from("boards")
        .select("id,name")
        .eq("is_active", true);

    if (error) {
        console.error(error);
        return;
    }

    boardSelect.innerHTML =
        '<option value="">Select Board</option>';

    data.forEach(board => {

        boardSelect.innerHTML += `
            <option value="${board.id}">
                ${board.name}
            </option>
        `;

    });

}

async function loadClasses(boardId) {

    const { data, error } = await window.supabaseClient
        .from("classes")
        .select("id,name")
        .eq("board_id", boardId)
        .eq("is_active", true);

    if (error) {
        console.error(error);
        return;
    }

    classSelect.innerHTML =
        '<option value="">Select Class</option>';

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
        .eq("board_id", boardId)
        .eq("class_id", classId)
        .eq("is_active", true)
        .order("sort_order");

    if (error) {
        console.error(error);
        return;
    }

    subjectSelect.innerHTML =
        '<option value="">Select Subject</option>';

    data.forEach(subject => {

        subjectSelect.innerHTML += `
            <option value="${subject.id}">
                ${subject.name}
            </option>
        `;

    });

}

async function updateQuestionCount() {
    clearMessage();
    const subject = subjectSelect.value;
    const selected = Array.from(chapterContainer.querySelectorAll('input:checked')).map(i => i.value);
    if (!subject || selected.length === 0) {
        availableQuestions.textContent = '0 Questions Available';
        window._availableQuestions = 0;
        return;
    }
    try {
        const client = window.supabaseClient;
        const res = await client

            .from("mcq_questions")

            .select("*", { head: true, count: "exact" })

            .eq("subject_id", Number(subject))

            .in("chapter_id", selected.map(Number));
        const count = res.count || 0;
        window._availableQuestions = count;
        availableQuestions.textContent = `${count} Questions Available`;
        // Ensure requested count does not exceed available
        const requested = Number(questionCountInput.value) || 1;
        if (count < requested) questionCountInput.value = Math.max(1, count);
    } catch (err) {
        console.error(err);
        showToast("Unable to count questions.", "error");
    }
}

function selectAll() {
    chapterContainer.querySelectorAll('input').forEach(i => i.checked = true);
    updateQuestionCount();
}

function clearSelection() {
    chapterContainer.querySelectorAll('input').forEach(i => i.checked = false);
    updateQuestionCount();
}

// function increaseQuestions() {

//     console.log("PLUS CLICKED");

//     let value = parseInt(questionCountInput.value, 10) || 1;

//     questionCountInput.value = value + 1;

// }

// function decreaseQuestions() {

//     let value = parseInt(questionCountInput.value, 10) || 1;

//     if (value > 1) {

//         questionCountInput.value = value - 1;

//     }

// }

function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

async function startQuiz() {

    console.log("START QUIZ CLICKED");

    clearMessage();

    const subject = subjectSelect.value;

    const chapters = Array.from(
        chapterContainer.querySelectorAll("input:checked")
    ).map(i => i.value);

    console.log("Subject:", subject);
    console.log("Chapters:", chapters);

    if (!subject) {
        showToast("Please select a subject.", "warning");
        return;
    }

    if (chapters.length === 0) {
        showToast("Select at least one chapter.", "warning");
        return;
    }

    const client = window.supabaseClient;

    const { data, error } = await client

        .from("mcq_questions")

        .select("*")

        .eq("subject_id", Number(subject))

        .in("chapter_id", chapters.map(Number));

    console.log("Data:", data);
    console.log("Error:", error);

    if (error) {
        console.error(error);
        return;
    }

    questions = data || [];

    if (shuffleQuestions.checked) {
        questions.sort(() => Math.random() - 0.5);
    }

    questions = questions.slice(
        0,
        Number(questionCountInput.value)
    );

    console.log("Questions:", questions);

    sessionStorage.setItem(
        "mcqQuestions",
        JSON.stringify(questions)
    );

    sessionStorage.setItem(
        "currentQuestion",
        "0"
    );

    sessionStorage.setItem(
        "userAnswers",
        JSON.stringify([])
    );

    mcqSetup.classList.add("hidden");
    mcqQuiz.classList.remove("hidden");

    console.log("Opening Quiz");

    loadQuestion();

}

function shuffleQuestionOptions(q) {
    try {
        const keys = ['option_a', 'option_b', 'option_c', 'option_d'];
        const opts = keys.map(k => ({ key: k, text: q[k] }));
        // Preserve original correct key if possible
        let originalKey = null;
        if (q.correct_option) {
            const co = String(q.correct_option).toLowerCase();
            if (co.length === 1) originalKey = 'option_' + co;
            else if (co.startsWith('option')) originalKey = co;
        }
        // shuffle
        for (let i = opts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        // assign back
        opts.forEach((o, idx) => {
            q[keys[idx]] = o.text;
        });
        if (originalKey) {
            const newIndex = opts.findIndex(o => o.key === originalKey);
            if (newIndex >= 0) q.correct_option = keys[newIndex];
        }
    } catch (e) {
        console.warn('Shuffle options failed for a question', e);
    }
    return q;
}

function attachListeners() {

    console.log("attachListeners called");

    boardSelect.addEventListener("change", () => {

        localStorage.setItem("mcqBoard", boardSelect.value);

        loadClasses(boardSelect.value);

    });

    questionCountInput.addEventListener("input", () => {
        localStorage.setItem(
            "mcqQuestionCount",
            questionCountInput.value
        );
    });

    classSelect.addEventListener("change", () => {

        localStorage.setItem("mcqClass", classSelect.value);

        loadSubjects(
            boardSelect.value,
            classSelect.value
        );

    });

    subjectSelect.addEventListener("change", () => {

        localStorage.setItem("mcqSubject", subjectSelect.value);

        loadChapters(subjectSelect.value);

    });

    shuffleQuestions.addEventListener("change", () => {

        localStorage.setItem(
            "mcqShuffleQuestions",
            shuffleQuestions.checked
        );

    });

    shuffleOptions.addEventListener("change", () => {

        localStorage.setItem(
            "mcqShuffleOptions",
            shuffleOptions.checked
        );

    });

    chapterContainer.addEventListener('change', () => updateQuestionCount());
    selectAllBtn.addEventListener('click', selectAll);
    clearBtn.addEventListener('click', clearSelection);
    // plusBtn.addEventListener("click", () => {
    //     console.log("PLUS");
    //     increaseQuestions();
    // });
    // minusBtn.addEventListener("click", () => {
    //     console.log("MINUS");
    //     decreaseQuestions();
    // });
    startQuizBtn.addEventListener('click', startQuiz);
    console.log("Start Quiz listener attached");
    if (prevBtn) {

        prevBtn.addEventListener("click", () => {

            if (currentQuestion === 0) {

                return;

            }

            currentQuestion--;

            loadQuestion();

        });
    }
    if (nextBtn) {

        nextBtn.addEventListener("click", () => {

            const selected = document.querySelector(
                'input[name="answer"]:checked'
            );

            if (!selected) {

                alert("Please select an answer.");

                return;

            }

            selectedAnswers[currentQuestion] = selected.value;

            if (currentQuestion < questions.length - 1) {

                currentQuestion++;

                loadQuestion();

            }
            else {

                finishQuiz();

            }

        });
    }
}

function loadQuestion() {

    const questions = JSON.parse(
        sessionStorage.getItem("mcqQuestions")
    );

    if (!questions || questions.length === 0) {
        return;
    }

    const current = Number(
        sessionStorage.getItem("currentQuestion")
    );

    const answers = JSON.parse(
        sessionStorage.getItem("userAnswers")
    ) || [];

    const q = questions[current];

    quizProgress.textContent =
        `Question ${current + 1} / ${questions.length}`;

    questionText.textContent = q.question;

    optionsContainer.innerHTML = "";

    const options = [
        { key: "A", text: q.option_a },
        { key: "B", text: q.option_b },
        { key: "C", text: q.option_c },
        { key: "D", text: q.option_d }
    ];

    options.forEach(option => {

        const checked =
            selectedAnswers[current] === option.key
                ? "checked"
                : "";

        optionsContainer.innerHTML += `
        <label class="option-card">

            <input
                type="radio"
                name="answer"
                value="${option.key}"
                ${checked}>

            ${option.text}

        </label>
    `;

    });

    document
        .querySelectorAll('input[name="answer"]')
        .forEach(radio => {

            radio.addEventListener("change", () => {

                selectedAnswers[current] = radio.value;

            });

        });

    document
        .querySelectorAll('input[name="answer"]')
        .forEach(radio => {

            radio.addEventListener("change", () => {

                const answers = JSON.parse(
                    sessionStorage.getItem("userAnswers")
                ) || [];

                answers[current] = radio.value;

                sessionStorage.setItem(
                    "userAnswers",
                    JSON.stringify(answers)
                );

            });

        });

    prevBtn.disabled = currentQuestion === 0;

    if (currentQuestion === questions.length - 1) {

        nextBtn.textContent = "Finish Quiz";

    }
    else {

        nextBtn.textContent = "Next";

    }

}

function finishQuiz() {

    let score = 0;

    questions.forEach((question, index) => {

        if (selectedAnswers[index] === question.correct_option) {

            score++;

        }

    });

    alert(
        `Quiz Finished!\n\nScore: ${score} / ${questions.length}`
    );

}

async function loadChapters(subjectId) {

    const { data, error } = await window.supabaseClient

        .from("chapters")

        .select("id,title")

        .eq("subject_id", subjectId)

        .eq("is_active", true)

        .order("sort_order");

    if (error) {

        console.error(error);

        return;

    }

    chapterContainer.innerHTML = "";

    data.forEach(chapter => {

        if (
            chapter.title.trim().toLowerCase() === "all chapters"
        ) {
            return;
        }

        chapterContainer.innerHTML += `

        <label class="chapter-item">

            <input
                type="checkbox"
                value="${chapter.id}">

            ${chapter.title}

        </label>

    `;

    });

}

async function restoreSelections() {

    const board = localStorage.getItem("mcqBoard");
    const cls = localStorage.getItem("mcqClass");
    const subject = localStorage.getItem("mcqSubject");

    if (board) {

        boardSelect.value = board;

        await loadClasses(board);

    }

    if (cls) {

        classSelect.value = cls;

        await loadSubjects(board, cls);

    }

    if (subject) {

        subjectSelect.value = subject;

        await loadChapters(subject);

    }

    questionCountInput.value =
        localStorage.getItem("mcqQuestionCount") || 10;

    shuffleQuestions.checked =
        localStorage.getItem("mcqShuffleQuestions") === "true";

    shuffleOptions.checked =
        localStorage.getItem("mcqShuffleOptions") === "true";

}

function showToast(message, type = "info") {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.className = "";

    toast.classList.add(type);

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}