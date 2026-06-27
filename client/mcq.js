console.log('mcq.js loaded');

// Elements
const subjectSelect = document.getElementById('subjectSelect');
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
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const mcqSetup = document.getElementById("mcq-setup");
const mcqQuiz = document.getElementById("mcq-quiz");

// Guard against duplicate initialization
if (!window._mcqInitialized) {
    window._mcqInitialized = true;
    (async function init() {
        try {
            await waitForSupabase(5000);
            await loadSubjects();
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

async function loadSubjects() {
    try {
        const client = window.supabaseClient;
        const { data, error } = await client.from('mcq_questions').select('subject');
        if (error) throw error;
        const subjects = Array.from(new Set((data || []).map(d => d.subject).filter(Boolean))).sort((a, b) => a.localeCompare(b));
        subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
        subjects.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s;
            subjectSelect.appendChild(opt);
        });
    } catch (err) {
        console.error(err);
        showMessage('Unable to load subjects.');
    }
}

async function loadChapters(subject) {
    try {
        chapterContainer.innerHTML = '<p class="empty-text">Choose a subject to load chapters.</p>';
        if (!subject) return;
        const client = window.supabaseClient;
        const { data, error } = await client.from('mcq_questions').select('chapter').eq('subject', subject);
        if (error) throw error;
        const chapters = Array.from(new Set((data || []).map(d => d.chapter).filter(Boolean))).sort((a, b) => a.localeCompare(b));
        if (chapters.length === 0) {
            chapterContainer.innerHTML = '<p class="empty-text">No chapters found for this subject.</p>';
            updateQuestionCount();
            return;
        }
        chapterContainer.innerHTML = '';
        chapters.forEach(ch => {
            const label = document.createElement('label');
            label.className = 'chapter-item';
            label.innerHTML = `<input type="checkbox" value="${escapeHtml(ch)}"> ${escapeHtml(ch)}`;
            chapterContainer.appendChild(label);
        });
        updateQuestionCount();
    } catch (err) {
        console.error(err);
        showMessage('Unable to load chapters.');
    }
}

async function updateQuestionCount() {
    clearMessage();
    const subject = subjectSelect.value;
    const selected = Array.from(chapterContainer.querySelectorAll('input:checked')).map(i => i.value);
    if (!subject || selected.length === 0) {
        availableQuestions.textContent = '0 Questions Available';
        window._availableQuestions = 0;
        updateButtonsState();
        return;
    }
    try {
        const client = window.supabaseClient;
        const res = await client.from('mcq_questions').select('*', { head: true, count: 'exact' }).eq('subject', subject).in('chapter', selected);
        const count = res.count || 0;
        window._availableQuestions = count;
        availableQuestions.textContent = `${count} Questions Available`;
        // Ensure requested count does not exceed available
        const requested = Number(questionCountInput.value) || 1;
        if (count < requested) questionCountInput.value = Math.max(1, count);
        updateButtonsState();
    } catch (err) {
        console.error(err);
        showMessage('Unable to count available questions.');
    }
}

function updateButtonsState() {

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
    clearMessage();
    const subject = subjectSelect.value;
    const chapters = Array.from(chapterContainer.querySelectorAll('input:checked')).map(i => i.value);
    const available = Number(window._availableQuestions) || 0;
    if (!subject) { showMessage('Please select a subject.'); return; }
    if (chapters.length === 0) { showMessage('Please select at least one chapter.'); return; }
    if (available <= 0) { showMessage('No questions available for the selected chapters.'); return; }
    try {
        const client = window.supabaseClient;
        const { data, error } = await client.from('mcq_questions').select('*').eq('subject', subject).in('chapter', chapters);
        if (error) throw error;
        let questions = data || [];
        // Shuffle questions if requested
        if (shuffleQuestions && shuffleQuestions.checked) questions = questions.sort(() => Math.random() - 0.5);
        // Shuffle options per question if requested
        if (shuffleOptions && shuffleOptions.checked) {
            questions = questions.map(q => shuffleQuestionOptions(q));
        }
        // Limit
        const count = Number(questionCountInput.value) || 1;
        questions = questions.slice(0, count);
        // Save state

        sessionStorage.setItem(
            "mcqQuestions",
            JSON.stringify(questions)
        );

        sessionStorage.setItem(
            "currentQuestion",
            0
        );

        sessionStorage.setItem(
            "userAnswers",
            JSON.stringify([])
        );

        // Open quiz screen
        document.getElementById("mcq-setup").classList.add("hidden");
        document.getElementById("mcq-quiz").classList.remove("hidden");

        // Load first question
        loadQuestion();
    } catch (err) {
        console.error(err);
        showMessage('Failed to load questions.');
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
    subjectSelect.addEventListener('change', () => loadChapters(subjectSelect.value));
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
    if (prevBtn) {

        prevBtn.addEventListener("click", () => {

            let current = Number(sessionStorage.getItem("currentQuestion"));

            if (current === 0) return;

            current--;

            sessionStorage.setItem("currentQuestion", current);

            loadQuestion();

        });
    }
    if (nextBtn) {

        nextBtn.addEventListener("click", () => {

            const questions = JSON.parse(sessionStorage.getItem("mcqQuestions"));

            let current = Number(sessionStorage.getItem("currentQuestion"));

            if (current >= questions.length - 1) return;

            current++;

            sessionStorage.setItem("currentQuestion", current);

            loadQuestion();

        });
    }
}

function loadQuestion() {

    const questions = JSON.parse(sessionStorage.getItem("mcqQuestions"));

    const current = Number(sessionStorage.getItem("currentQuestion"));

    const q = questions[current];

    quizProgress.textContent = `Question ${current + 1} / ${questions.length}`;

    questionText.textContent = q.question;

    optionsContainer.innerHTML = "";

    const options = [
        { key: "A", text: q.option_a },
        { key: "B", text: q.option_b },
        { key: "C", text: q.option_c },
        { key: "D", text: q.option_d }
    ];

    options.forEach(option => {

        optionsContainer.innerHTML += `
            <label class="option-card">
                <input type="radio"
                       name="answer"
                       value="${option.key}">
                ${option.text}
            </label>
        `;

    });

}

