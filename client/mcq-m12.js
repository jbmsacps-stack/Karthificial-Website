const questions = [
    {
        question: "What is the derivative of sin x with respect to x?",
        options: ["cos x", "-cos x", "sin x", "-sin x"],
        answer: "cos x"
    },
    {
        question: "What is the derivative of cos x with respect to x?",
        options: ["sin x", "-sin x", "cos x", "-cos x"],
        answer: "-sin x"
    },
    {
        question: "What is the derivative of tan x with respect to x?",
        options: ["sec²x", "cosec²x", "-sec²x", "-cosec²x"],
        answer: "sec²x"
    },
    {
        question: "What is the derivative of eˣ with respect to x?",
        options: ["eˣ", "x eˣ", "1/eˣ", "0"],
        answer: "eˣ"
    },
    {
        question: "What is the derivative of log x with respect to x?",
        options: ["x", "1/x", "log x", "eˣ"],
        answer: "1/x"
    },
    {
        question: "What is the integration of 1 with respect to x?",
        options: ["x + C", "1 + C", "0", "x² + C"],
        answer: "x + C"
    },
    {
        question: "What is the integration of x with respect to x?",
        options: ["x² + C", "x²/2 + C", "1/x + C", "2x + C"],
        answer: "x²/2 + C"
    },
    {
        question: "What is the integration of cos x with respect to x?",
        options: ["sin x + C", "-sin x + C", "cos x + C", "-cos x + C"],
        answer: "sin x + C"
    },
    {
        question: "What is the integration of sin x with respect to x?",
        options: ["cos x + C", "-cos x + C", "sin x + C", "-sin x + C"],
        answer: "-cos x + C"
    },
    {
        question: "What is the value of determinant |1 0; 0 1|?",
        options: ["0", "1", "-1", "2"],
        answer: "1"
    },
    {
        question: "If A is a square matrix and |A| = 0, then A is called:",
        options: ["Singular matrix", "Non-singular matrix", "Identity matrix", "Diagonal matrix"],
        answer: "Singular matrix"
    },
    {
        question: "If A is a square matrix and |A| ≠ 0, then A is called:",
        options: ["Singular matrix", "Non-singular matrix", "Null matrix", "Zero matrix"],
        answer: "Non-singular matrix"
    },
    {
        question: "A matrix in which all elements are zero is called:",
        options: ["Identity matrix", "Null matrix", "Scalar matrix", "Diagonal matrix"],
        answer: "Null matrix"
    },
    {
        question: "A square matrix with 1 as diagonal elements and 0 elsewhere is called:",
        options: ["Null matrix", "Identity matrix", "Row matrix", "Column matrix"],
        answer: "Identity matrix"
    },
    {
        question: "The order of the differential equation d²y/dx² + dy/dx + y = 0 is:",
        options: ["1", "2", "3", "0"],
        answer: "2"
    },
    {
        question: "The degree of the differential equation (dy/dx)² + y = 0 is:",
        options: ["1", "2", "3", "0"],
        answer: "2"
    },
    {
        question: "The degree of a differential equation is defined only when it is:",
        options: ["Polynomial in derivatives", "Linear only", "Non-linear only", "Algebraic in x only"],
        answer: "Polynomial in derivatives"
    },
    {
        question: "What is the value of log 1?",
        options: ["0", "1", "10", "Undefined"],
        answer: "0"
    },
    {
        question: "What is the value of log₁₀ 10?",
        options: ["0", "1", "10", "100"],
        answer: "1"
    },
    {
        question: "If two events A and B are independent, then P(A ∩ B) is equal to:",
        options: ["P(A) + P(B)", "P(A) - P(B)", "P(A)P(B)", "P(A)/P(B)"],
        answer: "P(A)P(B)"
    },
    {
        question: "The probability of a sure event is:",
        options: ["0", "1", "Between 0 and 1", "Greater than 1"],
        answer: "1"
    },
    {
        question: "The probability of an impossible event is:",
        options: ["0", "1", "2", "Undefined"],
        answer: "0"
    },
    {
        question: "If P(A) = 0.4, then P(A') is:",
        options: ["0.4", "0.6", "1.4", "0"],
        answer: "0.6"
    },
    {
        question: "The range of probability is:",
        options: ["0 to 1", "1 to 10", "-1 to 1", "0 to infinity"],
        answer: "0 to 1"
    },
    {
        question: "What is the formula for nPr?",
        options: ["n! / (n-r)!", "n! / r!", "n! / r!(n-r)!", "r! / n!"],
        answer: "n! / (n-r)!"
    },
    {
        question: "What is the formula for nCr?",
        options: ["n! / (n-r)!", "n! / r!(n-r)!", "r! / (n-r)!", "n! / r!"],
        answer: "n! / r!(n-r)!"
    },
    {
        question: "The number of ways of arranging n objects is:",
        options: ["n", "n!", "n²", "2n"],
        answer: "n!"
    },
    {
        question: "The value of 0! is:",
        options: ["0", "1", "Undefined", "Infinity"],
        answer: "1"
    },
    {
        question: "The transpose of a matrix A is denoted by:",
        options: ["A⁻¹", "Aᵀ", "|A|", "adj A"],
        answer: "Aᵀ"
    },
    {
        question: "The inverse of a matrix A exists only if:",
        options: ["|A| = 0", "|A| ≠ 0", "A is rectangular", "A is null"],
        answer: "|A| ≠ 0"
    },
    {
        question: "The adjoint of a matrix is used to find:",
        options: ["Transpose", "Inverse", "Order", "Trace"],
        answer: "Inverse"
    },
    {
        question: "What is the value of sin 0°?",
        options: ["0", "1", "-1", "1/2"],
        answer: "0"
    },
    {
        question: "What is the value of cos 0°?",
        options: ["0", "1", "-1", "1/2"],
        answer: "1"
    },
    {
        question: "What is the value of tan 45°?",
        options: ["0", "1", "√3", "1/√3"],
        answer: "1"
    },
    {
        question: "What is the value of sin 90°?",
        options: ["0", "1", "-1", "1/2"],
        answer: "1"
    },
    {
        question: "The derivative of a constant is:",
        options: ["0", "1", "x", "Constant"],
        answer: "0"
    },
    {
        question: "The derivative of xⁿ is:",
        options: ["nxⁿ⁻¹", "xⁿ", "nx", "xⁿ⁺¹"],
        answer: "nxⁿ⁻¹"
    },
    {
        question: "The integration of xⁿ is:",
        options: ["xⁿ⁺¹/(n+1) + C", "nxⁿ⁻¹ + C", "xⁿ + C", "n/x + C"],
        answer: "xⁿ⁺¹/(n+1) + C"
    },
    {
        question: "The mean of first five natural numbers is:",
        options: ["2", "3", "4", "5"],
        answer: "3"
    },
    {
        question: "The median of 2, 4, 6, 8, 10 is:",
        options: ["4", "6", "8", "10"],
        answer: "6"
    },
    {
        question: "The mode is the value which occurs:",
        options: ["Least frequently", "Most frequently", "Only once", "Never"],
        answer: "Most frequently"
    },
    {
        question: "Variance is always:",
        options: ["Negative", "Positive or zero", "Always zero", "Less than mean"],
        answer: "Positive or zero"
    },
    {
        question: "Standard deviation is the square root of:",
        options: ["Mean", "Median", "Variance", "Mode"],
        answer: "Variance"
    },
    {
        question: "The equation of x-axis is:",
        options: ["x = 0", "y = 0", "x = y", "x + y = 0"],
        answer: "y = 0"
    },
    {
        question: "The equation of y-axis is:",
        options: ["x = 0", "y = 0", "x = y", "x - y = 0"],
        answer: "x = 0"
    },
    {
        question: "The slope of a horizontal line is:",
        options: ["0", "1", "Undefined", "-1"],
        answer: "0"
    },
    {
        question: "The slope of a vertical line is:",
        options: ["0", "1", "Undefined", "-1"],
        answer: "Undefined"
    },
    {
        question: "The distance between points (0,0) and (3,4) is:",
        options: ["3", "4", "5", "7"],
        answer: "5"
    },
    {
        question: "The midpoint of (0,0) and (2,2) is:",
        options: ["(1,1)", "(2,2)", "(0,1)", "(1,0)"],
        answer: "(1,1)"
    },
    {
        question: "The general form of a straight line is:",
        options: ["ax + by + c = 0", "x² + y² = r²", "y = ax²", "xy = c"],
        answer: "ax + by + c = 0"
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

