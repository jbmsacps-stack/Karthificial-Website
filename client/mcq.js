let questions = [];
let userAnswers = [];

fetch("http://localhost:8080/api/mcq")
.then(response => response.json())
.then(data => {

    questions = data;

    const mcqContainer = document.getElementById("mcqQuestions");

    data.forEach((q, index) => {

        let questionHTML = `
            <div class="question-box">

                <div class="question">
                    ${index + 1}. ${q.question}
                </div>
        `;

        q.options.forEach(option => {

            questionHTML += `
                <label class="option">

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

        questionHTML += `</div>`;

        mcqContainer.innerHTML += questionHTML;

    });

})
.catch(error => {
    console.log("Error fetching MCQ data:", error);
});

function saveAnswer(index, answer){
    userAnswers[index] = answer;
}

function submitMCQ(){

    let score = 0;

    questions.forEach((q, index) => {

        if(userAnswers[index] === q.answer){
            score++;
        }

    });

    document.getElementById("result").innerHTML =
        `Your Score: ${score} / ${questions.length}`;
}