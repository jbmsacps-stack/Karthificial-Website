const boardSelect = document.getElementById("boardSelect");
const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");

const materialGrid = document.getElementById("studyMaterialGrid");

let currentBoard = "";
let currentClass = "";
let currentSubject = "";

document.addEventListener("DOMContentLoaded", async () => {

    await loadBoards();

});

async function loadBoards() {

    const { data, error } = await window.supabaseClient
        .from("boards")
        .select("*");

    console.log(data);
    console.log(error);

    if (error) return;

    boardSelect.innerHTML =
        `<option value="">Select Board</option>`;

    data.forEach(board => {

        console.log(board);

        boardSelect.innerHTML += `
            <option value="${board.id}">
                ${board.board_name}
            </option>
        `;
    });
}

boardSelect.addEventListener("change", async () => {

    currentBoard = boardSelect.value;

    await loadClasses(currentBoard);

});

async function loadClasses(boardId) {

    const { data } = await window.supabaseClient

        .from("classes")

        .select("*")

        .eq("board_id", boardId);

    classSelect.innerHTML =
        `<option value="">Select Class</option>`;

    data.forEach(cls => {

        classSelect.innerHTML +=

        `<option value="${cls.id}">
            ${cls.name}
        </option>`;

    });

}

classSelect.addEventListener("change", async () => {

    currentClass = classSelect.value;

    await loadSubjects(currentClass);

});

async function loadSubjects(classId) {

    const { data, error } = await window.supabaseClient
        .from("subjects")
        .select("*")
        .eq("class_id", classId)
        .order("display_order");

    if (error) {
        console.error(error);
        return;
    }

    subjectSelect.innerHTML =
        `<option value="">Select Subject</option>`;

    data.forEach(subject => {

        subjectSelect.innerHTML += `
            <option value="${subject.id}">
                ${subject.name}
            </option>
        `;

    });

}

subjectSelect.addEventListener("change", async () => {

    currentSubject = subjectSelect.value;

    await loadStudyMaterials();

});

async function loadStudyMaterials() {

    const { data, error } = await window.supabaseClient

        .from("study_materials")

        .select("*")

        .eq("subject_id", currentSubject)

        .eq("is_active", true)

        .order("sort_order");

    if (error) {

        console.error(error);

        return;

    }

    renderMaterials(data);

}

function renderMaterials(materials) {

    materialGrid.innerHTML = "";

    if (!materials.length) {

        materialGrid.innerHTML = `

        <div class="empty-state">

            <h3>No Study Materials Available</h3>

        </div>

        `;

        return;

    }

    materials.forEach(material => {

        materialGrid.innerHTML += `

        <article class="study-card">

            <h2>${material.title}</h2>

            <p>${material.description ?? ""}</p>

            <div class="study-actions">

                ${
                    material.pdf_url
                    ?
                    `<a
                        href="${material.pdf_url}"
                        target="_blank"
                        class="download-btn">

                        Download

                    </a>`
                    :
                    ""
                }

                ${
                    material.youtube_url
                    ?
                    `<a
                        href="${material.youtube_url}"
                        target="_blank"
                        class="watch-btn">

                        Watch

                    </a>`
                    :
                    ""
                }

            </div>

        </article>

        `;

    });

}