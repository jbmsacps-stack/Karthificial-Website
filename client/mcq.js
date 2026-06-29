let questions = [];
let currentQuestion = 0;
let selectedAnswers = [];

// Elements queried once for reliability and performance.
const subjectSelect = document.getElementById('subjectSelect');
const boardSelect = document.getElementById('boardSelect');
const classSelect = document.getElementById('classSelect');
const chapterContainer = document.getElementById('chapterContainer');
const questionCountInput = document.getElementById('questionCount');
const availableQuestions = document.getElementById('availableQuestions');
const selectAllBtn = document.getElementById('selectAllBtn');
const clearBtn = document.getElementById('clearBtn');
const startQuizBtn = document.getElementById('startQuizBtn');
const shuffleQuestions = document.getElementById('shuffleQuestions');
const shuffleOptions = document.getElementById('shuffleOptions');
const quizProgress = document.getElementById('quizProgress');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const mcqSetup = document.getElementById('mcq-setup');
const mcqQuiz = document.getElementById('mcq-quiz');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const quizSubject = document.getElementById('quizSubject');
const progressFill = document.getElementById('progressFill');
const performancePercent = document.getElementById('performancePercent');
const performanceFill = document.getElementById('performanceFill');
const resultPercent = document.getElementById('resultPercent');
const correctCountEl = document.getElementById('correctCount');
const wrongCountEl = document.getElementById('wrongCount');
const totalCountEl = document.getElementById('totalCount');
const resultText = document.getElementById('resultText');
const recommendationText = document.getElementById('recommendationText');
const notesBtn = document.getElementById('notesBtn');
const paperBtn = document.getElementById('paperBtn');
const retryBtn = document.getElementById('retryBtn');
const quizResultSection = document.getElementById('quizResult');
const toast = document.getElementById('toast');



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
    try {
        const { data, error } = await window.supabaseClient
            .from('boards')
            .select('id,name')
            .eq('is_active', true);

        if (error) {
            console.error('Failed to load boards:', error);
            return;
        }

        boardSelect.innerHTML = '<option value="">Select Board</option>';
        data.forEach((board) => {
            boardSelect.innerHTML += `
                <option value="${board.id}">${board.name}</option>
            `;
        });
    } catch (err) {
        console.error('Unexpected error loading boards:', err);
    }
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

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

async function startQuiz() {

    clearMessage();

    const subject = subjectSelect.value;
    const chapters = Array.from(chapterContainer.querySelectorAll('input:checked')).map((i) => i.value);

    if (!subject) {
        showToast('Please select a subject.', 'warning');
        return;
    }

    if (chapters.length === 0) {
        showToast('Select at least one chapter.', 'warning');
        return;
    }

    try {
        const client = window.supabaseClient;
        const { data, error } = await client
            .from('mcq_questions')
            .select('*')
            .eq('subject_id', Number(subject))
            .in('chapter_id', chapters.map(Number));

        if (error) {
            console.error('Failed to load questions:', error);
            showToast('Unable to load questions. Try again.', 'error');
            return;
        }

        questions = data || [];
        if (questions.length === 0) {
            showToast('No questions found for the selected subject and chapters.', 'warning');
            return;
        }

        if (shuffleQuestions.checked) {
            questions.sort(() => Math.random() - 0.5);
        }

        if (shuffleOptions.checked) {
            questions = questions.map((question) => shuffleQuestionOptions(question));
        }

        const requestedCount = Math.max(1, Number(questionCountInput.value) || 1);
        questions = questions.slice(0, requestedCount);

        sessionStorage.setItem('mcqQuestions', JSON.stringify(questions));
        sessionStorage.setItem('currentQuestion', '0');
        sessionStorage.setItem('userAnswers', JSON.stringify([]));

        mcqSetup.classList.add('hidden');
        mcqQuiz.classList.remove('hidden');

        currentQuestion = 0;
        selectedAnswers = [];
        loadQuestion();
    } catch (err) {
        console.error('Error starting quiz:', err);
        showToast('Unable to start quiz. Refresh and try again.', 'error');
    }

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
    if (attachListeners._attached) {
        return;
    }
    attachListeners._attached = true;

    boardSelect.addEventListener('change', () => {
        localStorage.setItem('mcqBoard', boardSelect.value);
        loadClasses(boardSelect.value);
    });

    questionCountInput.addEventListener('input', () => {
        localStorage.setItem('mcqQuestionCount', questionCountInput.value);
    });

    classSelect.addEventListener('change', () => {
        localStorage.setItem('mcqClass', classSelect.value);
        loadSubjects(boardSelect.value, classSelect.value);
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

    chapterContainer.addEventListener('change', updateQuestionCount);
    selectAllBtn.addEventListener('click', selectAll);
    clearBtn.addEventListener('click', clearSelection);
    startQuizBtn.addEventListener('click', startQuiz);

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentQuestion === 0) {
                return;
            }
            currentQuestion -= 1;
            loadQuestion();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const selected = document.querySelector('input[name="answer"]:checked');
            if (selected) {
                selectedAnswers[currentQuestion] = selected.value;
                const answers = JSON.parse(sessionStorage.getItem('userAnswers')) || [];
                answers[currentQuestion] = selected.value;
                sessionStorage.setItem('userAnswers', JSON.stringify(answers));
            }

            if (questions.length === 0) {
                return;
            }

            if (currentQuestion >= questions.length - 1) {
                finishQuiz();
                return;
            }

            currentQuestion += 1;
            loadQuestion();
        });
    }

    optionsContainer.addEventListener('change', (event) => {
        const target = event.target;
        if (target && target.name === 'answer') {
            selectedAnswers[currentQuestion] = target.value;
            const answers = JSON.parse(sessionStorage.getItem('userAnswers')) || [];
            answers[currentQuestion] = target.value;
            sessionStorage.setItem('userAnswers', JSON.stringify(answers));
        }
    });

    if (notesBtn) {
        notesBtn.addEventListener('click', () => {
            window.location.href = 'notes.html';
        });
    }

    if (paperBtn) {
        paperBtn.addEventListener('click', () => {
            window.location.href = 'paper.html';
        });
    }

    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            quizResultSection.classList.add('hidden');
            mcqSetup.classList.remove('hidden');
            currentQuestion = 0;
            selectedAnswers = [];
        });
    }
}

function loadQuestion() {
    if (!questions || questions.length === 0) {
        return;
    }

    const current = currentQuestion;
    const q = questions[current];

    quizSubject.textContent = q.subject_name || 'Practice Quiz';
    quizProgress.textContent = `Question ${current + 1} of ${questions.length}`;
    progressFill.style.width = `${((current + 1) / questions.length) * 100}%`;
    questionText.textContent = q.question;

    const options = [
        { key: 'A', text: q.option_a },
        { key: 'B', text: q.option_b },
        { key: 'C', text: q.option_c },
        { key: 'D', text: q.option_d }
    ];

    optionsContainer.innerHTML = options
        .map((option) => {
            const checked = selectedAnswers[current] === option.key ? 'checked' : '';
            return `
                <label class="option-card">
                    <input type="radio" name="answer" value="${option.key}" ${checked}>
                    ${escapeHtml(option.text)}
                </label>
            `;
        })
        .join('');

    prevBtn.disabled = current === 0;
    nextBtn.textContent = current === questions.length - 1 ? 'Finish Quiz' : 'Next';
}

async function finishQuiz() {
    const total = questions.length;
    if (total === 0) {
        showToast('No questions available to finish the quiz.', 'error');
        return;
    }

    let scoreCount = 0;
    questions.forEach((q, index) => {
        if (selectedAnswers[index] === q.correct_option) {
            scoreCount += 1;
        }
    });

    const percent = total > 0 ? Math.round((scoreCount / total) * 100) : 0;

    try {
        const userResponse = await window.supabaseClient.auth.getUser();
        const user = userResponse?.data?.user;

        if (user) {
            const { error } = await window.supabaseClient.from('quiz_attempts').insert({
                user_id: user.id,
                board_id: Number(boardSelect.value),
                class_id: Number(classSelect.value),
                subject_id: Number(subjectSelect.value),
                total_questions: total,
                correct_answers: scoreCount,
                wrong_answers: total - scoreCount,
                percentage: percent
            });

            if (error) {
                console.error('Failed to save quiz attempt:', error);
                showToast('Failed to save quiz attempt. Please try again later.', 'error');
            }
        } else {
            console.warn('Quiz finish skipped insert: user not authenticated.');
        }
    } catch (err) {
        console.error('Error saving quiz attempt:', err);
        showToast('Unable to save quiz result.', 'error');
    }

    performancePercent.textContent = `${percent}%`;
    performanceFill.style.width = `${percent}%`;

    mcqQuiz.classList.add('hidden');
    quizResultSection.classList.remove('hidden');

    resultPercent.textContent = `${percent}%`;
    correctCountEl.textContent = scoreCount;
    wrongCountEl.textContent = total - scoreCount;
    totalCountEl.textContent = total;

    if (percent >= 90) {
        resultText.textContent = 'Outstanding Performance!';
        recommendationText.textContent = "You're ready for tougher questions.";
    } else if (percent >= 70) {
        resultText.textContent = 'Very Good!';
        recommendationText.textContent = 'Revise weak questions and try again.';
    } else {
        resultText.textContent = 'Needs Improvement';
        recommendationText.textContent = 'Read notes, watch the video and retry this quiz.';
    }
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
