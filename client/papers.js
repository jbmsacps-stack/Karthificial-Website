console.log("paper.js loaded");

/* ===========================================
   DOM
=========================================== */

const boardSelect = document.getElementById("board-select");
const classSelect = document.getElementById("class-select");
const subjectSelect = document.getElementById("subject-select");

const chapterList = document.getElementById("chapter-list");
const natureList = document.getElementById("nature-list");

const marks1 = document.getElementById("marks-1");
const marks2 = document.getElementById("marks-2");
const marks5 = document.getElementById("marks-5");
const marks10 = document.getElementById("marks-10");

const totalMarksDisplay = document.getElementById("total-marks-display");

const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");

const preview = document.getElementById("paper-preview-content");

const errorBox = document.getElementById("paper-error");

/* ===========================================
   STATE
=========================================== */

let selectedBoardId = null;
let selectedClassId = null;
let selectedSubjectId = null;

let chapters = [];
let selectedChapterIds = [];

let natureTags = [];
let selectedNatureIds = [];

/* ===========================================
   WAIT FOR SUPABASE
=========================================== */

async function waitForSupabase(timeout = 5000) {

    const start = Date.now();

    while (typeof supabase === "undefined") {

        if (Date.now() - start > timeout) {
            throw new Error("Supabase not loaded");
        }

        await new Promise(r => setTimeout(r, 100));

    }

}

/* ===========================================
   INIT
=========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    try {

        await waitForSupabase();

        console.log("Supabase Ready");

        await loadBoards();

        bindEvents();

    }

    catch (err) {

        console.error(err);

        showError("Unable to connect to database.");

    }

});


function bindEvents() {

    boardSelect.addEventListener("change", async () => {

        selectedBoardId = boardSelect.value;

        classSelect.innerHTML =
            `<option value="">Select Class</option>`;

        subjectSelect.innerHTML =
            `<option value="">Science</option>`;

        chapterList.innerHTML = "";

        if (!selectedBoardId) return;

        await loadClasses(selectedBoardId);

    });


    classSelect.addEventListener("change", async () => {

        selectedClassId = classSelect.value;

        if (!selectedClassId) return;

        await loadSubjects(selectedBoardId, selectedClassId);

    });

    officialRadio.addEventListener("change", () => {
        applyOfficialPattern();
    });

    customRadio.addEventListener("change", () => {
        enableCustomPattern();
    });


    marks1.addEventListener("input", updateTotalMarks);
    marks2.addEventListener("input", updateTotalMarks);
    marks5.addEventListener("input", updateTotalMarks);
    marks10.addEventListener("input", updateTotalMarks);

}

/* ===========================================
   LOAD BOARDS
=========================================== */

async function loadBoards() {

    const { data, error } = await supabase
        .from("boards")
        .select("id,name")
        .eq("is_active", true)
        .order("id");

    if (error) {
        console.error(error);
        showError("Unable to load boards.");
        return;
    }

    boardSelect.innerHTML =
        `<option value="">Select Board</option>`;

    data.forEach(board => {

        boardSelect.innerHTML += `
            <option value="${board.id}">
                ${board.name}
            </option>
        `;

    });

}

/* ===========================================
   LOAD CLASSES
=========================================== */

async function loadClasses(boardId) {

    classSelect.disabled = true;

    const { data, error } = await supabase
        .from("classes")
        .select("id,name")
        .eq("board_id", boardId)
        .eq("is_active", true)
        .order("id");

    if (error) {

        console.error(error);
        showError("Unable to load classes.");
        return;

    }

    classSelect.innerHTML =
        `<option value="">Select Class</option>`;

    data.forEach(cls => {

        classSelect.innerHTML += `
            <option value="${cls.id}">
                ${cls.name}
            </option>
        `;

    });

    classSelect.disabled = false;

}

/* ===========================================
   LOAD SUBJECTS
=========================================== */

async function loadSubjects(boardId, classId) {

    subjectSelect.disabled = true;

    const { data, error } = await supabase
        .from("subjects")
        .select("id,name")
        .eq("board_id", boardId)
        .eq("class_id", classId)
        .eq("is_active", true)
        .order("sort_order");

    if (error) {

        console.error(error);
        showError("Unable to load subjects.");
        return;

    }

    subjectSelect.innerHTML = "";

    data.forEach(subject => {

        subjectSelect.innerHTML += `
            <option value="${subject.id}">
                ${subject.name}
            </option>
        `;

    });

    const science = data.find(subject =>
        subject.name.toLowerCase().includes("science")
    );

    if (!science) {

        showError("Science subject not found.");
        return;

    }

    selectedSubjectId = science.id;

    subjectSelect.value = science.id;

    subjectSelect.disabled = true;

    await loadChapters(science.id);

    await loadNatureTags(science.id);

    await loadPaperPattern();

    applyOfficialPattern();

}

/* ===========================================
   LOAD CHAPTERS
=========================================== */

async function loadChapters(subjectId) {

    const { data, error } = await supabase
        .from("chapters")
        .select("id,title")
        .eq("subject_id", subjectId)
        .eq("is_active", true)
        .order("chapter_number");

    if (error) {

        console.error(error);
        showError("Unable to load chapters.");
        return;

    }

    chapters = data;

    selectedChapterIds = data.map(ch => ch.id);

    renderChapterChips();

}

function renderChapterChips() {

    chapterList.innerHTML = "";

    chapters.forEach(chapter => {

        const selected =
            selectedChapterIds.includes(chapter.id);

        const chip = document.createElement("button");

        chip.type = "button";

        chip.className =
            `chip ${selected ? "selected" : ""}`;

        chip.dataset.id = chapter.id;

        chip.textContent = chapter.title;

        chip.addEventListener("click", () => {

            const id = chapter.id;

            if (selectedChapterIds.includes(id)) {

                selectedChapterIds =
                    selectedChapterIds.filter(x => x !== id);

            } else {

                selectedChapterIds.push(id);

            }

            renderChapterChips();

        });

        chapterList.appendChild(chip);

    });

}

const officialRadio = document.querySelector(
    'input[value="official"]'
);

const customRadio = document.querySelector(
    'input[value="custom"]'
);

const customPatternSection =
    document.getElementById("custom-pattern-section");

const selectAllBtn =
    document.getElementById("select-all-chapters");

const clearAllBtn =
    document.getElementById("clear-all-chapters");

let paperPattern = [];

/* ===========================================
   LOAD NATURE TAGS
=========================================== */

async function loadNatureTags(subjectId) {

    const { data, error } = await supabase
        .from("nature_tags")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

    if (error) {

        console.error(error);
        return;

    }

    natureTags = data.filter(tag =>

        tag.applies_to === "All" ||
        tag.applies_to === "Science"

    );

    selectedNatureIds =
        natureTags.map(tag => tag.id);

    renderNatureTags();

}

function renderNatureTags() {

    natureList.innerHTML = "";

    natureTags.forEach(tag => {

        const selected =
            selectedNatureIds.includes(tag.id);

        const chip = document.createElement("button");

        chip.type = "button";

        chip.className =
            `chip ${selected ? "selected" : ""}`;

        chip.textContent = tag.tag_name;

        chip.dataset.id = tag.id;

        chip.onclick = () => {

            const id = tag.id;

            if (selectedNatureIds.includes(id)) {

                selectedNatureIds =
                    selectedNatureIds.filter(x => x !== id);

            }
            else {

                selectedNatureIds.push(id);

            }

            renderNatureTags();

        };

        natureList.appendChild(chip);

    });

}

/* ===========================================
   PAPER PATTERN
=========================================== */

async function loadPaperPattern() {

    const { data, error } = await supabase
        .from("paper_patterns")
        .select("*")
        .eq("subject_id", selectedSubjectId)
        .order("sort_order");

    if (error) {

        console.error(error);

        return;

    }

    paperPattern = data;

}

function applyOfficialPattern() {

    let one = 0;
    let two = 0;
    let five = 0;
    let ten = 0;

    paperPattern.forEach(section => {

        const marks = section.marks_per_question;

        if (marks === 1)
            one += section.attempt_questions;

        else if (marks === 2)
            two += section.attempt_questions;

        else if (marks === 5)
            five += section.attempt_questions;

        else if (marks === 10)
            ten += section.attempt_questions;

    });

    marks1.value = one;
    marks2.value = two;
    marks5.value = five;
    marks10.value = ten;

    marks1.disabled = true;
    marks2.disabled = true;
    marks5.disabled = true;
    marks10.disabled = true;

    updateTotalMarks();

}

function enableCustomPattern() {

    marks1.disabled = false;
    marks2.disabled = false;
    marks5.disabled = false;
    marks10.disabled = false;

}

selectAllBtn.onclick = () => {

    selectedChapterIds =
        chapters.map(ch => ch.id);

    renderChapterChips();

};

clearAllBtn.onclick = () => {

    selectedChapterIds = [];

    renderChapterChips();

};

function validatePaper() {

    hideError();

    if (!selectedBoardId) {

        showError("Please select a board.");

        return false;

    }

    if (!selectedClassId) {

        showError("Please select a class.");

        return false;

    }

    if (selectedChapterIds.length === 0) {

        showError("Select at least one chapter.");

        return false;

    }

    const total =
        (+marks1.value || 0) * 1 +
        (+marks2.value || 0) * 2 +
        (+marks5.value || 0) * 5 +
        (+marks10.value || 0) * 10;

    if (total === 0) {

        showError("Please choose a mark distribution.");

        return false;

    }

    return true;

}

function generatePaperId() {

    const date = new Date();

    const yyyy = date.getFullYear();

    const mm = String(date.getMonth() + 1).padStart(2, "0");

    const dd = String(date.getDate()).padStart(2, "0");

    const random = Math.random()
        .toString(16)
        .substring(2, 6)
        .toUpperCase();

    return `KTF-SCI-${yyyy}${mm}${dd}-${random}`;

}

function shuffle(array) {

    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];

    }

    return arr;

}

function pickQuestions(pool, count) {

    if (pool.length <= count) {

        return pool;

    }

    return shuffle(pool).slice(0, count);

}

generateBtn.addEventListener("click", async () => {

    if (!validatePaper()) return;

    await generatePaper();

});

/* ===========================================
   GENERATE PAPER
=========================================== */

async function generatePaper() {

    hideError();

    generateBtn.disabled = true;

    generateBtn.textContent = "Generating...";

    preview.innerHTML = `
<div class="preview-placeholder">
    <h2>Generating Paper...</h2>
    <p>Please wait...</p>
</div>
`;

    try {

        let query = supabase
            .from("questions")
            .select("*")
            .eq("subject_id", selectedSubjectId)
            .eq("is_active", true)
            .in("chapter_id", selectedChapterIds);

        if (selectedNatureIds.length > 0) {

            query = query.in(
                "nature_tag_id",
                selectedNatureIds
            );

        }

        const source =
            document.querySelector(
                'input[name="source"]:checked'
            ).value;

        if (source === "pyq") {

            query = query.eq("is_pyq", true);

        }

        const { data, error } = await query;

        if (error)
            throw error;

        if (!data || data.length === 0) {

            preview.innerHTML = `
        <div class="preview-placeholder">
            <h2>No Questions Found</h2>
            <p>
                No questions match the selected filters.
            </p>
        </div>
    `;

            return;
        }

        buildPaper(data || []);

    }

    catch (err) {

        console.error(err);

        showError("Unable to generate paper.");

    }

    finally {

        generateBtn.disabled = false;

        generateBtn.textContent = "Generate Paper";

    }

}

function buildPaper(questionPool) {

    const generatedSections = [];

    paperPattern.forEach(pattern => {

        const pool = questionPool.filter(q =>
            q.default_marks === pattern.marks_per_question
        );

        generatedSections.push({

            pattern,

            questions: pickQuestions(
                pool,
                pattern.attempt_questions
            )

        });

    });

    renderPaper(generatedSections);

}

function renderPaper(sections) {

    const paperId = generatePaperId();

    let questionNumber = 1;

    let html = `

    <div class="paper-header">

        <h1>KARTHIFICIAL</h1>

        <p>Tamil Nadu State Board</p>

        <p>

            Class :
            ${classSelect.options[classSelect.selectedIndex].text}

            &nbsp;&nbsp;

            Subject :
            Science

        </p>

        <p>

            Paper ID :
            ${paperId}

        </p>

    </div>

    `;

    sections.forEach(section => {

        html += `

        <div class="paper-section">

        <h2>

        ${section.pattern.part_number}

        ${section.pattern.section_number ?? ""}

        </h2>

        <p>

        ${section.pattern.question_type}

        •

        ${section.pattern.marks_per_question} Mark

        </p>

        `;

        section.questions.forEach(q => {

            html += `

            <div class="paper-question">

                ${questionNumber++}.

                ${q.question_text}

            </div>

            `;

        });

        if (section.pattern.special_notes) {

            html += `

            <small>

            ${section.pattern.special_notes}

            </small>

            `;

        }

        html += `</div>`;

    });

    preview.innerHTML = html;

    downloadBtn.disabled = false;

}

/* ===========================================
   HELPER FUNCTIONS
=========================================== */

function updateTotalMarks() {

    const total =
        (+marks1.value || 0) * 1 +
        (+marks2.value || 0) * 2 +
        (+marks5.value || 0) * 5 +
        (+marks10.value || 0) * 10;

    totalMarksDisplay.textContent = total;

}

function showError(message) {

    errorBox.textContent = message;
    errorBox.style.display = "block";

}

function hideError() {

    errorBox.textContent = "";
    errorBox.style.display = "none";

}

downloadBtn.addEventListener("click", () => {

    window.print();

});

