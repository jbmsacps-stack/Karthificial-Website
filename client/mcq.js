let questions = [

    {
        question: "Who is the CM of Tamil Nadu?",
        options: [
            "Joseph Vijay",
            "M.K. Stalin",
            "Narendra Modi",
            "Rajinikanth"
        ],
        answer: "Joseph Vijay"
    },

    {
        question: "What is the National Animal of India?",
        options: [
            "Lion",
            "Elephant",
            "Tiger",
            "Leopard"
        ],
        answer: "Tiger"
    },

    {
        question: "Who is the hero of Karuppu?",
        options: [
            "Ajith",
            "Vijay",
            "Suriya",
            "Dhanush"
        ],
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
        options: [
            "Earth",
            "Mars",
            "Venus",
            "Jupiter"
        ],
        answer: "Mars"
    },

    {
        question: "What is the capital of Tamil Nadu?",
        options: [
            "Madurai",
            "Chennai",
            "Trichy",
            "Salem"
        ],
        answer: "Chennai"
    },

    {
        question: "Which language is used for web page styling?",
        options: [
            "Java",
            "Python",
            "CSS",
            "C++"
        ],
        answer: "CSS"
    },

    {
        question: "Which data structure follows FIFO?",
        options: [
            "Stack",
            "Queue",
            "Tree",
            "Graph"
        ],
        answer: "Queue"
    },

    {
        question: "Who invented Java?",
        options: [
            "James Gosling",
            "Bill Gates",
            "Elon Musk",
            "Mark Zuckerberg"
        ],
        answer: "James Gosling"
    },

    {
        question: "Which gas do plants absorb?",
        options: [
            "Oxygen",
            "Hydrogen",
            "Carbon Dioxide",
            "Nitrogen"
        ],
        answer: "Carbon Dioxide"
    }

];

let userAnswers = [];

const mcqContainer = document.getElementById("mcqQuestions");

questions.forEach((q, index) => {

    let questionHTML = `
        <div class="question-box">

            <div class="question">
                ${index + 1}. ${q.question}
            </div>
    `;

    q.options.forEach(option => {

        questionHTML += `
            <label class="option" id="q${index}-${option}">

                <input
                    type="radio"
                    name="question${index}"
                    value="${option}"
                    onchange="saveAnswer(${index}, '${option}')"
                >

                ${option}

            </label>
        `;
    });

    questionHTML += `
        <div class="answer-box" id="answer${index}"></div>
    `;

    questionHTML += `</div>`;

    mcqContainer.innerHTML += questionHTML;

});

function saveAnswer(index, answer){
    userAnswers[index] = answer;
}

function submitMCQ(){

    let score = 0;

    questions.forEach((q, index) => {

        let correctAnswer = q.answer;
        let userAnswer = userAnswers[index];

        const answerBox = document.getElementById(`answer${index}`);

        if(userAnswer === correctAnswer){

            score++;

            document.getElementById(`q${index}-${correctAnswer}`)
                .style.background = "green";

        } else {

            if(userAnswer){

                document.getElementById(`q${index}-${userAnswer}`)
                    .style.background = "red";
            }

            document.getElementById(`q${index}-${correctAnswer}`)
                .style.background = "green";
        }

        answerBox.innerHTML = `
            Correct Answer: <b>${correctAnswer}</b>
        `;
    });

    document.getElementById("result").innerHTML =
        `Your Score: ${score} / ${questions.length}`;
}