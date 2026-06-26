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
        console.error("Initialization error:", error);
        showToast("Error initializing page");
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
            .order("display_order");

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
            .order("display_order");

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

        // Join with subjects, chapters, classes, and boards to get complete data
        const { data, error } = await window.supabaseClient
            .from("study_materials")
            .select(`
                *,
                subjects:subject_id (id, name, class_id),
                chapters:chapter_id (id, title),
                classes:subjects.class_id (id, name, board_id),
                boards:subjects.class_id.board_id (id, name)
            `)
            .order("sort_order");

        hideLoading();

        if (error) throw error;

        // Process data to flatten relationships
        materials = (data || []).map(item => {
            const subjectData = Array.isArray(item.subjects) ? item.subjects[0] : item.subjects;
            const chapterData = Array.isArray(item.chapters) ? item.chapters[0] : item.chapters;
            
            return {
                ...item,
                subject_name: subjectData?.name || "-",
                chapter_name: chapterData?.title || "-",
            };
        });

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

    tableBody.innerHTML = list.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.title || "-"}</td>
            <td>${item.subject_name || "-"}</td>
            <td>${item.chapter_name || "-"}</td>
            <td>${item.material_type || "-"}</td>
            <td>${item.pdf_url ? `<button class="btn-outline btn-sm" onclick="openPdfModal('${item.pdf_url}')">View PDF</button>` : "-"}</td>
            <td>${item.youtube_url ? `<a href="${item.youtube_url}" target="_blank" class="btn-outline btn-sm">Watch Video</a>` : "-"}</td>
            <td>${item.is_active ? "✅" : "❌"}</td>
            <td>
                <button class="edit-btn" onclick="editMaterial(${item.id})">Edit</button>
                <button class="delete-btn" onclick="showDeleteModal(${item.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}

// =======================================================
// 6. SEARCH (Title, Subject, Chapter)
// =======================================================

function applySearch() {
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
}

// =======================================================
// 7. FILTERS (Board → Class → Subject → Material Type)
// =======================================================

function applyFilters(searchResults = null) {
    let filtered = searchResults !== null ? searchResults : materials;

    if (filterBoard.value || filterClass.value || filterSubject.value || filterType.value) {
        filtered = filtered.filter(m => {
            const boardMatch = !filterBoard.value || (m.subjects?.class_id ? true : false); // Simplified - would need more data
            const classMatch = !filterClass.value || (m.subjects?.class_id ? true : false); // Simplified
            const subjectMatch = !filterSubject.value || m.subject_id == filterSubject.value;
            const typeMatch = !filterType.value || m.material_type === filterType.value;
            return subjectMatch && typeMatch;
        });
    }

    renderTable(filtered);
}

// =======================================================
// 8. PDF UPLOAD
// =======================================================

async function uploadPDF(file) {
    try {
        if (!file || file.type !== 'application/pdf') {
            throw new Error("Please upload a valid PDF file");
        }

        const fileName = `${Date.now()}-${file.name}`;

        const { data, error } = await window.supabaseClient.storage
            .from("study-materials")
            .upload(fileName, file);

        if (error) throw error;

        // Get public URL
        const { data: publicData } = window.supabaseClient.storage
            .from("study-materials")
            .getPublicUrl(fileName);

        return publicData.publicUrl;
    } catch (error) {
        console.error("PDF upload error:", error);
        showToast("Error uploading PDF: " + error.message);
        throw error;
    }
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

        let pdfUrl = currentPdfUrl; // Default to existing PDF

        // Upload new PDF if selected
        if (pdfInput.files.length > 0) {
            pdfUrl = await uploadPDF(pdfInput.files[0]);
        }

        const payload = {
            subject_id: Number(subjectSelect.value),
            chapter_id: chapterSelect.value ? Number(chapterSelect.value) : null,
            material_type: materialTypeSelect.value,
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            pdf_url: pdfUrl,
            youtube_url: youtubeInput.value.trim(),
            sort_order: Number(sortOrderInput.value),
            is_active: isActiveCheckbox.checked
        };

        if (editingId) {
            // UPDATE
            const { error } = await window.supabaseClient
                .from("study_materials")
                .update(payload)
                .eq("id", editingId);

            if (error) throw error;

            editingId = null;
            currentPdfUrl = null;
            showToast("Study material updated successfully!");
            document.getElementById("saveMaterialBtn").textContent = "Save Material";
        } else {
            // INSERT
            const { error } = await window.supabaseClient
                .from("study_materials")
                .insert([payload]);

            if (error) throw error;

            showToast("Study material created successfully!");
        }

        materialForm.reset();
        currentPdfContainer.style.display = "none";
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
        materialTypeSelect.value = material.material_type || "notes";
        sortOrderInput.value = material.sort_order || 1;
        isActiveCheckbox.checked = material.is_active !== false;

        // Populate current PDF link if exists
        if (material.pdf_url) {
            currentPdfContainer.style.display = "block";
            currentPdfLink.href = material.pdf_url;
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
    if (!url) {
        showToast("No PDF URL available");
        return;
    }
    pdfPreviewFrame.src = url;
    pdfModal.classList.remove("hidden");
}

function closePdfModal() {
    pdfPreviewFrame.src = "";
    pdfModal.classList.add("hidden");
}

// =======================================================
// 13. RESET FORM
// =======================================================

function resetForm() {
    editingId = null;
    currentPdfUrl = null;
    materialForm.reset();
    currentPdfContainer.style.display = "none";
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

    // Delete modal
    document.getElementById("cancelDeleteBtn")?.addEventListener("click", closeDeleteModal);
    document.getElementById("confirmDeleteBtn")?.addEventListener("click", confirmDelete);

    // PDF modal
    document.getElementById("closePdfModal")?.addEventListener("click", closePdfModal);
    
    // Close modals on background click
    deleteModal?.addEventListener("click", (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });
    
    pdfModal?.addEventListener("click", (e) => {
        if (e.target === pdfModal) closePdfModal();
    });
}