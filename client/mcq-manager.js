const managerPanel =
    document.getElementById("manager-panel");

function showToast(message, type = "success") {

    const toast =
        document.createElement("div");

    toast.className = `toast ${type}`;

    toast.textContent = message;

    document
        .getElementById("toast-container")
        .appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showLoading() {

    managerPanel.innerHTML = `
        <div class="loading-text">
            Loading...
        </div>
    `;

    managerPanel.classList.remove("hidden");
}

async function openMCQManager() {

    showLoading();

    const { data, error } =
        await supabaseClient
            .from("mcqs")
            .select("*")
            .order("id", {
                ascending: false
            });

    if (error) {

        showToast(error.message, "error");

        return;
    }

    managerPanel.innerHTML = `

        <div class="manager-header">
            <h2>MCQ Manager</h2>
        </div>

        <form
            class="manager-form"
            onsubmit="
                event.preventDefault();
                addMCQ();
            "
        >

            <input
                type="text"
                id="mcq-question"
                placeholder="Question"
                required
            >

            <input
                type="text"
                id="mcq-a"
                placeholder="Option A"
                required
            >

            <input
                type="text"
                id="mcq-b"
                placeholder="Option B"
                required
            >

            <input
                type="text"
                id="mcq-c"
                placeholder="Option C"
                required
            >

            <input
                type="text"
                id="mcq-d"
                placeholder="Option D"
                required
            >

            <input
                type="text"
                id="mcq-answer"
                placeholder="Correct Answer"
                required
            >

            <button
                class="btn-gold"
                type="submit"
            >
                Add MCQ
            </button>

        </form>

        <div class="records-grid">

            ${data.map(mcq => `

                <div class="record-card">

                    <h3>
                        ${mcq.question}
                    </h3>

                    <p>
                        A: ${mcq.option_a}
                    </p>

                    <p>
                        B: ${mcq.option_b}
                    </p>

                    <p>
                        C: ${mcq.option_c}
                    </p>

                    <p>
                        D: ${mcq.option_d}
                    </p>

                    <p>
                        Answer:
                        ${mcq.correct_answer}
                    </p>

                    <div class="record-actions">

                        <button
                            class="btn-outline"
                            onclick="
                                editMCQ(${mcq.id})
                            "
                        >
                            Edit
                        </button>

                        <button
                            class="btn-gold"
                            onclick="
                                deleteMCQ(${mcq.id})
                            "
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `).join("")}

        </div>
    `;

    managerPanel.classList.remove("hidden");
}

async function addMCQ() {

    const question =
        document
            .getElementById("mcq-question")
            .value
            .trim();

    const optionA =
        document
            .getElementById("mcq-a")
            .value
            .trim();

    const optionB =
        document
            .getElementById("mcq-b")
            .value
            .trim();

    const optionC =
        document
            .getElementById("mcq-c")
            .value
            .trim();

    const optionD =
        document
            .getElementById("mcq-d")
            .value
            .trim();

    const answer =
        document
            .getElementById("mcq-answer")
            .value
            .trim();

    if (
        !question ||
        !optionA ||
        !optionB ||
        !optionC ||
        !optionD ||
        !answer
    ) {

        showToast(
            "All fields are required",
            "error"
        );

        return;
    }

    const { error } =
        await supabaseClient
            .from("mcqs")
            .insert([
                {
                    question: question,

                    option_a: optionA,

                    option_b: optionB,

                    option_c: optionC,

                    option_d: optionD,

                    correct_answer: answer
                }
            ]);

    if (error) {

        showToast(error.message, "error");

        return;
    }

    showToast(
        "MCQ added successfully"
    );

    openMCQManager();
}

async function deleteMCQ(id) {

    const confirmed =
        confirm("Delete this MCQ?");

    if (!confirmed) return;

    const { error } =
        await supabaseClient
            .from("mcqs")
            .delete()
            .eq("id", id);

    if (error) {

        showToast(error.message, "error");

        return;
    }

    showToast(
        "MCQ deleted successfully"
    );

    openMCQManager();
}

async function editMCQ(id) {

    const newQuestion =
        prompt(
            "Enter updated question"
        );

    if (!newQuestion) return;

    const { error } =
        await supabaseClient
            .from("mcqs")
            .update({
                question: newQuestion
            })
            .eq("id", id);

    if (error) {

        showToast(error.message, "error");

        return;
    }

    showToast(
        "MCQ updated successfully"
    );

    openMCQManager();
}