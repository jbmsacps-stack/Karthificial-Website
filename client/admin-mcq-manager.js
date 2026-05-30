const mcqSetForm = document.getElementById("mcqSetForm");
const mcqQuestionForm = document.getElementById("mcqQuestionForm");
const questionSetSelect = document.getElementById("questionSet");
const mcqSetsList = document.getElementById("mcqSetsList");

let selectedSetId = null;
let latestStudentStats = [];

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

    const overallButtonHTML = `
        <div class="admin-section-title">
            <h3>MCQ Management</h3>
            <p>Manage MCQ sets, questions, shuffle controls, and student performance.</p>

            <div class="admin-list-card-actions">
                <button class="btn-gold" type="button" onclick="viewOverallStudentPerformance()">
                    View Whole Student Performance
                </button>

                <button class="btn-outline" type="button" onclick="viewWeakQuestionsReportAll()">
                    Weak Questions Report
                </button>
            </div>
        </div>
    `;

    const setCardsHTML = sets.map((set) => {
        const shuffleQuestions = set.shuffle_questions ?? true;
        const shuffleOptions = set.shuffle_options ?? true;
        const safeTitle = String(set.title || "MCQ Set").replace(/'/g, "\\'");

        return `
            <article class="admin-list-card">
                <h3>${set.title}</h3>

                <p><strong>Class:</strong> ${set.class_level}th Standard</p>
                <p><strong>Subject:</strong> ${set.subject}</p>

                <div class="admin-inline-toggle-grid">
                    <label class="admin-inline-toggle">
                        <span>
                            <strong>Shuffle Questions</strong>
                            <small>${shuffleQuestions ? "ON" : "OFF"}</small>
                        </span>

                        <input
                            type="checkbox"
                            ${shuffleQuestions ? "checked" : ""}
                            onchange="updateMCQShuffleSetting('${set.id}', 'shuffle_questions', this.checked)"
                        >
                    </label>

                    <label class="admin-inline-toggle">
                        <span>
                            <strong>Shuffle Options</strong>
                            <small>${shuffleOptions ? "ON" : "OFF"}</small>
                        </span>

                        <input
                            type="checkbox"
                            ${shuffleOptions ? "checked" : ""}
                            onchange="updateMCQShuffleSetting('${set.id}', 'shuffle_options', this.checked)"
                        >
                    </label>
                </div>

                <p>${set.description || "No description added."}</p>

                <div class="admin-list-card-actions">
                    <button class="btn-outline" type="button" onclick="viewQuestions('${set.id}')">
                        View Questions
                    </button>

                    <button class="btn-outline" type="button" onclick="viewMCQAttempts('${set.id}', '${safeTitle}')">
                        View Performance
                    </button>

                    <button class="btn-outline" type="button" onclick="viewWeakQuestionsReport('${set.id}', '${safeTitle}')">
                        Weak Questions
                    </button>

                    <button class="admin-delete-btn" type="button" onclick="deleteMCQSet('${set.id}')">
                        Delete Set
                    </button>
                </div>
            </article>
        `;
    }).join("");

    mcqSetsList.innerHTML = overallButtonHTML + setCardsHTML;
}

async function updateMCQShuffleSetting(setId, field, value) {
    if (!checkSupabaseReady()) return;

    const allowedFields = ["shuffle_questions", "shuffle_options"];

    if (!allowedFields.includes(field)) {
        console.error("Invalid shuffle field:", field);
        showAdminMessage("Invalid shuffle setting.");
        return;
    }

    const { error } = await window.supabaseClient
        .from("mcq_sets")
        .update({
            [field]: value
        })
        .eq("id", setId);

    if (error) {
        console.error(error);
        showAdminMessage("Failed to update shuffle setting.");
        await loadMCQSets();
        return;
    }

    await loadMCQSets();
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

        shuffle_questions: document.getElementById("setShuffleQuestions")?.checked ?? true,
        shuffle_options: document.getElementById("setShuffleOptions")?.checked ?? true,

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

    const shuffleQuestionsToggle = document.getElementById("setShuffleQuestions");
    const shuffleOptionsToggle = document.getElementById("setShuffleOptions");

    if (shuffleQuestionsToggle) shuffleQuestionsToggle.checked = true;
    if (shuffleOptionsToggle) shuffleOptionsToggle.checked = true;

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

function openAdminPopup(title, subtitle, contentHTML, size = "large") {
    const oldModal = document.querySelector(".admin-popup-overlay");

    if (oldModal) {
        oldModal.remove();
    }

    const modal = document.createElement("div");
    modal.className = "admin-popup-overlay";

    modal.innerHTML = `
        <section class="admin-popup admin-popup-${size}">
            <button class="admin-popup-close" type="button" onclick="closeAdminPopup()">
                ×
            </button>

            <div class="admin-popup-header">
                <span>Admin Panel</span>
                <h2>${title}</h2>
                <p>${subtitle}</p>
            </div>

            <div class="admin-popup-body">
                ${contentHTML}
            </div>
        </section>
    `;

    document.body.appendChild(modal);
}

function closeAdminPopup() {
    const modal = document.querySelector(".admin-popup-overlay");

    if (modal) {
        modal.remove();
    }
}

async function viewQuestions(setId) {
    if (!checkSupabaseReady()) return;

    selectedSetId = setId;
    questionSetSelect.value = setId;

    openAdminPopup(
        "Loading Questions",
        "Please wait while questions are loaded.",
        `<p class="admin-empty-text">Loading questions...</p>`
    );

    const { data, error } = await window.supabaseClient
        .from("mcq_questions")
        .select("*")
        .eq("set_id", setId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error(error);

        openAdminPopup(
            "Failed to Load Questions",
            "Check Supabase or console errors.",
            `<p class="admin-empty-text">Failed to load questions.</p>`
        );

        return;
    }

    const questions = data || [];

    const contentHTML = renderQuestionsHTML(questions);

    openAdminPopup(
        "MCQ Questions",
        `${questions.length} question${questions.length === 1 ? "" : "s"} found in this set.`,
        contentHTML
    );
}

async function viewMCQAttempts(setId, setTitle) {
    if (!checkSupabaseReady()) return;

    openAdminPopup(
        "Loading Performance",
        `Please wait while performance for ${setTitle} is loaded.`,
        `<p class="admin-empty-text">Loading performance...</p>`
    );

    const { data, error } = await window.supabaseClient
        .from("mcq_attempts")
        .select("*")
        .eq("set_id", setId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);

        openAdminPopup(
            "Failed to Load Performance",
            "Check Supabase table, policies, or console errors.",
            `<p class="admin-empty-text">Failed to load MCQ performance.</p>`
        );

        return;
    }

    const attempts = data || [];

    if (!attempts.length) {
        openAdminPopup(
            "No Performance Yet",
            setTitle,
            `<p class="admin-empty-text">No students have attempted this MCQ yet.</p>`
        );

        return;
    }

    const summary = getAdminPerformanceSummary(attempts);

    const contentHTML = `
        <div class="admin-performance-summary admin-performance-modal-summary">
            <article>
                <span>Total Attempts</span>
                <strong>${summary.totalAttempts}</strong>
            </article>

            <article>
                <span>Average Score</span>
                <strong>${summary.averagePercentage}%</strong>
            </article>

            <article>
                <span>Average Accuracy</span>
                <strong>${summary.averageAccuracy}%</strong>
            </article>

            <article>
                <span>Average Points</span>
                <strong>${summary.averagePoints}</strong>
            </article>

            <article>
                <span>Best Student</span>
                <strong>${summary.bestAttempt?.user_name || "N/A"}</strong>
            </article>

            <article>
                <span>Fastest Attempt</span>
                <strong>${summary.fastestAttempt ? formatAdminTime(summary.fastestAttempt.time_taken_seconds) : "N/A"}</strong>
            </article>
        </div>

        <div class="admin-list-card-actions">
            <button class="btn-gold" type="button" onclick="viewQuestionAnalysis('${setId}', '${setTitle.replace(/'/g, "\\'")}')">
                View Question Analysis
            </button>
        </div>

        <div class="admin-performance-modal-list">
            ${attempts.map((attempt, index) => {
        return `
                    <article class="admin-list-card">
                        <h3>${index + 1}. ${attempt.user_name || "Anonymous Student"}</h3>

                        <p><strong>Email:</strong> ${attempt.user_email || "Not available"}</p>
                        <p><strong>Score:</strong> ${attempt.correct_count}/${attempt.total_questions}</p>
                        <p><strong>Percentage:</strong> ${attempt.percentage}%</p>
                        <p><strong>Accuracy:</strong> ${attempt.accuracy_percentage}%</p>
                        <p><strong>Time Taken:</strong> ${formatAdminTime(attempt.time_taken_seconds)}</p>
                        <p><strong>Points:</strong> ${attempt.final_points ?? attempt.points ?? 0}</p>
                        <p><strong>Rank:</strong> ${attempt.rank_title || "Not ranked"}</p>
                        <p><strong>Date:</strong> ${new Date(attempt.created_at).toLocaleString()}</p>
                    </article>
                `;
    }).join("")}
        </div>
    `;

    openAdminPopup(
        `Performance — ${setTitle}`,
        `${attempts.length} attempt${attempts.length === 1 ? "" : "s"} recorded.`,
        contentHTML
    );
}

async function viewOverallStudentPerformance() {
    if (!checkSupabaseReady()) return;

    const oldModal = document.querySelector(".admin-performance-modal-overlay");

    if (oldModal) {
        oldModal.remove();
    }

    const modal = document.createElement("div");
    modal.className = "admin-performance-modal-overlay";

    modal.innerHTML = `
        <section class="admin-performance-modal">
            <button class="admin-performance-close" type="button" onclick="closeOverallPerformanceModal()">
                ×
            </button>

            <div class="admin-performance-modal-loading">
                <h2>Loading Whole Student Performance...</h2>
                <p>Please wait while the latest student data is loaded.</p>
            </div>
        </section>
    `;

    document.body.appendChild(modal);

    const modalBox = modal.querySelector(".admin-performance-modal");

    const { data, error } = await window.supabaseClient
        .from("mcq_attempts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);

        modalBox.innerHTML = `
            <button class="admin-performance-close" type="button" onclick="closeOverallPerformanceModal()">
                ×
            </button>

            <div class="admin-performance-modal-loading">
                <h2>Failed to Load Performance</h2>
                <p>Check Supabase table, policies, or console errors.</p>
            </div>
        `;

        return;
    }

    const attempts = data || [];

    if (!attempts.length) {
        modalBox.innerHTML = `
            <button class="admin-performance-close" type="button" onclick="closeOverallPerformanceModal()">
                ×
            </button>

            <div class="admin-performance-modal-loading">
                <h2>No Student Attempts Yet</h2>
                <p>Student performance will appear here after MCQ submissions.</p>
            </div>
        `;

        return;
    }

    const students = getOverallStudentStats(attempts);
    latestStudentStats = students;

    modalBox.innerHTML = `
        <button class="admin-performance-close" type="button" onclick="closeOverallPerformanceModal()">
            ×
        </button>

        <div class="admin-performance-modal-header">
            <span>MCQ Analytics</span>
            <h2>Whole Student Performance</h2>
            <p>
                ${students.length} student${students.length === 1 ? "" : "s"} found across
                ${attempts.length} total attempt${attempts.length === 1 ? "" : "s"}.
            </p>
        </div>

        <div class="admin-performance-summary admin-performance-modal-summary">
            <article>
                <span>Total Students</span>
                <strong>${students.length}</strong>
            </article>

            <article>
                <span>Total Attempts</span>
                <strong>${attempts.length}</strong>
            </article>

            <article>
                <span>Average Score</span>
                <strong>${getAverageValue(attempts, "percentage")}%</strong>
            </article>

            <article>
                <span>Average Accuracy</span>
                <strong>${getAverageValue(attempts, "accuracy_percentage")}%</strong>
            </article>

            <article>
                <span>Total Points</span>
                <strong>${attempts.reduce((sum, item) => {
        return sum + Number(item.final_points ?? item.points ?? 0);
    }, 0)}</strong>
            </article>

            <article>
                <span>Best Score</span>
                <strong>${Math.max(...attempts.map((item) => Number(item.percentage || 0)))}%</strong>
            </article>
        </div>

        <div class="admin-performance-modal-list">
            ${students.map((student, index) => {
        return `
                    <article class="admin-list-card admin-student-performance-card">
                        <h3>${index + 1}. ${student.name}</h3>

                        <p><strong>Email:</strong> ${student.email}</p>
                        <p><strong>Total Attempts:</strong> ${student.totalAttempts}</p>
                        <p><strong>Average Score:</strong> ${student.averageScore}%</p>
                        <p><strong>Average Accuracy:</strong> ${student.averageAccuracy}%</p>
                        <p><strong>Total Points:</strong> ${student.totalPoints}</p>
                        <p><strong>Best Score:</strong> ${student.bestScore}%</p>
                        <p><strong>Total Correct:</strong> ${student.totalCorrect}/${student.totalQuestions}</p>
                        <p><strong>Total Time:</strong> ${formatAdminTime(student.totalTime)}</p>
                        <p><strong>Last Attempt:</strong> ${new Date(student.lastAttempt).toLocaleString()}</p>

                        <div class="admin-list-card-actions">
                            <button class="btn-outline" type="button" onclick="viewSingleStudentPerformance('${student.key}')">
                                View Student Details
                            </button>
                        </div>
                    </article>
                `;
    }).join("")}
        </div>
    `;
}

function closeOverallPerformanceModal() {
    const modal = document.querySelector(".admin-performance-modal-overlay");

    if (modal) {
        modal.remove();
    }
}

function viewSingleStudentPerformance(studentKey) {
    const student = latestStudentStats.find((item) => item.key === studentKey);

    if (!student) {
        showAdminMessage("Student details not found. Open Whole Student Performance again.");
        return;
    }

    const contentHTML = `
        <div class="admin-performance-summary admin-performance-modal-summary">
            <article>
                <span>Total Attempts</span>
                <strong>${student.totalAttempts}</strong>
            </article>

            <article>
                <span>Average Score</span>
                <strong>${student.averageScore}%</strong>
            </article>

            <article>
                <span>Average Accuracy</span>
                <strong>${student.averageAccuracy}%</strong>
            </article>

            <article>
                <span>Total Points</span>
                <strong>${student.totalPoints}</strong>
            </article>

            <article>
                <span>Best Score</span>
                <strong>${student.bestScore}%</strong>
            </article>

            <article>
                <span>Total Time</span>
                <strong>${formatAdminTime(student.totalTime)}</strong>
            </article>
        </div>

        <div class="admin-performance-modal-list">
            ${student.attempts.map((attempt, index) => {
        return `
                    <article class="admin-list-card mcq-student-detail-card">
                        <h3>Attempt ${index + 1}</h3>

                        <p><strong>Score:</strong> ${attempt.correct_count}/${attempt.total_questions}</p>
                        <p><strong>Percentage:</strong> ${attempt.percentage}%</p>
                        <p><strong>Accuracy:</strong> ${attempt.accuracy_percentage}%</p>
                        <p><strong>Time Taken:</strong> ${formatAdminTime(attempt.time_taken_seconds)}</p>
                        <p><strong>Points:</strong> ${attempt.final_points ?? attempt.points ?? 0}</p>
                        <p><strong>Rank:</strong> ${attempt.rank_title || "Not ranked"}</p>
                        <p><strong>Date:</strong> ${new Date(attempt.created_at).toLocaleString()}</p>
                    </article>
                `;
    }).join("")}
        </div>
    `;

    openAdminPopup(
        student.name,
        student.email,
        contentHTML
    );
}

function getOverallStudentStats(attempts) {
    const studentMap = new Map();

    attempts.forEach((attempt) => {
        const studentKey =
            attempt.clerk_user_id ||
            attempt.user_email ||
            `anonymous-${attempt.user_name || "student"}`;

        if (!studentMap.has(studentKey)) {
            studentMap.set(studentKey, {
                key: studentKey,
                name: attempt.user_name || "Anonymous Student",
                email: attempt.user_email || "Not available",
                attempts: [],
                totalAttempts: 0,
                totalScore: 0,
                totalAccuracy: 0,
                totalPoints: 0,
                bestScore: 0,
                totalCorrect: 0,
                totalQuestions: 0,
                totalTime: 0,
                lastAttempt: attempt.created_at
            });
        }

        const student = studentMap.get(studentKey);

        student.attempts.push(attempt);
        student.totalAttempts += 1;
        student.totalScore += Number(attempt.percentage || 0);
        student.totalAccuracy += Number(attempt.accuracy_percentage || 0);
        student.totalPoints += Number(attempt.final_points ?? attempt.points ?? 0);
        student.bestScore = Math.max(student.bestScore, Number(attempt.percentage || 0));
        student.totalCorrect += Number(attempt.correct_count || 0);
        student.totalQuestions += Number(attempt.total_questions || 0);
        student.totalTime += Number(attempt.time_taken_seconds || 0);

        if (new Date(attempt.created_at) > new Date(student.lastAttempt)) {
            student.lastAttempt = attempt.created_at;
        }
    });

    return [...studentMap.values()]
        .map((student) => {
            return {
                ...student,
                averageScore: Math.round(student.totalScore / student.totalAttempts),
                averageAccuracy: Math.round(student.totalAccuracy / student.totalAttempts)
            };
        })
        .sort((a, b) => {
            return b.totalPoints - a.totalPoints;
        });
}

function getAverageValue(items, field) {
    if (!items.length) return 0;

    const total = items.reduce((sum, item) => {
        return sum + Number(item[field] || 0);
    }, 0);

    return Math.round(total / items.length);
}

async function viewWeakQuestionsReportAll() {
    if (!checkSupabaseReady()) return;

    openAdminPopup(
        "Weak Questions Report",
        "Loading weak questions across all MCQ sets...",
        `<p class="admin-empty-text">Loading weak questions report...</p>`,
        "large"
    );

    const { data: sets, error: setsError } = await window.supabaseClient
        .from("mcq_sets")
        .select("id, title, subject, class_level");

    if (setsError) {
        console.error(setsError);

        openAdminPopup(
            "Weak Questions Report",
            "Could not load MCQ sets.",
            `<p class="admin-empty-text">Failed to load MCQ sets.</p>`,
            "large"
        );

        return;
    }

    const { data: questions, error: questionsError } = await window.supabaseClient
        .from("mcq_questions")
        .select("*");

    if (questionsError) {
        console.error(questionsError);

        openAdminPopup(
            "Weak Questions Report",
            "Could not load MCQ questions.",
            `<p class="admin-empty-text">Failed to load MCQ questions.</p>`,
            "large"
        );

        return;
    }

    const { data: answers, error: answersError } = await window.supabaseClient
        .from("mcq_attempt_answers")
        .select("*");

    if (answersError) {
        console.error(answersError);

        openAdminPopup(
            "Weak Questions Report",
            "Could not load MCQ answer records.",
            `<p class="admin-empty-text">Failed to load answer records.</p>`,
            "large"
        );

        return;
    }

    const setMap = new Map();

    (sets || []).forEach((set) => {
        setMap.set(String(set.id), set);
    });

    const reportItems = (questions || []).map((question) => {
        const rows = (answers || []).filter((answer) => {
            return String(answer.question_id) === String(question.id);
        });

        const totalAnswers = rows.length;
        const correctAnswers = rows.filter((answer) => answer.is_correct).length;
        const wrongAnswers = rows.filter((answer) => {
            return !answer.is_correct && !answer.is_unanswered;
        }).length;

        const wrongPercent = totalAnswers
            ? Math.round((wrongAnswers / totalAnswers) * 100)
            : 0;

        const setInfo = setMap.get(String(question.set_id));

        return {
            question,
            setInfo,
            totalAnswers,
            correctAnswers,
            wrongAnswers,
            wrongPercent
        };
    })
        .filter((item) => item.totalAnswers > 0)
        .sort((a, b) => {
            if (b.wrongPercent !== a.wrongPercent) {
                return b.wrongPercent - a.wrongPercent;
            }

            return b.wrongAnswers - a.wrongAnswers;
        });

    const contentHTML = reportItems.length
        ? `
            <div class="admin-performance-modal-list">
                ${reportItems.map((item, index) => {
            return `
                        <article class="admin-list-card admin-analysis-card">
                            <h3>${index + 1}. ${item.question.question}</h3>

                            <p><strong>MCQ Set:</strong> ${item.setInfo?.title || "Unknown Set"}</p>
                            <p><strong>Class:</strong> ${item.setInfo?.class_level || "N/A"}th Standard</p>
                            <p><strong>Subject:</strong> ${item.setInfo?.subject || "N/A"}</p>
                            <p><strong>Correct Answer:</strong> ${item.question.correct_answer}</p>
                            <p><strong>Difficulty:</strong> ${item.question.difficulty || "easy"}</p>

                            <p><strong>Total Answers:</strong> ${item.totalAnswers}</p>
                            <p><strong>Wrong Answers:</strong> ${item.wrongAnswers}</p>
                            <p><strong>Correct Answers:</strong> ${item.correctAnswers}</p>
                            <p><strong>Wrong Rate:</strong> ${item.wrongPercent}%</p>

                            <div class="admin-list-card-actions">
                                <button class="btn-outline" type="button" onclick="viewQuestions('${item.question.set_id}')">
                                    View This Set
                                </button>
                            </div>
                        </article>
                    `;
        }).join("")}
            </div>
        `
        : `<p class="admin-empty-text">No answered MCQ questions found yet.</p>`;

    openAdminPopup(
        "Weak Questions Report",
        "Questions ranked by highest wrong-answer rate across all MCQ sets.",
        contentHTML,
        "large"
    );
}

async function viewWeakQuestionsReport(setId, setTitle) {
    if (!checkSupabaseReady()) return;

    openAdminPopup(
        "Loading Question Analysis",
        `Please wait while analysis for ${setTitle} is loaded.`,
        `<p class="admin-empty-text">Loading question analysis...</p>`
    );

    const { data: questions, error: questionError } = await window.supabaseClient
        .from("mcq_questions")
        .select("*")
        .eq("set_id", setId)
        .order("created_at", { ascending: true });

    if (questionError) {
        console.error(questionError);

        openAdminPopup(
            "Failed to Load Questions",
            "Check Supabase questions table or console errors.",
            `<p class="admin-empty-text">Failed to load questions.</p>`
        );

        return;
    }

    const { data: answers, error: answerError } = await window.supabaseClient
        .from("mcq_attempt_answers")
        .select("*")
        .eq("set_id", setId);

    if (answerError) {
        console.error(answerError);

        openAdminPopup(
            "Failed to Load Answer Analysis",
            "Check Supabase attempt answers table or console errors.",
            `<p class="admin-empty-text">Failed to load answer analysis.</p>`
        );

        return;
    }

    const questionList = questions || [];
    const answerList = answers || [];

    if (!questionList.length) {
        openAdminPopup(
            "No Questions Found",
            setTitle,
            `<p class="admin-empty-text">No questions found for this MCQ set.</p>`
        );

        return;
    }

    const contentHTML = `
        <div class="admin-list-card-actions">
            <button class="btn-outline" type="button" onclick="viewMCQAttempts('${setId}', '${setTitle.replace(/'/g, "\\'")}')">
                Back to Performance
            </button>
        </div>

        <div class="admin-performance-modal-list">
            ${questionList.map((question, index) => {
        const rows = answerList.filter((answer) => answer.question_id === question.id);

        const totalAnswers = rows.length;
        const correctAnswers = rows.filter((answer) => answer.is_correct).length;
        const wrongAnswers = rows.filter((answer) => !answer.is_correct && !answer.is_unanswered).length;
        const unanswered = rows.filter((answer) => answer.is_unanswered).length;

        const optionA = rows.filter((answer) => answer.selected_answer === "A").length;
        const optionB = rows.filter((answer) => answer.selected_answer === "B").length;
        const optionC = rows.filter((answer) => answer.selected_answer === "C").length;
        const optionD = rows.filter((answer) => answer.selected_answer === "D").length;

        const correctPercent = totalAnswers
            ? Math.round((correctAnswers / totalAnswers) * 100)
            : 0;

        return `
                    <article class="admin-list-card admin-analysis-card">
                        <h3>${index + 1}. ${question.question}</h3>

                        <p><strong>Correct Answer:</strong> ${question.correct_answer}</p>
                        <p><strong>Difficulty:</strong> ${question.difficulty || "easy"}</p>
                        <p><strong>Correct Rate:</strong> ${correctPercent}%</p>
                        <p><strong>Correct Students:</strong> ${correctAnswers}/${totalAnswers}</p>
                        <p><strong>Wrong:</strong> ${wrongAnswers}</p>
                        <p><strong>Unanswered:</strong> ${unanswered}</p>

                        <div class="admin-answer-distribution">
                            ${renderAnswerDistributionRow("A", optionA, totalAnswers, question.correct_answer)}
                            ${renderAnswerDistributionRow("B", optionB, totalAnswers, question.correct_answer)}
                            ${renderAnswerDistributionRow("C", optionC, totalAnswers, question.correct_answer)}
                            ${renderAnswerDistributionRow("D", optionD, totalAnswers, question.correct_answer)}
                        </div>
                    </article>
                `;
    }).join("")}
        </div>
    `;

    openAdminPopup(
        `Question Analysis — ${setTitle}`,
        `Based on ${answerList.length} recorded answer${answerList.length === 1 ? "" : "s"}.`,
        contentHTML
    );
}

async function viewMostWrongQuestions(setId, setTitle) {
    if (!checkSupabaseReady()) return;

    openAdminPopup(
        "Weak Questions Report",
        `Loading weak questions analysis for ${setTitle}...`,
        `<p class="admin-empty-text">Loading analysis...</p>`,
        "large"
    );

    const { data: questions, error: questionsError } = await supabaseClient
        .from("mcq_questions")
        .select("id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty")
        .eq("set_id", setId);

    if (questionsError) {
        openAdminPopup(
            "Weak Questions Report",
            setTitle,
            `<p class="admin-error-text">Could not load questions.</p>`,
            "large"
        );
        return;
    }

    const { data: attempts, error: attemptsError } = await supabaseClient
        .from("mcq_attempts")
        .select("id")
        .eq("set_id", setId);

    if (attemptsError) {
        openAdminPopup(
            "Weak Questions Report",
            setTitle,
            `<p class="admin-error-text">Could not load attempts.</p>`,
            "large"
        );
        return;
    }

    const attemptIds = (attempts || []).map((attempt) => attempt.id);

    if (!attemptIds.length) {
        openAdminPopup(
            "Weak Questions Report",
            setTitle,
            `<p class="admin-empty-text">No student attempts found for this MCQ set yet.</p>`,
            "large"
        );
        return;
    }

    const { data: answers, error: answersError } = await supabaseClient
        .from("mcq_attempt_answers")
        .select("question_id, selected_answer, correct_answer, is_correct")
        .in("attempt_id", attemptIds);

    if (answersError) {
        openAdminPopup(
            "Weak Questions Report",
            setTitle,
            `<p class="admin-error-text">Could not load answer records.</p>`,
            "large"
        );
        return;
    }

    const analysis = (questions || []).map((question) => {
        const questionAnswers = (answers || []).filter((answer) => {
            return String(answer.question_id) === String(question.id);
        });

        const totalAttempts = questionAnswers.length;

        const wrongAnswers = questionAnswers.filter((answer) => {
            return answer.is_correct === false;
        });

        const wrongCount = wrongAnswers.length;
        const correctCount = totalAttempts - wrongCount;

        const wrongPercentage = totalAttempts
            ? Math.round((wrongCount / totalAttempts) * 100)
            : 0;

        const wrongOptionCounts = {
            A: 0,
            B: 0,
            C: 0,
            D: 0
        };

        wrongAnswers.forEach((answer) => {
            if (wrongOptionCounts[answer.selected_answer] !== undefined) {
                wrongOptionCounts[answer.selected_answer]++;
            }
        });

        const mostSelectedWrongOption = Object.entries(wrongOptionCounts)
            .sort((a, b) => b[1] - a[1])[0];

        return {
            ...question,
            totalAttempts,
            wrongCount,
            correctCount,
            wrongPercentage,
            mostWrongOption: mostSelectedWrongOption?.[1] > 0
                ? mostSelectedWrongOption[0]
                : "None",
            mostWrongOptionCount: mostSelectedWrongOption?.[1] || 0
        };
    });

    const sortedAnalysis = analysis
        .filter((item) => item.totalAttempts > 0)
        .sort((a, b) => {
            if (b.wrongPercentage !== a.wrongPercentage) {
                return b.wrongPercentage - a.wrongPercentage;
            }

            return b.wrongCount - a.wrongCount;
        });

    const contentHTML = sortedAnalysis.length
        ? `
            <div class="wrong-question-list">
                ${sortedAnalysis.map((item, index) => `
                    <article class="wrong-question-card">
                        <div class="wrong-question-rank">#${index + 1}</div>

                        <div class="wrong-question-main">
                            <h3>${escapeHTML(item.question_text)}</h3>

                            <div class="wrong-question-stats">
                                <span>Total Attempts: <strong>${item.totalAttempts}</strong></span>
                                <span>Wrong: <strong>${item.wrongCount}</strong></span>
                                <span>Correct: <strong>${item.correctCount}</strong></span>
                                <span>Wrong Rate: <strong>${item.wrongPercentage}%</strong></span>
                            </div>

                            <p class="wrong-question-meta">
                                Most selected wrong option:
                                <strong>${item.mostWrongOption}</strong>
                                ${item.mostWrongOption !== "None" ? `(${item.mostWrongOptionCount} times)` : ""}
                            </p>

                            <p class="wrong-question-meta">
                                Correct answer:
                                <strong>${item.correct_answer}</strong>
                                |
                                Difficulty:
                                <strong>${item.difficulty || "Not set"}</strong>
                            </p>
                        </div>
                    </article>
                `).join("")}
            </div>
        `
        : `<p class="admin-empty-text">No answered questions found for this MCQ set yet.</p>`;

    openAdminPopup(
        "Weak Questions Report",
        `Questions students struggled with most in ${setTitle}.`,
        contentHTML,
        "large"
    );
}

function renderAnswerDistributionRow(optionLetter, count, total, correctAnswer) {
    const percentage = total
        ? Math.round((count / total) * 100)
        : 0;

    const isCorrect = optionLetter === correctAnswer;

    return `
        <div class="admin-distribution-row ${isCorrect ? "correct-option" : ""}">
            <span>${optionLetter}</span>

            <div class="admin-distribution-track">
                <i style="width: ${percentage}%;"></i>
            </div>

            <strong>${count} (${percentage}%)</strong>
        </div>
    `;
}

function formatAdminTime(totalSeconds) {
    const seconds = Number(totalSeconds) || 0;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes <= 0) {
        return `${remainingSeconds}s`;
    }

    return `${minutes}m ${remainingSeconds}s`;
}

function getAdminPerformanceSummary(attempts) {
    const totalAttempts = attempts.length;

    const averagePercentage = totalAttempts
        ? Math.round(
            attempts.reduce((sum, attempt) => sum + Number(attempt.percentage || 0), 0) / totalAttempts
        )
        : 0;

    const averageAccuracy = totalAttempts
        ? Math.round(
            attempts.reduce((sum, attempt) => sum + Number(attempt.accuracy_percentage || 0), 0) / totalAttempts
        )
        : 0;

    const averagePoints = totalAttempts
        ? Math.round(
            attempts.reduce((sum, attempt) => {
                return sum + Number(attempt.final_points ?? attempt.points ?? 0);
            }, 0) / totalAttempts
        )
        : 0;

    const bestAttempt = [...attempts].sort((a, b) => {
        const bPoints = Number(b.final_points ?? b.points ?? 0);
        const aPoints = Number(a.final_points ?? a.points ?? 0);

        return bPoints - aPoints;
    })[0];

    const fastestAttempt = [...attempts]
        .filter((attempt) => Number(attempt.time_taken_seconds || 0) > 0)
        .sort((a, b) => {
            return Number(a.time_taken_seconds || 0) - Number(b.time_taken_seconds || 0);
        })[0];

    return {
        totalAttempts,
        averagePercentage,
        averageAccuracy,
        averagePoints,
        bestAttempt,
        fastestAttempt
    };
}

function renderQuestionsHTML(questions) {
    if (!questions.length) {
        return `<p class="admin-empty-text">No questions added to this set yet.</p>`;
    }

    return questions.map((item, index) => {
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

function confirmAdminDelete({
    title = "Confirm Delete",
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel"
}) {
    return new Promise((resolve) => {
        const oldModal = document.querySelector(".admin-confirm-overlay");

        if (oldModal) {
            oldModal.remove();
        }

        const modal = document.createElement("div");
        modal.className = "admin-confirm-overlay";

        modal.innerHTML = `
            <section class="admin-confirm-box">
                <div class="admin-confirm-icon">!</div>

                <h2>${title}</h2>
                <p>${message}</p>

                <div class="admin-confirm-actions">
                    <button class="admin-confirm-cancel" type="button">
                        ${cancelText}
                    </button>

                    <button class="admin-confirm-delete" type="button">
                        ${confirmText}
                    </button>
                </div>
            </section>
        `;

        document.body.appendChild(modal);

        const cancelButton = modal.querySelector(".admin-confirm-cancel");
        const deleteButton = modal.querySelector(".admin-confirm-delete");

        function closeModal(value) {
            modal.remove();
            resolve(value);
        }

        cancelButton.addEventListener("click", () => {
            closeModal(false);
        });

        deleteButton.addEventListener("click", () => {
            closeModal(true);
        });

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal(false);
            }
        });

        document.addEventListener(
            "keydown",
            function handleEscape(event) {
                if (event.key === "Escape") {
                    document.removeEventListener("keydown", handleEscape);
                    closeModal(false);
                }
            }
        );
    });
}

async function deleteQuestion(questionId) {
    if (!checkSupabaseReady()) return;

    const confirmDelete = await confirmAdminDelete({
        title: "Delete Question?",
        message: "This question will be permanently removed from this MCQ set.",
        confirmText: "Delete Question",
        cancelText: "Cancel"
    });

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

    const confirmDelete = await confirmAdminDelete({
        title: "Delete MCQ Set?",
        message: "This will permanently delete the MCQ set and all questions inside it.",
        confirmText: "Delete Set",
        cancelText: "Cancel"
    });

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
        closeAdminPopup();
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
        closeAdminPopup();
    }
});

window.viewQuestions = viewQuestions;
window.deleteQuestion = deleteQuestion;
window.deleteMCQSet = deleteMCQSet;
window.updateMCQShuffleSetting = updateMCQShuffleSetting;
window.viewMCQAttempts = viewMCQAttempts;
window.viewQuestionAnalysis = viewWeakQuestionsReport;
window.viewWeakQuestionsReport = viewWeakQuestionsReport;
window.viewWeakQuestionsReportAll = viewWeakQuestionsReportAll;
window.viewOverallStudentPerformance = viewOverallStudentPerformance;
window.viewSingleStudentPerformance = viewSingleStudentPerformance;
window.closeOverallPerformanceModal = closeOverallPerformanceModal;
window.closeAdminPopup = closeAdminPopup;

document.addEventListener("DOMContentLoaded", loadMCQSets);

