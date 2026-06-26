console.log("notes.js loaded");
const boardSelect = document.getElementById("boardFilter");
const classSelect = document.getElementById("classFilter");
const subjectSelect = document.getElementById("subjectFilter");
const chapterSelect = document.getElementById("chapterFilter");

const materialGrid = document.getElementById("studyMaterialGrid");

let currentBoard = "";
let currentClass = "";
let currentSubject = "";

document.addEventListener("DOMContentLoaded", async () => {

    await loadBoards();

    let savedBoard = localStorage.getItem("selectedBoard");
    let savedClass = localStorage.getItem("selectedClass");
    let savedSubject = localStorage.getItem("selectedSubject");
    let savedChapter = localStorage.getItem("selectedChapter");

    // Default values
    if (!savedBoard) savedBoard = "1";   // Tamil Nadu State Board
    if (!savedClass) savedClass = "1";   // 10th Standard

    boardSelect.value = savedBoard;
    currentBoard = savedBoard;

    await loadClasses(savedBoard);

    classSelect.value = savedClass;
    currentClass = savedClass;

    await loadSubjects(savedClass);

    if (savedSubject) {
        subjectSelect.value = savedSubject;
        currentSubject = savedSubject;

        await loadChapters(savedSubject);

        if (savedChapter) {
            chapterSelect.value = savedChapter;
        }
    }

    await loadStudyMaterials();

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
        ${board.name}
    </option>
`;
    });
}

boardSelect.addEventListener("change", async () => {

    currentBoard = boardSelect.value;

    localStorage.setItem("selectedBoard", currentBoard);

    console.log("Selected Board:", currentBoard);

    await loadClasses(currentBoard);

});

async function loadClasses(boardId) {

    const { data } = await window.supabaseClient

        .from("classes")

        .select("*")

        .eq("board_id", boardId);

    console.log("Classes:", data);

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

    currentSubject = "";

    localStorage.setItem("selectedClass", currentClass);

    subjectSelect.innerHTML = `
        <option value="">All Subjects</option>
    `;

    chapterSelect.innerHTML = `
        <option value="">All Chapters</option>
    `;

    await loadSubjects(currentClass);

    await loadStudyMaterials();

});

async function loadSubjects(classId) {

    const { data, error } = await window.supabaseClient
        .from("subjects")
        .select("*")
        .eq("class_id", classId)
        .order("sort_order");

    if (error) {
        console.error(error);
        return;
    }

    subjectSelect.innerHTML = `
    <option value="">All Subjects</option>
`;

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

    localStorage.setItem("selectedSubject", currentSubject);

    if (currentSubject) {
        await loadChapters(currentSubject);
    } else {

        chapterSelect.innerHTML = `
            <option value="">All Chapters</option>
        `;

    }

    await loadStudyMaterials();

});

async function loadStudyMaterials() {

    let query = window.supabaseClient
        .from("study_materials")
        .select(`
    *,
    subjects (
        id,
        name,
        classes (
            id,
            name
        )
    ),
    chapters (
        id,
        chapter_number,
        title
    )
`)
        .eq("is_active", true);

    if (currentSubject) {

        query = query.eq("subject_id", currentSubject);

    } else if (currentClass) {

        const { data: subjects } = await window.supabaseClient
            .from("subjects")
            .select("id")
            .eq("class_id", currentClass);

        const subjectIds = subjects.map(s => s.id);

        if (subjectIds.length) {
            query = query.in("subject_id", subjectIds);
        }
    }

    if (chapterSelect.value) {
        query = query.eq("chapter_id", chapterSelect.value);
    }

    const { data, error } = await query.order("sort_order");

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

        <div class="study-card">

    <h2>${material.title}</h2>

    <p class="study-description">
    ${material.description ?? "No description available."}
</p>

    <div class="study-tags">

    <span class="study-tag">
        ${material.subjects?.classes?.name ?? ""}
    </span>

    <span class="study-tag">
        ${material.subjects?.name ?? ""}
    </span>

    <span class="study-tag">
        ${material.material_type ?? "Notes"}
    </span>

    <span class="study-tag">
        ${material.chapters?.title ?? ""}
    </span>

</div>

    <div class="study-actions">

        ${material.pdf_url
                ? `
            <a
                href="${material.pdf_url}"
                target="_blank"
                class="download-btn">
                Download PDF
            </a>`
                : ""
            }

        ${material.youtube_url
                ? `
            <a
                href="${material.youtube_url}"
                target="_blank"
                class="watch-btn">
                Watch Video
            </a>`
                : ""
            }

    </div>

</div>

        `;

    });

}

async function loadChapters(subjectId) {

    const { data, error } = await window.supabaseClient
        .from("chapters")
        .select("*")
        .eq("subject_id", subjectId)
        .eq("is_active", true)
        .order("chapter_number");

    if (error) {
        console.error(error);
        return;
    }

    chapterSelect.innerHTML = `
    <option value="">All Chapters</option>
`;

    data.forEach(chapter => {

        chapterSelect.innerHTML += `
            <option value="${chapter.id}">
                Chapter ${chapter.chapter_number} - ${chapter.title}
            </option>
        `;

    });

}

chapterSelect.addEventListener("change", async () => {
    localStorage.setItem("selectedChapter", chapterSelect.value);

    await loadStudyMaterials();

});