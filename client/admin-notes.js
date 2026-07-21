// =======================================================
// ADMIN NOTES MANAGER
// =======================================================

// ── STATE ────────────────────────────────────────────
let editingId = null;
let materials = [];
let currentPdfUrl = null;
let deleteMaterialId = null;

// ── FORM ELEMENTS ────────────────────────────────────
const boardSelect = document.getElementById("boardSelect");
const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const chapterSelect = document.getElementById("chapterSelect");

const materialForm = document.getElementById("studyMaterialForm");
const titleInput = document.getElementById("materialTitle");
const descriptionInput = document.getElementById("materialDescription");
const materialTypeSelect = document.getElementById("materialType");
const youtubeInput = document.getElementById("youtubeUrl");
const pdfInput = document.getElementById("pdfFile");
const sortOrderInput = document.getElementById("sortOrder");
const isActiveCheckbox = document.getElementById("isActive");
const currentPdfContainer = document.getElementById("currentPdfContainer");
const currentPdfLink = document.getElementById("currentPdfLink");

// ── TABLE & FILTERS ──────────────────────────────────
const tableBody = document.getElementById("materialsTableBody");
const filterBoard = document.getElementById("filterBoard");
const filterClass = document.getElementById("filterClass");
const filterSubject = document.getElementById("filterSubject");
const filterType = document.getElementById("filterType");
const searchInput = document.getElementById("searchMaterial");

// ── MODALS ───────────────────────────────────────────
const deleteModal = document.getElementById("deleteModal");
const pdfModal = document.getElementById("pdfModal");
const pdfPreviewFrame = document.getElementById("pdfPreviewFrame");

const customTypeContainer = document.getElementById("customTypeContainer");
const customMaterialTypeInput = document.getElementById("customMaterialType");

const thumbnailInput = document.getElementById("materialThumbnailUrl");
const currentThumbnailContainer = document.getElementById("currentThumbnailContainer");
const currentThumbnailPreview = document.getElementById("currentThumbnailPreview");
// =======================================================
// 1. INITIALIZATION
// =======================================================

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadBoards();
        await loadFilterBoards();
        await loadMaterials();
        attachEventListeners();
    } catch (error) {
        console.error("Error initialising page:", error);
        console.error("Stack:", error.stack);
        showToast(error.message || "Initialization failed");
    }
});

// =======================================================
// 2. UI UTILITIES
// =======================================================

function showLoading() {
    const loadingState = document.getElementById("loadingState");
    if (loadingState) loadingState.style.display = "block";
}

function hideLoading() {
    const loadingState = document.getElementById("loadingState");
    if (loadingState) loadingState.style.display = "none";
}

function showToast(message, duration = 3000) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #d4af37;
        color: #000;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = "slideOutDown 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// =======================================================
// 3. DROPDOWNS - FORM (Board → Class → Subject → Chapter)
// =======================================================

async function loadBoards() {
    try {
        const { data, error } = await window.supabaseClient
            .from("boards")
            .select("*")
            .order("id");

        if (error) throw error;
        if (!data || data.length === 0) {
            console.warn("No boards found");
            boardSelect.innerHTML = `<option value="">No Boards</option>`;
            return;
        }

        boardSelect.innerHTML = `<option value="">Select Board</option>`;
        data.forEach(board => {
            boardSelect.innerHTML += `<option value="${board.id}">${board.name}</option>`;
        });
    } catch (error) {
        console.error("Error loading boards:", error);
        showToast("Error loading boards");
    }
}

async function loadClasses(boardId) {
    try {
        const { data, error } = await window.supabaseClient
            .from("classes")
            .select("*")
            .eq("board_id", boardId)
            .eq("is_active", true)
            .order("id");

        if (error) throw error;

        classSelect.innerHTML = `<option value="">Select Class</option>`;
        if (data && data.length > 0) {
            data.forEach(cls => {
                classSelect.innerHTML += `<option value="${cls.id}">${cls.name}</option>`;
            });
        }
    } catch (error) {
        console.error("Error loading classes:", error);
        showToast("Error loading classes");
    }
}

async function loadSubjects(classId) {
    try {
        const { data, error } = await window.supabaseClient
            .from("subjects")
            .select("id, name, class_id, is_active")
            .eq("class_id", parseInt(classId))
            .eq("is_active", true)
            .order("sort_order");

        if (error) throw error;

        subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
        if (data && data.length > 0) {
            data.forEach(subject => {
                subjectSelect.innerHTML += `<option value="${subject.id}">${subject.name}</option>`;
            });
        }
    } catch (error) {
        console.error("Error loading subjects:", error);
        showToast("Error loading subjects");
    }
}

async function loadChapters(subjectId) {
    try {
        const { data, error } = await window.supabaseClient
            .from("chapters")
            .select("*")
            .eq("subject_id", Number(subjectId))
            .eq("is_active", true)
            .order("chapter_number");

        if (error) throw error;

        chapterSelect.innerHTML = `<option value="">Select Chapter</option>`;
        if (data && data.length > 0) {
            data.forEach(chapter => {
                chapterSelect.innerHTML += `<option value="${chapter.id}">Unit ${chapter.unit_number} • Chapter ${chapter.chapter_number} - ${chapter.title}</option>`;
            });
        }
    } catch (error) {
        console.error("Error loading chapters:", error);
        showToast("Error loading chapters");
    }
}

// =======================================================
// 4. DROPDOWNS - FILTERS (Board → Class → Subject chain)
// =======================================================

async function loadFilterBoards() {
    try {
        const { data, error } = await window.supabaseClient
            .from("boards")
            .select("*")
            .order("id");

        if (error) throw error;

        filterBoard.innerHTML = `<option value="">All Boards</option>`;
        if (data && data.length > 0) {
            data.forEach(board => {
                filterBoard.innerHTML += `<option value="${board.id}">${board.name}</option>`;
            });
        }
    } catch (error) {
        console.error("Error loading filter boards:", error);
    }
}

async function loadFilterClasses(boardId) {
    try {
        const { data, error } = await window.supabaseClient
            .from("classes")
            .select("*")
            .eq("board_id", boardId)
            .eq("is_active", true)
            .order("id");

        if (error) throw error;

        filterClass.innerHTML = `<option value="">All Classes</option>`;
        if (data && data.length > 0) {
            data.forEach(cls => {
                filterClass.innerHTML += `<option value="${cls.id}">${cls.name}</option>`;
            });
        }
    } catch (error) {
        console.error("Error loading filter classes:", error);
    }
}

async function loadFilterSubjects(classId) {
    try {
        const { data, error } = await window.supabaseClient
            .from("subjects")
            .select("*")
            .eq("class_id", classId)
            .eq("is_active", true)
            .order("sort_order");

        if (error) throw error;

        filterSubject.innerHTML = `<option value="">All Subjects</option>`;
        if (data && data.length > 0) {
            data.forEach(subject => {
                filterSubject.innerHTML += `<option value="${subject.id}">${subject.name}</option>`;
            });
        }
    } catch (error) {
        console.error("Error loading filter subjects:", error);
    }
}

// =======================================================
// 5. FETCH & RENDER MATERIALS
// =======================================================

async function loadMaterials() {

    try {
        showLoading();

        // Fetch study_materials with valid joins only
        // Using foreign key aliases to join subjects and chapters
        const { data, error } = await window.supabaseClient
            .from("study_materials")
            .select(`
                id,
                title,
                description,
                subject_id,
                chapter_id,
                material_type,
                pdf_url,
                youtube_url,
                sort_order,
                is_active,
                subjects!subject_id (id, name, class_id),
                chapters!chapter_id (id, title)
            `)
            .order("sort_order");

        hideLoading();

        if (error) throw error;
        console.log("Study Materials:", data);

        // Process data - subjects and chapters are already joined properly
        materials = (data || []).map(item => ({
            ...item,
            subject_name: item.subjects?.name || "-",
            chapter_name: item.chapters?.title || "-"
        }));

        renderTable(materials);
    } catch (error) {
        console.error("Error loading materials:", error);
        hideLoading();
        showToast("Error loading materials");
    }
}

function renderTable(list) {
    const emptyState = document.getElementById("emptyState");

    if (!list || list.length === 0) {
        tableBody.innerHTML = "";
        if (emptyState) emptyState.style.display = "block";
        return;
    }

    if (emptyState) emptyState.style.display = "none";

    tableBody.innerHTML = list.map((item, index) => {
        // Escape PDF URL for use in onclick
        const escapedPdfUrl = (item.pdf_url || "").replace(/'/g, "\\'");

        return `
        <tr>
            <td>${index + 1}</td>
            <td>${item.title || "-"}</td>
            <td>${item.subject_name || "-"}</td>
            <td>${item.chapter_name || "-"}</td>
            <td>${item.material_type || "-"}</td>
            <td>${item.thumbnail_url ? `<img src="${item.thumbnail_url}" alt="thumbnail" style="width:48px;height:48px;object-fit:cover;border-radius:6px;">` : "-"}</td>
            <td>${item.pdf_url ? `<button class="btn-outline btn-sm" onclick="openPdfModal('${escapedPdfUrl}')">View PDF</button>` : "-"}</td>
            <td>${item.youtube_url ? `<a href="${item.youtube_url}" target="_blank" class="btn-outline btn-sm">Watch Video</a>` : "-"}</td>
            <td>${item.is_active ? "✅" : "❌"}</td>
            <td>
                <button class="edit-btn" onclick="editMaterial(${item.id})">Edit</button>
                <button class="delete-btn" onclick="showDeleteModal(${item.id})">Delete</button>
            </td>
        </tr>
        `;
    }).join("");
}

// =======================================================
// 6. SEARCH (Title, Subject, Chapter)
// =======================================================

function applySearch() {
    try {
        const keyword = searchInput.value.toLowerCase().trim();

        let filtered = materials;

        if (keyword) {
            filtered = materials.filter(item => {
                const titleMatch = (item.title || "").toLowerCase().includes(keyword);
                const subjectMatch = (item.subject_name || "").toLowerCase().includes(keyword);
                const chapterMatch = (item.chapter_name || "").toLowerCase().includes(keyword);
                return titleMatch || subjectMatch || chapterMatch;
            });
        }

        // Apply filters on top of search
        applyFilters(filtered);
    } catch (error) {
        console.error("Search error:", error);
        renderTable(materials);
    }
}

// =======================================================
// 7. FILTERS (Board → Class → Subject → Material Type)
// =======================================================

async function applyFilters(searchResults = null) {
    try {
        let filtered = searchResults !== null ? searchResults : materials;

        // Apply filter conditions
        if (filterSubject.value) {
            filtered = filtered.filter(m => m.subject_id == filterSubject.value);
        }
        if (filterType.value) {
            filtered = filtered.filter(m => m.material_type === filterType.value);
        }

        renderTable(filtered);
    } catch (error) {
        console.error("Filter error:", error);
        renderTable(filtered);
    }
}

// =======================================================
// 8. PDF / DRIVE LINK HELPERS
// =======================================================

function isValidHttpUrl(value) {
    if (!value || typeof value !== "string") return false;
    const trimmed = value.trim();
    return /^https?:\/\//i.test(trimmed);
}

function getEmbeddablePdfUrl(url) {
    const trimmed = (url || "").trim();

    if (!trimmed) return "";

    if (trimmed.includes("drive.google.com/file") || trimmed.includes("drive.google.com/open")) {
        return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(trimmed)}`;
    }

    return trimmed;
}

// =======================================================
// 9. CRUD - SAVE (Insert / Update)
// =======================================================

async function saveMaterial(e) {
    e.preventDefault();

    try {
        // Validate required fields
        if (!boardSelect.value) {
            showToast("Please select a Board");
            return;
        }
        if (!classSelect.value) {
            showToast("Please select a Class");
            return;
        }
        if (!subjectSelect.value) {
            showToast("Please select a Subject");
            return;
        }
        if (!titleInput.value.trim()) {
            showToast("Please enter a Title");
            return;
        }
        if (!isValidHttpUrl(pdfInput.value)) {
            showToast("Please enter a valid PDF or Drive link.");
            return;
        }

        let materialTypeValue = materialTypeSelect.value;
        if (materialTypeValue === "others") {
            if (!customMaterialTypeInput.value.trim()) {
                showToast("Please enter a custom material type");
                return;
            }
            materialTypeValue = customMaterialTypeInput.value.trim();
        }

        const pdfUrl = pdfInput.value.trim();

        const payload = {
            subject_id: Number(subjectSelect.value),
            chapter_id: chapterSelect.value ? Number(chapterSelect.value) : null,
            material_type: materialTypeValue,   // ← changed from materialTypeSelect.value
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            pdf_url: pdfUrl,
            thumbnail_url: thumbnailInput.value.trim(),
            youtube_url: youtubeInput.value.trim(),
            sort_order: Number(sortOrderInput.value),
            is_active: isActiveCheckbox.checked
        };

        if (editingId !== null && editingId !== undefined) {
            const { error } = await window.supabaseClient
                .from("study_materials")
                .update(payload)
                .eq("id", editingId);
            console.log("Deleting ID:", deleteMaterialId);
            console.log("Delete Error:", error);

            if (error) {
                console.error("Update error:", error);
                throw error;
            }

            editingId = null;
            currentPdfUrl = null;
            showToast("Study material updated successfully!");
            document.getElementById("saveMaterialBtn").textContent = "Save Material";
        } else {
            const { error } = await window.supabaseClient
                .from("study_materials")
                .insert([payload]);

            if (error) {
                console.error("Insert error:", error);
                throw error;
            }

            showToast("Study material created successfully!");
        }

        materialForm.reset();
        currentPdfContainer.style.display = "none";
        currentThumbnailContainer.style.display = "none";
        customTypeContainer.style.display = "none";   // ← add this
        customMaterialTypeInput.value = "";
        await loadMaterials();
    } catch (error) {
        console.error("Save error:", error);
        showToast("Error: " + (error.message || "Failed to save material"));
    }
}

// =======================================================
// 10. CRUD - EDIT
// =======================================================

async function editMaterial(id) {
    try {
        const material = materials.find(m => m.id === id);

        if (!material) {
            showToast("Material not found");
            return;
        }

        editingId = id;
        currentPdfUrl = material.pdf_url || null;

        // Populate basic fields
        titleInput.value = material.title || "";
        descriptionInput.value = material.description || "";
        youtubeInput.value = material.youtube_url || "";
        const knownTypes = ["notes", "important_questions", "question_bank", "formula_sheet", "revision_notes", "assignment"];
        if (material.material_type && !knownTypes.includes(material.material_type)) {
            materialTypeSelect.value = "others";
            customTypeContainer.style.display = "block";
            customMaterialTypeInput.value = material.material_type;
        } else {
            materialTypeSelect.value = material.material_type || "notes";
            customTypeContainer.style.display = "none";
            customMaterialTypeInput.value = "";
        }
        sortOrderInput.value = material.sort_order || 1;
        isActiveCheckbox.checked = material.is_active !== false;
        pdfInput.value = material.pdf_url || "";

        thumbnailInput.value = material.thumbnail_url || "";
        if (material.thumbnail_url) {
            currentThumbnailContainer.style.display = "block";
            currentThumbnailPreview.src = material.thumbnail_url;
        } else {
            currentThumbnailContainer.style.display = "none";
        }

        // Populate current PDF link if exists
        if (material.pdf_url) {
            currentPdfContainer.style.display = "block";
            currentPdfLink.href = material.pdf_url;
            currentPdfLink.textContent = material.pdf_url;
        } else {
            currentPdfContainer.style.display = "none";
        }

        // Rebuild dropdown chain
        // We need to fetch the class and board based on subject
        await loadBoards();

        if (material.subject_id) {
            // Load all subjects to find the one matching subject_id
            const { data: allSubjects } = await window.supabaseClient
                .from("subjects")
                .select("id, name, class_id, is_active")
                .eq("is_active", true);

            const matchingSubject = allSubjects?.find(s => s.id === material.subject_id);

            if (matchingSubject) {
                // Load classes for the board
                const { data: allClasses } = await window.supabaseClient
                    .from("classes")
                    .select("*")
                    .eq("is_active", true);

                const matchingClass = allClasses?.find(c => c.id === matchingSubject.class_id);

                if (matchingClass) {
                    // Populate Board
                    boardSelect.value = matchingClass.board_id || "";

                    // Load classes for selected board
                    await loadClasses(matchingClass.board_id);
                    classSelect.value = matchingClass.id;

                    // Load subjects for selected class
                    await loadSubjects(matchingClass.id);
                    subjectSelect.value = material.subject_id;

                    // Load chapters for selected subject
                    await loadChapters(material.subject_id);
                    chapterSelect.value = material.chapter_id || "";
                }
            }
        } else {
            classSelect.innerHTML = `<option value="">Select Class</option>`;
            subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
            chapterSelect.innerHTML = `<option value="">Select Chapter</option>`;
        }

        document.getElementById("saveMaterialBtn").textContent = "Update Material";
        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
        console.error("Edit error:", error);
        showToast("Error loading material for editing");
    }
}

// =======================================================
// 11. CRUD - DELETE
// =======================================================

function showDeleteModal(id) {
    deleteMaterialId = id;
    deleteModal.classList.remove("hidden");
}

function closeDeleteModal() {
    deleteMaterialId = null;
    deleteModal.classList.add("hidden");
}

async function confirmDelete() {
    if (!deleteMaterialId) return;

    try {
        const { error } = await window.supabaseClient
            .from("study_materials")
            .delete()
            .eq("id", deleteMaterialId);

        if (error) throw error;

        closeDeleteModal();
        showToast("Material deleted successfully");
        await loadMaterials();
    } catch (error) {
        console.error("Delete error:", error);
        showToast("Error: " + (error.message || "Failed to delete material"));
    }
}

// =======================================================
// 12. MODALS - PDF Preview
// =======================================================

function openPdfModal(url) {

    const trimmedUrl = (url || "").trim();

    if (!trimmedUrl) {
        showToast("No PDF / Drive link available.");
        return;
    }

    window.open(trimmedUrl, "_blank", "noopener,noreferrer");

}

// =======================================================
// 13. RESET FORM
// =======================================================

function resetForm() {
    editingId = null;
    currentPdfUrl = null;
    materialForm.reset();
    currentPdfContainer.style.display = "none";
    currentThumbnailContainer.style.display = "none";
    document.getElementById("saveMaterialBtn").textContent = "Save Material";
}

// =======================================================
// 14. ATTACH EVENT LISTENERS
// =======================================================

function attachEventListeners() {
    // Form submit
    materialForm.addEventListener("submit", saveMaterial);

    // Reset button
    document.getElementById("resetMaterialBtn")?.addEventListener("click", resetForm);

    // Form dropdown chains
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

    // Filter dropdown chains
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

    // Search
    searchInput.addEventListener("input", applySearch);

    materialTypeSelect.addEventListener("change", () => {
        if (materialTypeSelect.value === "others") {
            customTypeContainer.style.display = "block";
            customMaterialTypeInput.required = true;
        } else {
            customTypeContainer.style.display = "none";
            customMaterialTypeInput.required = false;
            customMaterialTypeInput.value = "";
        }
    });

    // Delete modal
    document.getElementById("cancelDeleteBtn")?.addEventListener("click", closeDeleteModal);
    document.getElementById("confirmDeleteBtn")?.addEventListener("click", confirmDelete);

    // Close modals on background click
    deleteModal?.addEventListener("click", (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });
}