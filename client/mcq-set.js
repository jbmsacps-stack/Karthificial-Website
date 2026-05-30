const mcqSetTitle = document.getElementById("mcqSetTitle");
const mcqSetDescription = document.getElementById("mcqSetDescription");
const mcqSetClass = document.getElementById("mcqSetClass");
const mcqSetSubject = document.getElementById("mcqSetSubject");
const mcqSetCount = document.getElementById("mcqSetCount");
const mcqQuestionContainer = document.getElementById("mcqQuestionContainer");

let loadedSet = null;
let loadedQuestions = [];
let mcqStartedAt = null;
let questionFirstSeenTimes = {};
let questionAnsweredTimes = {};

let hasSubmittedMCQ = false;
let lastGamifiedResult = null;

function getSetIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function shuffleArray(items) {
    const array = [...items];

    for (let index = array.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    }

    return array;
}

function checkSupabaseForSetPage() {
    if (!window.supabaseClient) {
        showMCQSetError("Supabase is not connected. Check supabase-config.js.");
        return false;
    }

    return true;
}

function showMCQSetError(message) {
    if (mcqSetTitle) mcqSetTitle.textContent = "MCQ Set Not Found";
    if (mcqSetDescription) mcqSetDescription.textContent = message;

    if (mcqQuestionContainer) {
        mcqQuestionContainer.innerHTML = `
            <article class="mcq-question-card">
                <h2>Unable to load questions</h2>
                <p>${escapeHTML(message)}</p>
                <a href="mcq.html" class="btn-gold">Back to MCQ Sets</a>
            </article>
        `;
    }
}

async function loadMCQSetPage() {
    const setId = getSetIdFromURL();

    if (!setId) {
        showMCQSetError("No MCQ set ID was found in the page URL.");
        return;
    }

    if (!checkSupabaseForSetPage()) return;

    const { data: set, error: setError } = await window.supabaseClient
        .from("mcq_sets")
        .select("*")
        .eq("id", setId)
        .single();

    if (setError || !set) {
        console.error("MCQ set load error:", setError);
        showMCQSetError("This MCQ set does not exist or could not be loaded.");
        return;
    }

    const { data: questions, error: questionError } = await window.supabaseClient
        .from("mcq_questions")
        .select("*")
        .eq("set_id", setId)
        .order("created_at", { ascending: true });

    if (questionError) {
        console.error("Question load error:", questionError);
        showMCQSetError("Questions could not be loaded for this MCQ set.");
        return;
    }

    loadedSet = set;

    const questionList = questions || [];

    loadedQuestions = (set.shuffle_questions ?? true)
        ? shuffleArray(questionList)
        : questionList;

    mcqStartedAt = Date.now();

    renderMCQSetHeader(set, loadedQuestions.length);
    renderMCQQuestions(loadedQuestions);
}

function renderMCQSetHeader(set, questionCount) {
    document.title = `Karthificial | ${set.title}`;

    if (mcqSetTitle) mcqSetTitle.textContent = set.title;

    if (mcqSetDescription) {
        mcqSetDescription.textContent =
            set.description || "Practice objective questions from this MCQ set.";
    }

    if (mcqSetClass) mcqSetClass.textContent = `${set.class_level}th Standard`;
    if (mcqSetSubject) mcqSetSubject.textContent = set.subject || "Subject";
    if (mcqSetCount) mcqSetCount.textContent = `${questionCount} Questions`;
}

function renderMCQQuestions(questions) {
    if (!mcqQuestionContainer) return;

    if (!questions.length) {
        mcqQuestionContainer.innerHTML = `
            <article class="mcq-question-card">
                <h2>No Questions Added Yet</h2>
                <p>The admin has not added questions to this MCQ set yet.</p>
                <a href="mcq.html" class="btn-gold">Back to MCQ Sets</a>
            </article>
        `;
        return;
    }

    const now = getElapsedSeconds();

    questions.forEach((question) => {
        questionFirstSeenTimes[question.id] = now;
    });

    const questionHTML = questions.map((question, index) => {
        const options = getPreparedOptions(question);

        return `
            <article class="mcq-question-card" data-question-id="${escapeHTML(question.id)}">
                <div class="mcq-question-top">
                    <span>Question ${index + 1}</span>
                    <small>${escapeHTML(question.difficulty || "easy")}</small>
                </div>

                <h2>${escapeHTML(question.question)}</h2>

                <div class="mcq-option-list">
                    ${options.map((option) => {
            return renderOption(
                question.id,
                option.displayLetter,
                option.originalLetter,
                option.text
            );
        }).join("")}
                </div>
            </article>
        `;
    }).join("");

    mcqQuestionContainer.innerHTML = `
        <form id="mcqSetForm" class="mcq-set-form">
            ${questionHTML}

            <button type="submit" class="btn-gold mcq-submit-set-btn">
                Submit MCQ
            </button>

            <div id="mcqSetResult" class="mcq-set-result"></div>
        </form>
    `;

    trackQuestionAnswerTimes();

    const mcqSetForm = document.getElementById("mcqSetForm");
    mcqSetForm?.addEventListener("submit", handleMCQSubmit);
}

function getPreparedOptions(question) {
    const originalOptions = [
        {
            originalLetter: "A",
            text: question.option_a
        },
        {
            originalLetter: "B",
            text: question.option_b
        },
        {
            originalLetter: "C",
            text: question.option_c
        },
        {
            originalLetter: "D",
            text: question.option_d
        }
    ];

    const finalOptions = (loadedSet?.shuffle_options ?? true)
        ? shuffleArray(originalOptions)
        : originalOptions;

    return finalOptions.map((option, index) => {
        const displayLetters = ["A", "B", "C", "D"];

        return {
            displayLetter: displayLetters[index],
            originalLetter: option.originalLetter,
            text: option.text
        };
    });
}

function renderOption(questionId, displayLetter, originalLetter, optionText) {
    return `
        <label class="mcq-set-option">
            <input
                type="radio"
                name="question-${escapeHTML(questionId)}"
                value="${escapeHTML(originalLetter)}"
                data-display-letter="${escapeHTML(displayLetter)}"
            >
            <span>${escapeHTML(displayLetter)}. ${escapeHTML(optionText)}</span>
        </label>
    `;
}

function trackQuestionAnswerTimes() {
    loadedQuestions.forEach((question) => {
        const inputs = document.querySelectorAll(`input[name="question-${question.id}"]`);

        inputs.forEach((input) => {
            input.addEventListener("change", () => {
                questionAnsweredTimes[question.id] = getElapsedSeconds();
            });
        });
    });
}

function getElapsedSeconds() {
    if (!mcqStartedAt) return 0;
    return Math.max(0, Math.round((Date.now() - mcqStartedAt) / 1000));
}

function getCurrentClerkUserData() {
    const user = window.Clerk?.user;

    if (!user) {
        return {
            clerk_user_id: null,
            user_email: null,
            user_name: "Guest User"
        };
    }

    return {
        clerk_user_id: user.id || null,
        user_email: user.primaryEmailAddress?.emailAddress || null,
        user_name:
            user.fullName ||
            user.username ||
            user.firstName ||
            user.primaryEmailAddress?.emailAddress ||
            "Karthificial User"
    };
}

/* ================================
   GAMIFIED SCORING ENGINE
================================ */

function getBasePointsByDifficulty(difficulty) {
    const level = String(difficulty || "easy").toLowerCase();

    if (level === "hard") return 30;
    if (level === "medium") return 20;

    return 10;
}

function getDifficultyBonus(difficulty) {
    const level = String(difficulty || "easy").toLowerCase();

    if (level === "hard") return 10;
    if (level === "medium") return 5;

    return 0;
}

function getSpeedBonusForQuestion(timeSpentSeconds, isCorrect) {
    if (!isCorrect) return 0;

    if (timeSpentSeconds <= 8) return 8;
    if (timeSpentSeconds <= 15) return 5;
    if (timeSpentSeconds <= 25) return 2;

    return 0;
}

function calculateQuestionPoints(question, isCorrect, timeSpentSeconds) {
    if (!isCorrect) {
        return {
            basePoints: 0,
            difficultyBonus: 0,
            speedBonus: 0,
            totalPoints: 0
        };
    }

    const basePoints = getBasePointsByDifficulty(question.difficulty);
    const difficultyBonus = getDifficultyBonus(question.difficulty);
    const speedBonus = getSpeedBonusForQuestion(timeSpentSeconds, isCorrect);

    return {
        basePoints,
        difficultyBonus,
        speedBonus,
        totalPoints: basePoints + difficultyBonus + speedBonus
    };
}

function getRankTitle(percentage, finalPoints) {
    if (percentage >= 95 && finalPoints >= 180) return "Legendary Master";
    if (percentage >= 90) return "Master Performer";
    if (percentage >= 80) return "Sharp Learner";
    if (percentage >= 65) return "Strong Challenger";
    if (percentage >= 50) return "Rising Student";
    if (percentage > 0) return "Beginner";

    return "Training Mode";
}

function getFeedback(percentage, accuracyPercentage, finalPoints) {
    if (percentage >= 90) {
        return "Excellent. You controlled accuracy, speed, and consistency.";
    }

    if (percentage >= 75) {
        return "Strong attempt. A few corrections can push you into master level.";
    }

    if (percentage >= 50) {
        return "Good start. Review the wrong answers and improve your timing.";
    }

    if (finalPoints > 0) {
        return "You earned some points. Focus on accuracy first, then speed.";
    }

    return "Keep practicing. Build accuracy first, then chase speed bonus.";
}

async function getPerformanceComparison(setId, currentPercentage, currentAttemptId) {
    const { data, error } = await window.supabaseClient
        .from("mcq_attempts")
        .select("id, percentage")
        .eq("set_id", setId);

    if (error) {
        console.error("Performance comparison error:", error);

        return {
            betterThanPercentage: 0,
            comparedStudents: 0,
            comparisonText: "Benchmark data is not available yet."
        };
    }

    const previousAttempts = (data || []).filter((attempt) => {
        return attempt.id !== currentAttemptId;
    });

    if (!previousAttempts.length) {
        return {
            betterThanPercentage: 100,
            comparedStudents: 0,
            comparisonText: "You created the first benchmark for this MCQ set."
        };
    }

    const attemptsBehind = previousAttempts.filter((attempt) => {
        return Number(attempt.percentage) < Number(currentPercentage);
    }).length;

    const betterThanPercentage = Math.round(
        (attemptsBehind / previousAttempts.length) * 100
    );

    return {
        betterThanPercentage,
        comparedStudents: previousAttempts.length,
        comparisonText: `You are ahead of ${betterThanPercentage}% of students in this MCQ set.`
    };
}

async function getQuestionStruggleInsight(setId, answerRows) {
    const weakAnswer = answerRows.find((answer) => {
        return answer.is_unanswered || !answer.is_correct;
    });

    if (!weakAnswer) {
        return "You cleared every question in this attempt.";
    }

    const questionIndex = loadedQuestions.findIndex((question) => {
        return question.id === weakAnswer.question_id;
    });

    const { data, error } = await window.supabaseClient
        .from("mcq_attempt_answers")
        .select("question_id, is_correct, is_unanswered")
        .eq("set_id", setId)
        .eq("question_id", weakAnswer.question_id);

    if (error || !data || !data.length) {
        return `Question ${questionIndex + 1} needs review.`;
    }

    const total = data.length;
    const struggled = data.filter((row) => {
        return row.is_unanswered || !row.is_correct;
    }).length;

    const struggledPercentage = Math.round((struggled / total) * 100);

    return `You and ${struggledPercentage}% of players struggled with Question ${questionIndex + 1}.`;
}

/* ================================
   SUBMIT + SAVE ANALYTICS
================================ */
function lockRadioButtonsAfterSubmit() {
    const allInputs = document.querySelectorAll(".mcq-set-option input");

    allInputs.forEach((input) => {
        input.disabled = true;
    });

    const allOptions = document.querySelectorAll(".mcq-set-option");

    allOptions.forEach((option) => {
        option.classList.add("mcq-option-locked");
    });
}

async function handleMCQSubmit(event) {
    event.preventDefault();

    if (hasSubmittedMCQ) {
        if (lastGamifiedResult) {
            showGamifiedResult(lastGamifiedResult);
        } else {
            alert("Result already submitted. Retry the MCQ for a fresh attempt.");
        }

        return;
    }

    if (!loadedSet || !loadedQuestions.length) {
        alert("MCQ data is not ready yet.");
        return;
    }

    hasSubmittedMCQ = true;

    const submitButton = document.querySelector(".mcq-submit-set-btn");

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Saving Result...";
    }

    const timeTakenSeconds = getElapsedSeconds();

    let score = 0;
    let attempted = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    let basePoints = 0;
    let difficultyBonus = 0;
    let speedBonus = 0;
    let finalPoints = 0;

    const answerRows = [];

    loadedQuestions.forEach((question) => {
        const selectedOption = document.querySelector(
            `input[name="question-${question.id}"]:checked`
        );

        const selectedAnswer = selectedOption ? selectedOption.value : null;
        const isUnanswered = !selectedAnswer;
        const isCorrect = selectedAnswer === question.correct_answer;

        const firstSeenTime = questionFirstSeenTimes[question.id] || 0;
        const answeredTime = questionAnsweredTimes[question.id] || timeTakenSeconds;
        const timeSpentSeconds = Math.max(1, answeredTime - firstSeenTime);

        if (selectedAnswer) attempted++;

        if (isCorrect) {
            score++;
            correctCount++;
        }

        if (!isUnanswered && !isCorrect) wrongCount++;
        if (isUnanswered) unansweredCount++;

        const pointData = calculateQuestionPoints(question, isCorrect, timeSpentSeconds);

        basePoints += pointData.basePoints;
        difficultyBonus += pointData.difficultyBonus;
        speedBonus += pointData.speedBonus;
        finalPoints += pointData.totalPoints;

        answerRows.push({
            set_id: loadedSet.id,
            question_id: question.id,
            selected_answer: selectedAnswer,
            correct_answer: question.correct_answer,
            is_correct: isCorrect,
            is_unanswered: isUnanswered,
            difficulty: question.difficulty || "easy",
            time_spent_seconds: timeSpentSeconds,
            points_earned: pointData.totalPoints
        });

        markQuestionAnswers(question, selectedOption);
    });

    lockRadioButtonsAfterSubmit();

    const totalQuestions = loadedQuestions.length;

    const percentage = totalQuestions
        ? Number(((score / totalQuestions) * 100).toFixed(2))
        : 0;

    const accuracyPercentage = attempted
        ? Number(((correctCount / attempted) * 100).toFixed(2))
        : 0;

    const averageTimePerQuestion = totalQuestions
        ? Number((timeTakenSeconds / totalQuestions).toFixed(2))
        : 0;

    const rankTitle = getRankTitle(percentage, finalPoints);
    const feedback = getFeedback(percentage, accuracyPercentage, finalPoints);
    const clerkUser = getCurrentClerkUserData();

    const attemptPayload = {
        set_id: loadedSet.id,

        clerk_user_id: clerkUser.clerk_user_id,
        user_email: clerkUser.user_email,
        user_name: clerkUser.user_name,

        score,
        total_questions: totalQuestions,
        attempted_count: attempted,
        correct_count: correctCount,
        wrong_count: wrongCount,
        unanswered_count: unansweredCount,

        percentage,
        accuracy_percentage: accuracyPercentage,

        time_taken_seconds: timeTakenSeconds,
        average_time_per_question: averageTimePerQuestion,

        base_points: basePoints,
        speed_bonus: speedBonus,
        difficulty_bonus: difficultyBonus,
        final_points: finalPoints,

        points: finalPoints,
        rank_title: rankTitle,
        feedback
    };

    try {
        const { data: attemptData, error: attemptError } = await window.supabaseClient
            .from("mcq_attempts")
            .insert(attemptPayload)
            .select()
            .single();

        if (attemptError) throw attemptError;

        const answersWithAttemptId = answerRows.map((answer) => ({
            ...answer,
            attempt_id: attemptData.id
        }));

        const { error: answersError } = await window.supabaseClient
            .from("mcq_attempt_answers")
            .insert(answersWithAttemptId);

        if (answersError) throw answersError;

        const comparison = await getPerformanceComparison(
            loadedSet.id,
            percentage,
            attemptData.id
        );

        const struggleInsight = await getQuestionStruggleInsight(
            loadedSet.id,
            answerRows
        );

        lastGamifiedResult = {
            score,
            totalQuestions,
            attempted,
            correctCount,
            wrongCount,
            unansweredCount,
            percentage,
            accuracyPercentage,
            timeTakenSeconds,
            averageTimePerQuestion,
            basePoints,
            difficultyBonus,
            speedBonus,
            finalPoints,
            rankTitle,
            feedback,
            comparison: {
                betterThanPercentage: 0,
                comparisonText: "Result saved locally, but benchmark data is unavailable."
            },
            struggleInsight: "Admin analytics could not be updated. Check Supabase columns/policies."
        };

        showGamifiedResult(lastGamifiedResult);

    } catch (error) {
        console.error("Failed to save MCQ attempt:", error);

        showGamifiedResult({
            score,
            totalQuestions,
            attempted,
            correctCount,
            wrongCount,
            unansweredCount,
            percentage,
            accuracyPercentage,
            timeTakenSeconds,
            averageTimePerQuestion,
            basePoints,
            difficultyBonus,
            speedBonus,
            finalPoints,
            rankTitle,
            feedback,
            comparison: {
                betterThanPercentage: 0,
                comparisonText: "Result saved locally, but benchmark data is unavailable."
            },
            struggleInsight: "Admin analytics could not be updated. Check Supabase columns/policies."
        });
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "View Result Again";
        }
    }
}

function markQuestionAnswers(question, selectedOption) {
    const questionCard = document.querySelector(
        `[data-question-id="${question.id}"]`
    );

    const allOptions = questionCard?.querySelectorAll(".mcq-set-option");

    allOptions?.forEach((optionLabel) => {
        const input = optionLabel.querySelector("input");

        optionLabel.classList.remove("correct-answer", "wrong-answer");

        if (input.value === question.correct_answer) {
            optionLabel.classList.add("correct-answer");
        }
    });

    if (selectedOption && selectedOption.value !== question.correct_answer) {
        selectedOption.closest(".mcq-set-option")?.classList.add("wrong-answer");
    }
}

/* ================================
   GAMIFIED RESULT POPUP
================================ */


function getSafePercent(value, total) {
    if (!total || total <= 0) return 0;
    return Math.min(100, Math.round((value / total) * 100));
}

function showGamifiedResult(result) {
    const oldModal = document.querySelector(".mcq-result-modal-overlay");

    if (oldModal) oldModal.remove();

    const betterThan = result.comparison?.betterThanPercentage ?? 0;
    const comparisonText =
        result.comparison?.comparisonText || "Benchmark data is not available yet.";

    const correctPercent = getSafePercent(result.correctCount, result.totalQuestions);
    const wrongPercent = getSafePercent(result.wrongCount, result.totalQuestions);
    const unansweredPercent = getSafePercent(result.unansweredCount, result.totalQuestions);

    const maxPointPart = Math.max(
        result.basePoints,
        result.difficultyBonus,
        result.speedBonus,
        1
    );

    const basePointPercent = getSafePercent(result.basePoints, maxPointPart);
    const difficultyBonusPercent = getSafePercent(result.difficultyBonus, maxPointPart);
    const speedBonusPercent = getSafePercent(result.speedBonus, maxPointPart);


    const modal = document.createElement("div");
    modal.className = "mcq-result-modal-overlay";

    modal.innerHTML = `
        <section class="mcq-result-modal">
            <button class="mcq-result-close" type="button" aria-label="Close result">
                ×
            </button>

            <div class="mcq-result-top">
                <span class="mcq-result-label">Game Result</span>
                <h2>${escapeHTML(result.rankTitle)}</h2>
                <p>${escapeHTML(result.feedback)}</p>
            </div>

            <div class="mcq-game-benchmark">
                <h3>${escapeHTML(comparisonText)}</h3>

                <div class="mcq-benchmark-track">
                    <span class="mcq-benchmark-fill" style="width: ${Math.min(betterThan, 100)}%;"></span>
                    <span class="mcq-benchmark-marker" style="left: ${Math.min(betterThan, 100)}%;"></span>
                </div>

                <div class="mcq-benchmark-meta">
                    <span>Start</span>
                    <strong>${betterThan}% Ahead</strong>
                    <span>Top</span>
                </div>

                <p class="mcq-struggle-line">
                    ${escapeHTML(result.struggleInsight)}
                </p>
            </div>

            <div class="mcq-result-score-ring">
                <strong>${result.finalPoints}</strong>
                <span>Game Points</span>
            </div>

            <div class="mcq-result-analytics">
    <div class="mcq-analytics-card">
        <div class="mcq-analytics-head">
            <h3>Answer Breakdown</h3>
            <span>${result.percentage}% Score</span>
        </div>

        <div class="mcq-graph-row">
            <span>Correct</span>
            <div class="mcq-graph-track">
                <i class="mcq-graph-fill correct" style="width: ${correctPercent}%;"></i>
            </div>
            <strong>${result.correctCount}</strong>
        </div>

        <div class="mcq-graph-row">
            <span>Wrong</span>
            <div class="mcq-graph-track">
                <i class="mcq-graph-fill wrong" style="width: ${wrongPercent}%;"></i>
            </div>
            <strong>${result.wrongCount}</strong>
        </div>

        <div class="mcq-graph-row">
            <span>Unanswered</span>
            <div class="mcq-graph-track">
                <i class="mcq-graph-fill unanswered" style="width: ${unansweredPercent}%;"></i>
            </div>
            <strong>${result.unansweredCount}</strong>
        </div>
    </div>

    <div class="mcq-analytics-card">
        <div class="mcq-analytics-head">
            <h3>Point Breakdown</h3>
            <span>${result.finalPoints} Points</span>
        </div>

        <div class="mcq-graph-row">
            <span>Base</span>
            <div class="mcq-graph-track">
                <i class="mcq-graph-fill base" style="width: ${basePointPercent}%;"></i>
            </div>
            <strong>${result.basePoints}</strong>
        </div>

        <div class="mcq-graph-row">
            <span>Difficulty</span>
            <div class="mcq-graph-track">
                <i class="mcq-graph-fill difficulty" style="width: ${difficultyBonusPercent}%;"></i>
            </div>
            <strong>${result.difficultyBonus}</strong>
        </div>

        <div class="mcq-graph-row">
            <span>Speed</span>
            <div class="mcq-graph-track">
                <i class="mcq-graph-fill speed" style="width: ${speedBonusPercent}%;"></i>
            </div>
            <strong>${result.speedBonus}</strong>
        </div>
    </div>
</div>

            <div class="mcq-result-stats">
                <article>
                    <span>Score</span>
                    <strong>${result.score}/${result.totalQuestions}</strong>
                </article>

                <article>
                    <span>Percent</span>
                    <strong>${result.percentage}%</strong>
                </article>

                <article>
                    <span>Accuracy</span>
                    <strong>${result.accuracyPercentage}%</strong>
                </article>

                <article>
                    <span>Time</span>
                    <strong>${formatTime(result.timeTakenSeconds)}</strong>
                </article>

                <article>
                    <span>Base Points</span>
                    <strong>${result.basePoints}</strong>
                </article>

                <article>
                    <span>Difficulty Bonus</span>
                    <strong>${result.difficultyBonus}</strong>
                </article>

                <article>
                    <span>Speed Bonus</span>
                    <strong>${result.speedBonus}</strong>
                </article>

                <article>
                    <span>Unanswered</span>
                    <strong>${result.unansweredCount}</strong>
                </article>
            </div>

            <div class="mcq-result-bar-wrap">
                <div class="mcq-result-bar-label">
                    <span>Score Progress</span>
                    <strong>${result.percentage}%</strong>
                </div>

                <div class="mcq-result-bar">
                    <span style="width: ${Math.min(result.percentage, 100)}%;"></span>
                </div>
            </div>

            <div class="mcq-result-actions">
    <button class="btn-gold mcq-retry-btn" type="button">
        Retry This MCQ
    </button>

    <button class="btn-outline mcq-review-btn" type="button">
        Review Answers
    </button>

    <button class="btn-outline" type="button" onclick="window.location.href='mcq.html'">
        Back to MCQ Sets
    </button>
</div>
        </section>
    `;

    document.body.appendChild(modal);
    document.body.classList.add("mcq-result-open");

    const closeButton = modal.querySelector(".mcq-result-close");
    const reviewButton = modal.querySelector(".mcq-review-btn");
    const retryButton = modal.querySelector(".mcq-retry-btn");

    closeButton?.addEventListener("click", closeMCQResultModal);
    retryButton?.addEventListener("click", () => {
        window.location.reload();
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeMCQResultModal();
        }
    });

    reviewButton?.addEventListener("click", () => {
        closeMCQResultModal();

        const firstQuestion = document.querySelector(".mcq-question-card");
        firstQuestion?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

function closeMCQResultModal() {
    const modal = document.querySelector(".mcq-result-modal-overlay");

    if (modal) modal.remove();

    document.body.classList.remove("mcq-result-open");
}

function formatTime(totalSeconds) {
    const seconds = Number(totalSeconds || 0);

    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
}

document.addEventListener("DOMContentLoaded", loadMCQSetPage);