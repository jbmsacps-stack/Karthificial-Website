protectAdminPage();

console.log("Admin Papers Loaded");

console.log("Supabase Object:", supabase);

const form =
    document.getElementById("paper-form");

const papersList =
    document.getElementById("papers-list");

const messageBox =
    document.getElementById("message-box");

const standardSelect =
    document.getElementById("standard");

const subjectSelect =
    document.getElementById("subject");

const SUBJECTS = {

    "10th": [
        "Tamil",
        "English",
        "Mathematics",
        "Science",
        "Social Science"
    ],

    "12th": [
        "Tamil",
        "English",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Computer Science",
        "Commerce",
        "Accountancy",
        "Economics",
        "Business Maths"
    ]
};

function showMessage(
    message,
    type = "success"
) {

    messageBox.innerHTML = `
        <div
            style="
                margin-top:15px;
                padding:12px;
                border-radius:10px;
                background:${
                    type === "success"
                    ? "#1f7a1f"
                    : "#7a1f1f"
                };
                color:white;
            ">
            ${message}
        </div>
    `;

    setTimeout(() => {

        messageBox.innerHTML = "";

    }, 3000);
}

function updateSubjects() {

    const standard =
        standardSelect.value;

    subjectSelect.innerHTML =
        `<option value="">
            Select Subject
        </option>`;

    if (!standard) return;

    SUBJECTS[standard]
        .forEach(subject => {

        const option =
            document.createElement("option");

        option.value = subject;

        option.textContent = subject;

        subjectSelect
            .appendChild(option);
    });
}

standardSelect.addEventListener(
    "change",
    updateSubjects
);

async function loadPapers() {

    papersList.innerHTML =
        "<p>Loading papers...</p>";

    try {

        const {
            data,
            error
        } = await supabase
            .from("question_papers")
            .select("*")
            .order(
                "created_at",
                { ascending: false }
            );

        if (error) {

            console.error(error);

            papersList.innerHTML =
                "<p>Failed to load papers.</p>";

            return;
        }

        if (!data || !data.length) {

            papersList.innerHTML =
                "<p>No papers added yet.</p>";

            return;
        }

        let html = "";

        data.forEach(paper => {

            html += `
                <div
                    class="admin-card"
                    style="
                        margin-top:15px;
                        padding:15px;
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:15px;
                    ">

                    <div>

                        <h3>
                            ${paper.title}
                        </h3>

                        <p>
                            ${paper.standard}
                            -
                            ${paper.subject}
                        </p>

                        <small>
                            ${paper.year || ""}
                        </small>

                    </div>

                    <div
                        style="
                            display:flex;
                            gap:10px;
                            flex-wrap:wrap;
                        ">

                        <a
                            href="${paper.pdf_url}"
                            target="_blank"
                            class="btn-gold">

                            Open

                        </a>

                        <button
                            class="btn-outline delete-btn"
                            data-id="${paper.id}">

                            Delete

                        </button>

                    </div>

                </div>
            `;
        });

        papersList.innerHTML = html;

        attachDeleteEvents();

    } catch (err) {

        console.error(err);

        papersList.innerHTML =
            "<p>Something went wrong.</p>";
    }
}

function attachDeleteEvents() {

    const deleteButtons =
        document.querySelectorAll(
            ".delete-btn"
        );

    deleteButtons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

            const id =
                button.dataset.id;

            const confirmDelete =
                confirm(
                    "Delete this paper?"
                );

            if (!confirmDelete) return;

            try {

                const { error } =
                    await supabase
                    .from("question_papers")
                    .delete()
                    .eq("id", id);

                if (error) {

                    console.error(error);

                    showMessage(
                        "Delete failed",
                        "error"
                    );

                    return;
                }

                showMessage(
                    "Paper deleted"
                );

                loadPapers();

            } catch (err) {

                console.error(err);

                showMessage(
                    "Something went wrong",
                    "error"
                );
            }
        });
    });
}

form.addEventListener(
    "submit",
    async (e) => {

    e.preventDefault();

    const paper = {

        standard:
            standardSelect.value,

        subject:
            subjectSelect.value,

        title:
            document
            .getElementById("title")
            .value
            .trim(),

        pdf_url:
            document
            .getElementById("pdf_url")
            .value
            .trim(),

        year:
            document
            .getElementById("year")
            .value
            .trim()
    };

    console.log(
        "Submitting Paper:",
        paper
    );

    try {

        const {
            data,
            error
        } = await supabase
            .from("question_papers")
            .insert([paper]);

        console.log(data);

        if (error) {

            console.error(error);

            showMessage(
                error.message,
                "error"
            );

            return;
        }

        showMessage(
            "Paper added successfully"
        );

        form.reset();

        subjectSelect.innerHTML =
            `<option value="">
                Select Subject
            </option>`;

        loadPapers();

    } catch (err) {

        console.error(err);

        showMessage(
            "Something went wrong",
            "error"
        );
    }
});

loadPapers();