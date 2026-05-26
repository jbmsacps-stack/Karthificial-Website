const questions = [
    {
        question: "Who is the CM of Tamil Nadu?",
        options: ["Joseph Vijay", "M.K. Stalin", "Narendra Modi", "Rajinikanth"],
        answer: "Joseph Vijay"
    },
    {
        question: "What is the National Animal of India?",
        options: ["Lion", "Elephant", "Tiger", "Leopard"],
        answer: "Tiger"
    },
    {
        question: "Who is the hero of Karuppu?",
        options: ["Ajith", "Vijay", "Suriya", "Dhanush"],
        answer: "Suriya"
    },
    {
        question: "What is OOPS?",
        options: [
            "Object Oriented Programming Language",
            "Only Operating Program",
            "Object Operating Python System",
            "Open Object Processing System"
        ],
        answer: "Object Oriented Programming Language"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
        answer: "Mars"
    },
    {
        question: "What is the capital of Tamil Nadu?",
        options: ["Madurai", "Chennai", "Trichy", "Salem"],
        answer: "Chennai"
    },
    {
        question: "Which language is used for web page styling?",
        options: ["Java", "Python", "CSS", "C++"],
        answer: "CSS"
    },
    {
        question: "Which data structure follows FIFO?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        answer: "Queue"
    },
    {
        question: "Who invented Java?",
        options: ["James Gosling", "Bill Gates", "Elon Musk", "Mark Zuckerberg"],
        answer: "James Gosling"
    },
    {
        question: "Which gas do plants absorb?",
        options: ["Oxygen", "Hydrogen", "Carbon Dioxide", "Nitrogen"],
        answer: "Carbon Dioxide"
    }
];

const mcqSetName = "general-mcq";
const mcqTitle = "General MCQ";
let userAnswers = new Array(questions.length).fill(null);

const mcqContainer = document.getElementById("mcqQuestions");
const resultContainer = document.getElementById("result");
let mcqModalOverlay = null;
let mcqStartTime = Date.now();
let currentQuestions = [...questions];

function shuffleQuestionsOnly(array) {
    const copiedArray = [...array];

    for (let i = copiedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [copiedArray[i], copiedArray[randomIndex]] = [copiedArray[randomIndex], copiedArray[i]];
    }

    return copiedArray;
}

function renderMCQQuestions() {
    mcqContainer.innerHTML = currentQuestions.map((q, index) => {
        const optionsHTML = q.options.map((option, optionIndex) => `
            <label class="option" for="q${index}-option${optionIndex}" id="q${index}-option${optionIndex}-label">
                <input
                    type="radio"
                    id="q${index}-option${optionIndex}"
                    name="question${index}"
                    value="${optionIndex}"
                    onchange="saveAnswer(${index}, ${optionIndex})"
                >
                ${option}
            </label>
        `).join("");

        return `
            <div class="question-box" id="questionBox${index}">
                <div class="question">${index + 1}. ${q.question}</div>
                ${optionsHTML}
                <div class="answer-box" id="answer${index}"></div>
            </div>
        `;
    }).join("");
}

renderMCQQuestions();

function saveAnswer(index, optionIndex) {
    userAnswers[index] = optionIndex;
    clearQuestionHighlights(index);
}

function clearQuestionHighlights(index) {
    const labels = document.querySelectorAll(`#questionBox${index} .option`);
    labels.forEach(label => {
        label.classList.remove("correct-option", "wrong-option", "selected-option");
    });
}

function highlightOption(index, optionIndex, status) {
    const label = document.getElementById(`q${index}-option${optionIndex}-label`);
    if (!label) return;
    label.classList.add(`${status}-option`);
}

function showAnalysisPopup(summary) {
    closeAnalysisPopup();

    mcqModalOverlay = document.createElement("div");
    mcqModalOverlay.className = "mcq-modal-overlay";

    mcqModalOverlay.innerHTML = `
        <div class="mcq-modal" role="dialog" aria-modal="true">
            <button class="mcq-modal-close" onclick="closeAnalysisPopup()" aria-label="Close">×</button>
            <span class="mcq-modal-label">TEST ANALYSIS</span>
            <h2 id="mcqPerformanceTitle">${summary.performanceTitle}</h2>

            <div class="mcq-score-circle" id="mcqScoreText">${summary.score}/${summary.totalQuestions}</div>
            <p class="mcq-performance-text" id="mcqPerformanceText">${summary.performanceText}</p>

            <div class="mcq-stats-grid">
                <div class="mcq-stat-box">
                    <span>Correct</span>
                    <strong id="mcqCorrectCount">${summary.correctCount}</strong>
                </div>
                <div class="mcq-stat-box">
                    <span>Wrong</span>
                    <strong id="mcqWrongCount">${summary.wrongCount}</strong>
                </div>
                <div class="mcq-stat-box">
                    <span>Accuracy</span>
                    <strong id="mcqAccuracy">${summary.percentage}%</strong>
                </div>
                <div class="mcq-stat-box">
                    <span>Time Taken</span>
                    <strong id="mcqTimeTaken">${summary.timeTakenText}</strong>
                </div>
            </div>

            <p class="mcq-ranking-text" id="mcqBenchmark">${summary.benchmarkText}</p>
            <p class="mcq-advice-text" id="mcqAdviceText">${summary.adviceText}</p>

            <div class="mcq-modal-actions">
                <button class="btn-outline" onclick="closeAnalysisPopup()">Close</button>
                <button class="btn-gold" onclick="resetMCQ()">Retry Test</button>
            </div>
        </div>
    `;

    document.body.appendChild(mcqModalOverlay);
}

function closeAnalysisPopup() {
    if (mcqModalOverlay) {
        mcqModalOverlay.remove();
        mcqModalOverlay = null;
    }
}

function getTimeTaken() {
    const endTime = Date.now();
    const totalSeconds = Math.floor((endTime - mcqStartTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getMotivationalBenchmark(percentage) {
    if (percentage >= 90) return 92;
    if (percentage >= 80) return 78;
    if (percentage >= 70) return 64;
    if (percentage >= 60) return 51;
    if (percentage >= 50) return 39;
    if (percentage >= 35) return 24;
    return 12;
}

function getPerformanceSummary(percentage) {
    if (percentage >= 90) {
        return {
            performanceTitle: "Outstanding Performance",
            performanceText: "You showed excellent understanding. Your accuracy is strong and your preparation is clearly paying off.",
            adviceText: "Review the missed question and move to the next set. Keep this momentum going."
        };
    }
    if (percentage >= 80) {
        return {
            performanceTitle: "Excellent Work",
            performanceText: "You performed really well. A little more revision can push you close to perfect.",
            adviceText: "Review the few mistakes and try to cover the remaining concepts again."
        };
    }
    if (percentage >= 70) {
        return {
            performanceTitle: "Strong Attempt",
            performanceText: "You have a good grip on this topic. Review the few mistakes and you can improve quickly.",
            adviceText: "Go over the incorrect questions and retry once to solidify your understanding."
        };
    }
    if (percentage >= 60) {
        return {
            performanceTitle: "Good Progress",
            performanceText: "You are moving in the right direction. Focus on the wrong answers and try again.",
            adviceText: "Review the wrong answers carefully, then retry the test to build confidence."
        };
    }
    if (percentage >= 50) {
        return {
            performanceTitle: "Decent Attempt",
            performanceText: "You understood some key ideas, but you need more practice to become confident.",
            adviceText: "Go through the weak areas again and attempt the test once more."
        };
    }
    if (percentage >= 35) {
        return {
            performanceTitle: "Needs More Practice",
            performanceText: "You have started, but the basics need more revision. Review the correct answers carefully.",
            adviceText: "Take a moment to revise the concepts and then retry with focus."
        };
    }
    return {
        performanceTitle: "Restart and Improve",
        performanceText: "Do not worry about the score. Use this attempt to find weak areas and retry with focus.",
        adviceText: "Review the basics first, then try again to make steady progress."
    };
}

async function submitMCQ() {
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    const startTime = performance.now();

    currentQuestions.forEach((q, index) => {
        const correctIndex = q.options.findIndex(option => option === q.answer);
        const selectedIndex = userAnswers[index];
        const answerBox = document.getElementById(`answer${index}`);

        clearQuestionHighlights(index);

        if (selectedIndex === correctIndex) {
            score += 1;
            correctCount += 1;
            highlightOption(index, correctIndex, "correct");
        } else {
            wrongCount += 1;
            if (selectedIndex !== null && selectedIndex !== undefined) {
                highlightOption(index, selectedIndex, "wrong");
            }
            highlightOption(index, correctIndex, "correct");
        }

        const correctAnswerText = q.options[correctIndex];
        answerBox.innerHTML = `<span class="answer-label">Correct Answer:</span> <strong>${correctAnswerText}</strong>`;
    });

    const totalQuestions = currentQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const timeTakenSeconds = Math.round((Date.now() - mcqStartTime) / 1000);
    const timeTakenText = getTimeTaken();
    const performanceSummary = getPerformanceSummary(percentage);
    const benchmarkPercentage = getMotivationalBenchmark(percentage);

    const summary = {
        score,
        totalQuestions,
        correctCount,
        wrongCount,
        percentage,
        timeTakenText,
        performanceTitle: performanceSummary.performanceTitle,
        performanceText: performanceSummary.performanceText,
        adviceText: performanceSummary.adviceText,
        benchmarkText: `You performed better than ${benchmarkPercentage}% of learners in this practice benchmark.`,
        rankingText: ""
    };

    showAnalysisPopup(summary);
    resultContainer.innerHTML = "";

    try {
        const user = getUser();
        const payload = {
            userId: user?.userId || null,
            fullName: user?.fullName || "Guest Student",
            email: user?.email || null,
            studentClass: user?.studentClass || null,
            testName: mcqTitle,
            mcqSet: mcqSetName,
            score,
            totalQuestions,
            percentage,
            correctCount,
            wrongCount,
            timeTakenSeconds
        };

        const response = await fetch("http://localhost:8080/api/mcq/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("MCQ save failed:", response.status, text);
            return;
        }

        const data = await response.json();
        if (data.percentile !== undefined) {
            const rankingText = `You performed better than ${data.percentile}% of learners in this practice benchmark.`;
            updateRankingText(rankingText);
        }
        if (data.totalAttempts !== undefined) {
            const rankingTextEl = mcqModalOverlay?.querySelector(".mcq-ranking-text");
            if (rankingTextEl) {
                rankingTextEl.textContent += ` Total attempts: ${data.totalAttempts}.`;
            }
        }
    } catch (error) {
        console.error("MCQ save network error:", error);
    }
}

function updateRankingText(text) {
    if (!mcqModalOverlay) {
        return;
    }
    const rankingTextEl = mcqModalOverlay.querySelector(".mcq-ranking-text");
    if (rankingTextEl) {
        rankingTextEl.textContent = text;
    }
}

function resetMCQ() {
    currentQuestions = shuffleQuestionsOnly(questions);
    userAnswers = new Array(currentQuestions.length).fill(null);

    renderMCQQuestions();

    resultContainer.innerHTML = "";
    mcqStartTime = Date.now();
    closeAnalysisPopup();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

