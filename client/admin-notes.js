// =======================================================
// ADMIN NOTES MANAGER — clean rewrite
// =======================================================

// ── State ───────────────────────────────────────────────
let editingId = null;
let materials = [];
let deleteMaterialId = null;

// ── Form selects ────────────────────────────────────────
const boardSelect = document.getElementById("boardSelect");
const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const chapterSelect = document.getElementById("chapterSelect");

// ── Form inputs ─────────────────────────────────────────
const materialForm = document.getElementById("studyMaterialForm");
const titleInput = document.getElementById("materialTitle");
const descriptionInput = document.getElementById("materialDescription");
const materialType = document.getElementById("materialType");
const youtubeInput = document.getElementById("youtubeUrl");
const pdfInput = document.getElementById("pdfFile");
const sortOrder = document.getElementById("sortOrder");
const isActive = document.getElementById("isActive");

// ── Table ────────────────────────────────────────────────
const tableBody = document.getElementById("materialsTableBody");

// ── Filter selects ───────────────────────────────────────
const filterBoard = document.getElementById("filterBoard");
const filterClass = document.getElementById("filterClass");
const filterSubject = document.getElementById("filterSubject");
const filterType = document.getElementById("filterType");

// ── Search ───────────────────────────────────────────────
const searchInput = document.getElementById("searchMaterial");

// =======================================================
// INIT
// =======================================================



document.addEventListener("DOMContentLoaded", async () => {
    await loadBoards();
    await loadFilterBoards();
    await loadMaterials();
});

// =======================================================
// LOADING UI
// =======================================================

function showLoading() {
    document.getElementById("loadingState").style.display = "block";
}

function hideLoading() {
    document.getElementById("loadingState").style.display = "none";
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => toast.remove(), 3000);
}

// =======================================================
// FORM DROPDOWN CHAIN
// =======================================================

async function loadBoards() {

    const { data, error } = await window.supabaseClient
        .from("boards")
        .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        alert(error.message);
        return;
    }

    if (!data || data.length === 0) {
        alert("Boards table returned 0 rows.");
        return;
    }

    boardSelect.innerHTML = `<option value="">Select Board</option>`;

    data.forEach(board => {

        console.log(board);

        boardSelect.innerHTML += `
<option value="${board.id}">
${board.name}
</option>
`;

    });

}

async function loadClasses(boardId) {

    const { data, error } = await window.supabaseClient
        .from("classes")
        .select("*")
        .eq("board_id", boardId)
        .eq("is_active", true)
        .order("id");

    console.log("Classes:", data);
    console.log("Class Error:", error);

    if (error) {
        alert(error.message);
        return;
    }

    classSelect.innerHTML = `
        <option value="">Select Class</option>
    `;

    data.forEach(cls => {

        classSelect.innerHTML += `
            <option value="${cls.id}">
                ${cls.name}
            </option>
        `;

    });

}

async function loadSubjects(classId) {

    console.log("Loading subjects for class:", classId);

    const { data, error } = await window.supabaseClient
        .from("subjects")
        .select("id, name, class_id, is_active")
        .eq("class_id", parseInt(classId))
        .eq("is_active", true);

    if (error) {
        console.error("Subject Error:", error);
        return;
    }

    console.log("Subjects Found:", data);

    subjectSelect.innerHTML = `
        <option value="">Select Subject</option>
    `;

    if (!data || data.length === 0) {
        subjectSelect.innerHTML += `
            <option disabled>No Subjects Found</option>
        `;
        return;
    }

    data.forEach(subject => {

        const option = document.createElement("option");

        option.value = subject.id;
        option.textContent = subject.name;

        subjectSelect.appendChild(option);

    });

}

async function loadChapters(subjectId) {

    console.log("Loading chapters for subject:", subjectId);

    const { data, error } = await window.supabaseClient
        .from("chapters")
        .select("*")
        .eq("subject_id", Number(subjectId))
        .eq("is_active", true)
        .order("chapter_number");

    console.log("Chapters:", data);
    console.log("Chapter Error:", error);

    if (error) {
        console.error(error);
        return;
    }

    chapterSelect.innerHTML =
        `<option value="">Select Chapter</option>`;

    data.forEach(chapter => {

        chapterSelect.innerHTML += `
            <option value="${chapter.id}">
                Unit ${chapter.unit_number} • Chapter ${chapter.chapter_number} - ${chapter.title}
            </option>
        `;

    });

}

// ── Form dropdown listeners ──────────────────────────────

boardSelect.addEventListener("change", async () => {
    classSelect.innerHTML = `<option value="">Select Class</option>`;
    subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
    chapterSelect.innerHTML = `<option value="">Select Chapter</option>`;
    if (boardSelect.value) await loadClasses(boardSelect.value);
});

classSelect.addEventListener("change", async () => {
    subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
    chapterSelect.innerHTML = `<option value="">Select Chapter</option>`;
    if (classSelect.value) await loadSubjects(classSelect.value);
});

subjectSelect.addEventListener("change", async () => {
    chapterSelect.innerHTML = `<option value="">Select Chapter</option>`;
    if (subjectSelect.value) await loadChapters(subjectSelect.value);
});

// =======================================================
// FILTER DROPDOWN CHAIN
// =======================================================

async function loadFilterBoards() {
    const { data, error } = await window.supabaseClient
        .from("boards")
        .select("*")
        .order("id");

    if (error) { console.error(error); return; }

    filterBoard.innerHTML = `<option value="">All Boards</option>`;
    data.forEach(board => {
        filterBoard.innerHTML += `<option value="${board.id}">${board.name}</option>`;
    });
}

async function loadFilterClasses(boardId) {
    const { data, error } = await window.supabaseClient
        .from("classes")
        .select("*")
        .eq("board_id", boardId)
        .order("id");

    if (error) { console.error(error); return; }

    filterClass.innerHTML = `<option value="">All Classes</option>`;
    data.forEach(cls => {
        filterClass.innerHTML += `<option value="${cls.id}">${cls.name}</option>`;
    });
}

async function loadFilterSubjects(classId) {
    const { data, error } = await window.supabaseClient
        .from("subjects")
        .select("*")
        .eq("class_id", classId)
        .order("display_order");

    if (error) { console.error(error); return; }

    filterSubject.innerHTML = `<option value="">All Subjects</option>`;
    data.forEach(subject => {
        filterSubject.innerHTML += `<option value="${subject.id}">${subject.name}</option>`;
    });
}

// ── Filter listeners ─────────────────────────────────────

filterBoard.addEventListener("change", async () => {
    filterClass.innerHTML = `<option value="">All Classes</option>`;
    filterSubject.innerHTML = `<option value="">All Subjects</option>`;
    if (filterBoard.value) await loadFilterClasses(filterBoard.value);
    applyFilters();
});

filterClass.addEventListener("change", async () => {
    filterSubject.innerHTML = `<option value="">All Subjects</option>`;
    if (filterClass.value) await loadFilterSubjects(filterClass.value);
    applyFilters();
});

filterSubject.addEventListener("change", applyFilters);
filterType.addEventListener("change", applyFilters);

function applyFilters() {
    let filtered = [...materials];

    if (filterSubject.value) {
        filtered = filtered.filter(m => m.subject_id == filterSubject.value);
    }
    if (filterType.value) {
        filtered = filtered.filter(m => m.material_type === filterType.value);
    }

    renderTable(filtered);
}

// =======================================================
// LOAD & RENDER MATERIALS
// =======================================================

async function loadMaterials() {
    showLoading();

    const { data, error } = await window.supabaseClient
        .from("study_materials")
        .select(`
            *,
            subjects(name),
            chapters(title)
        `)
        .order("sort_order");

    hideLoading();

    if (error) {
        console.error(error);
        return;
    }

    materials = data;
    renderTable(materials);
}

function renderTable(list) {
    tableBody.innerHTML = "";

    const emptyState = document.getElementById("emptyState");

    if (!list.length) {
        emptyState.style.display = "block";
        return;
    }

    emptyState.style.display = "none";

    list.forEach((item, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.title}</td>
                <td>${item.subjects?.name ?? "-"}</td>
                <td>${item.chapters?.title ?? "-"}</td>
                <td>${item.material_type}</td>
                <td>${item.pdf_url
                ? `<button
    class="btn-outline"
    onclick="openPdfModal('${item.pdf_url}')">
    View PDF
</button>`
                : "-"}</td>
                <td>${item.youtube_url
                ? `<a href="${item.youtube_url}" target="_blank">Watch</a>`
                : "-"}</td>
                <td>${item.is_active ? "✅" : "❌"}</td>
                <td>
                    <button class="edit-btn" onclick="editMaterial(${item.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteMaterial(${item.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// =======================================================
// SEARCH
// =======================================================

searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = materials.filter(item =>
        (item.title || "").toLowerCase().includes(keyword)
    );
    renderTable(filtered);
});

// =======================================================
// PDF UPLOAD
// =======================================================

async function uploadPDF(file) {

    console.log("Uploading:", file);

    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await window.supabaseClient.storage
        .from("study-materials")
        .upload(fileName, file);

    console.log("Upload Data:", data);
    console.log("Upload Error:", error);

    if (error) throw error;

    const { data: publicData } = window.supabaseClient.storage
        .from("study-materials")
        .getPublicUrl(fileName);

    console.log("Public URL:", publicData.publicUrl);

    return publicData.publicUrl;
}

// =======================================================
// SAVE (INSERT / UPDATE)
// =======================================================

materialForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        let pdfUrl = null;
        if (pdfInput.files.length > 0) {
            pdfUrl = await uploadPDF(pdfInput.files[0]);
        }

        const payload = {
            subject_id: Number(subjectSelect.value),
            chapter_id: chapterSelect.value ? Number(chapterSelect.value) : null,
            material_type: materialType.value,
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            pdf_url: pdfUrl,
            youtube_url: youtubeInput.value.trim(),
            sort_order: Number(sortOrder.value),
            is_active: isActive.checked
        };

        if (editingId) {
            const { error } = await window.supabaseClient
                .from("study_materials")
                .update(payload)
                .eq("id", editingId);

            if (error) throw error;

            editingId = null;
            document.getElementById("saveMaterialBtn").textContent = "Save Material";

        } else {
            const { error } = await window.supabaseClient
                .from("study_materials")
                .insert(payload);

            if (error) throw error;
        }

        showToast("Study material saved successfully!");
        materialForm.reset();
        await loadMaterials();

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
});

// =======================================================
// EDIT
// =======================================================

async function editMaterial(id) {
    const material = materials.find(m => m.id === id);
    if (!material) return;

    editingId = id;

    // Populate basic fields
    titleInput.value = material.title || "";
    descriptionInput.value = material.description || "";
    youtubeInput.value = material.youtube_url || "";
    materialType.value = material.material_type;
    sortOrder.value = material.sort_order;
    isActive.checked = material.is_active;

    // Rebuild the dropdown chain from scratch so each level is populated
    // Board → Class → Subject → Chapter
    // We don't store board_id / class_id on study_materials directly,
    // so we load subjects first to fill that select, then chapters.
    await loadBoards();
    boardSelect.value = "";             // unknown without extra join; user can set manually

    classSelect.innerHTML = `<option value="">Select Class</option>`;
    subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
    chapterSelect.innerHTML = `<option value="">Select Chapter</option>`;

    // Pre-select subject and load chapters
    if (material.subject_id) {
        await loadChapters(material.subject_id);
        subjectSelect.value = material.subject_id;
        chapterSelect.value = material.chapter_id || "";
    }

    document.getElementById("saveMaterialBtn").textContent = "Update Material";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// =======================================================
// DELETE
// =======================================================

function deleteMaterial(id) {

    deleteMaterialId = id;

    document
        .getElementById("deleteModal")
        .classList.remove("hidden");

}

document
    .getElementById("cancelDeleteBtn")
    .addEventListener("click", () => {

        deleteMaterialId = null;

        document
            .getElementById("deleteModal")
            .classList.add("hidden");

    });

document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", async () => {

        if (!deleteMaterialId) return;

        const { error } = await window.supabaseClient
            .from("study_materials")
            .delete()
            .eq("id", deleteMaterialId);

        if (error) {

            console.error(error);

            showToast("Failed to delete material");

            return;

        }

        document
            .getElementById("deleteModal")
            .classList.add("hidden");

        deleteMaterialId = null;

        showToast("Material deleted successfully");

        await loadMaterials();

    });

// =======================================================
// RESET FORM
// =======================================================

document.getElementById("resetMaterialBtn").addEventListener("click", () => {
    editingId = null;
    materialForm.reset();
    document.getElementById("saveMaterialBtn").textContent = "Save Material";
});

// =======================================================
// REFRESH
// =======================================================

document.getElementById("refreshMaterialsBtn").addEventListener("click", async () => {
    await loadMaterials();
});

function openDeleteModal() {

    document
        .getElementById("deleteModal")
        .classList.remove("hidden");

}

function closeDeleteModal() {

    document
        .getElementById("deleteModal")
        .classList.add("hidden");

}

function openPdfModal(url) {

    document.getElementById("pdfPreviewFrame").src = url;

    document
        .getElementById("pdfModal")
        .classList.remove("hidden");

}

function closePdfModal() {

    document.getElementById("pdfPreviewFrame").src = "";

    document
        .getElementById("pdfModal")
        .classList.add("hidden");

}